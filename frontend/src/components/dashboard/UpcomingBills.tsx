import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  CreditCard,
  FileText,
  Plus,
  CheckCircle2,
  Undo2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createBill,
  createTransaction,
  updateBillStatus,
  type Bill,
} from "@/lib/api";

type Props = {
  bills: Bill[];
  onBillsChanged?: () => Promise<void> | void;
  hideAmounts?: boolean;
};

const ITEMS_PER_PAGE = 5;

const UpcomingBills = ({
  bills,
  onBillsChanged,
  hideAmounts = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amountCents, setAmountCents] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [creatingExpenseId, setCreatingExpenseId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const pendingCount = useMemo(() => {
    return bills.filter((bill) => !bill.isPaid).length;
  }, [bills]);

  const totalPages = Math.max(1, Math.ceil(bills.length / ITEMS_PER_PAGE));

  const paginatedBills = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return bills.slice(start, end);
  }, [bills, page]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

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

  const resetForm = () => {
    setName("");
    setAmountCents(0);
    setError(null);
  };

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
      resetForm();

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
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-warning" />
          <h2 className="text-base font-display font-semibold text-foreground">
            Contas a pagar
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
            {pendingCount} pendentes
          </span>

          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value && !saving) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary" className="rounded-xl">
                <Plus className="mr-1 h-4 w-4" />
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
                  <Button
                    variant="secondary"
                    onClick={() => setOpen(false)}
                    disabled={saving}
                  >
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

      <div className="space-y-3 min-h-[420px]">
        {bills.length === 0 && (
          <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
            Nenhuma conta cadastrada ainda.
          </div>
        )}

        {paginatedBills.map((bill) => {
          const Icon = getBillIcon(bill.name);

          return (
            <div
              key={bill.id}
              className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
                bill.isPaid
                  ? "bg-secondary/50 opacity-60"
                  : "bg-secondary hover:bg-accent"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="shrink-0 rounded-lg bg-muted p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {bill.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Criada em {formatCreatedAt(bill.createdAt)}
                  </p>
                </div>
              </div>

              <div className="ml-3 flex shrink-0 flex-col items-end gap-1 text-right">
                <p className="text-sm font-semibold text-foreground">
                  {hideAmounts ? "R$ •••••" : formatAmount(bill.amount)}
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
                    className="rounded-lg bg-muted p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
                    title="Lançar como despesa"
                  >
                    {creatingExpenseId === bill.id ? (
                      <span className="px-1 text-[10px] text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onTogglePaid(bill)}
                    disabled={updatingId === bill.id}
                    className="rounded-lg bg-muted p-1.5 transition-colors hover:bg-accent disabled:opacity-50"
                    title={bill.isPaid ? "Marcar como pendente" : "Marcar como pago"}
                  >
                    {updatingId === bill.id ? (
                      <span className="px-1 text-[10px] text-muted-foreground">
                        ...
                      </span>
                    ) : bill.isPaid ? (
                      <Undo2 className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bills.length > ITEMS_PER_PAGE && (
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Página {page} de {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-xl"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className="rounded-xl"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Próxima
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingBills;