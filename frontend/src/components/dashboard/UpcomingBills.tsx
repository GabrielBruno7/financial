import { useMemo, useState } from "react";
import {
  CalendarClock,
  CreditCard,
  FileText,
  Plus,
  CheckCircle2,
  Undo2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createBill, createTransaction, updateBillStatus, type Bill } from "@/lib/api";

type Props = {
  bills: Bill[];
  onBillsChanged?: () => Promise<void> | void;
};

const UpcomingBills = ({ bills, onBillsChanged }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amountCents, setAmountCents] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [creatingExpenseId, setCreatingExpenseId] = useState<string | null>(null);

  const onTogglePaid = async (bill: Bill) => {
    try {
      setError(null);
      setUpdatingId(bill.id);
      await updateBillStatus(bill.id, !bill.isPaid);
      await onBillsChanged?.();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao atualizar conta");
    } finally {
      setUpdatingId(null);
    }
  };

  const onCreateExpenseFromBill = async (bill: Bill) => {
    try {
      setError(null);
      setCreatingExpenseId(bill.id);

      await createTransaction({
        name: bill.name,
        amount: bill.amount,
        type: "expense",
      });

      await onBillsChanged?.();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao lançar conta como despesa");
    } finally {
      setCreatingExpenseId(null);
    }
  };

  const pendingCount = useMemo(() => {
    return bills.filter((bill) => !bill.isPaid).length;
  }, [bills]);

  const formatInputBRL = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const parseToCents = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  };

  const formatAmount = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatCreatedAt = (value: string) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("pt-BR");
  };

  const getBillIcon = (billName: string) => {
    const normalized = billName.toLowerCase();

    if (normalized.includes("cartão")) return CreditCard;

    return FileText;
  };

  const onSave = async () => {
    try {
      setError(null);
      setSaving(true);

      const value = amountCents / 100;

      if (!name.trim()) throw new Error("Nome é obrigatório");
      if (!Number.isFinite(value) || value <= 0) throw new Error("Valor inválido");

      await createBill({
        name: name.trim(),
        amount: value,
      });

      setOpen(false);
      setName("");
      setAmountCents(0);

      await onBillsChanged?.();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao criar conta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-in"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-warning" />
          <h2 className="text-base font-display font-semibold text-foreground">Contas a pagar</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {pendingCount} pendentes
          </span>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary" className="rounded-xl">
                <Plus className="w-4 h-4 mr-1" />
                Nova conta
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nova conta</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Conta de luz"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    inputMode="numeric"
                    value={formatInputBRL(amountCents)}
                    onChange={(e) => setAmountCents(parseToCents(e.target.value))}
                    placeholder="R$ 0,00"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button onClick={onSave} disabled={saving}>
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <div className="space-y-3">
        {bills.length === 0 && (
          <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
            Nenhuma conta cadastrada ainda.
          </div>
        )}

        {bills.map((bill) => {
          const Icon = getBillIcon(bill.name);

          return (
            <div
              key={bill.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                bill.isPaid ? "bg-secondary/50 opacity-60" : "bg-secondary hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">{bill.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Criada em {formatCreatedAt(bill.createdAt)}
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1">
                <p className="text-sm font-semibold text-foreground">
                  {formatAmount(bill.amount)}
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${
                      bill.isPaid ? "text-primary" : "text-yellow-500"
                    }`}
                  >
                    {bill.isPaid ? "Pago" : "Pendente"}
                  </span>

                  <button
                    type="button"
                    onClick={() => onCreateExpenseFromBill(bill)}
                    disabled={creatingExpenseId === bill.id}
                    className="p-1.5 rounded-lg bg-muted hover:bg-accent transition-colors disabled:opacity-50"
                    title="Lançar como despesa"
                  >
                    {creatingExpenseId === bill.id ? (
                      <span className="text-[10px] text-muted-foreground px-1">...</span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onTogglePaid(bill)}
                    disabled={updatingId === bill.id}
                    className="p-1.5 rounded-lg bg-muted hover:bg-accent transition-colors disabled:opacity-50"
                    title={bill.isPaid ? "Marcar como pendente" : "Marcar como pago"}
                  >
                    {updatingId === bill.id ? (
                      <span className="text-[10px] text-muted-foreground px-1">...</span>
                    ) : bill.isPaid ? (
                      <Undo2 className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingBills;
