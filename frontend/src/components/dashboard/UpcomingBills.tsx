import { useState } from "react";
import { CalendarClock, CreditCard, Zap, Home, Wifi, Plus } from "lucide-react";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { createTransaction, type TransactionType } from "@/lib/api";

interface Bill {
  id: number;
  name: string;
  value: number;
  dueDate: string;
  icon: LucideIcon;
  paid: boolean;
}

const bills: Bill[] = [
  { id: 1, name: "Aluguel", value: 2200, dueDate: "05 Mar", icon: Home, paid: false },
  { id: 2, name: "Cartão de Crédito", value: 1850.4, dueDate: "10 Mar", icon: CreditCard, paid: false },
  { id: 3, name: "Energia", value: 285.9, dueDate: "15 Mar", icon: Zap, paid: false },
  { id: 4, name: "Internet", value: 129.9, dueDate: "20 Mar", icon: Wifi, paid: true },
];

type Props = {
  onTransactionCreated?: () => Promise<void> | void;
};

const UpcomingBills = ({ onTransactionCreated }: Props) => {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");

  // valor guardado em centavos pra formatar como dinheiro enquanto digita
  const [amountCents, setAmountCents] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingCount = bills.filter((b) => !b.paid).length;

  const formatBRL = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const parseToCents = (raw: string) => {
    const digits = raw.replace(/\D/g, ""); // mantém só números
    return digits ? Number(digits) : 0;
  };

  const onSave = async () => {
    try {
      setError(null);
      setSaving(true);

      const value = amountCents / 100;

      if (!name.trim()) throw new Error("Nome é obrigatório");
      if (!Number.isFinite(value) || value <= 0) throw new Error("Valor inválido");

      await createTransaction({ name: name.trim(), amount: value, type });

      // fecha e limpa
      setOpen(false);
      setName("");
      setType("expense");
      setAmountCents(0);

      // avisa o Index pra atualizar
      await onTransactionCreated?.();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao criar transação");
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
          <h2 className="text-base font-display font-semibold text-foreground">Contas Próximas</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {pendingCount} pendentes
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
              bill.paid ? "bg-secondary/50 opacity-60" : "bg-secondary hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <bill.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{bill.name}</p>
                <p className="text-xs text-muted-foreground">Vence {bill.dueDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                R$ {bill.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              {bill.paid && <span className="text-xs text-primary font-medium">Pago</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingBills;