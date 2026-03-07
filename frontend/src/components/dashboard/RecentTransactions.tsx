import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Transaction, TransactionType } from "@/lib/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RecentTransactionsProps = {
  transactions: Transaction[];
  onCreateTransaction: (payload: {
    name: string;
    amount: number;
    type: TransactionType;
  }) => Promise<void>;
};

const ITEMS_PER_PAGE = 6;

function formatDate(t: Transaction) {
  const raw = t.createdAt;
  if (!raw) return "—";

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";

  return format(d, "dd MMM yyyy", { locale: ptBR });
}

const RecentTransactions = ({
  transactions,
  onCreateTransaction,
}: RecentTransactionsProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [amountCents, setAmountCents] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE));

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return transactions.slice(start, end);
  }, [transactions, page]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const formatBRL = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatAmount = (amount: number) =>
    amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const parseToCents = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  };

  const resetForm = () => {
    setName("");
    setType("expense");
    setAmountCents(0);
    setFormError(null);
  };

  const onSave = async () => {
    try {
      setFormError(null);
      setSaving(true);

      const value = amountCents / 100;

      if (!name.trim()) throw new Error("Nome é obrigatório");
      if (!Number.isFinite(value) || value <= 0) throw new Error("Valor inválido");

      await onCreateTransaction({
        name: name.trim(),
        amount: value,
        type,
      });

      setOpen(false);
      resetForm();
    } catch (e: any) {
      setFormError(e?.message ?? "Erro ao criar transação");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-in"
      style={{ animationDelay: "0.4s" }}
    >
      <div className="flex items-center justify-between mb-5 gap-3">
        <h2 className="text-base font-display font-semibold text-foreground">
          Transações Recentes
        </h2>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value && !saving) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Nova transação
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova transação</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Supermercado"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Entrada</SelectItem>
                      <SelectItem value="expense">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    inputMode="numeric"
                    value={formatBRL(amountCents)}
                    onChange={(e) => setAmountCents(parseToCents(e.target.value))}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

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

      <div className="space-y-2 min-h-[420px]">
        {transactions.length === 0 && (
          <div className="rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
            Nenhuma transação ainda.
          </div>
        )}

        {paginatedTransactions.map((t) => {
          const date = formatDate(t);
          const isIncome = t.type === "income";

          return (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isIncome ? "bg-income/10" : "bg-expense/10"
                  }`}
                >
                  {isIncome ? (
                    <ArrowDownLeft className="w-4 h-4 text-income" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-expense" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
              </div>

              <p
                className={`text-sm font-semibold ml-3 shrink-0 ${
                  isIncome ? "text-income" : "text-expense"
                }`}
              >
                {isIncome ? "+" : "-"} {formatAmount(t.amount)}
              </p>
            </div>
          );
        })}
      </div>

      {transactions.length > ITEMS_PER_PAGE && (
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
              <ChevronLeft className="w-4 h-4 mr-1" />
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
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;