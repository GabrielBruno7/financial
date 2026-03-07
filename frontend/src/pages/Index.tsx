import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Bell, Search, Plus } from "lucide-react";

import BalanceCard from "@/components/dashboard/BalanceCard";
import SummaryCard from "@/components/dashboard/SummaryCard";
import UpcomingBills from "@/components/dashboard/UpcomingBills";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

import {
  listTransactions,
  createTransaction,
  listBills,
  type ListTransactionsResponse,
  type TransactionType,
  type Bill,
} from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [data, setData] = useState<ListTransactionsResponse | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [amountCents, setAmountCents] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setError(null);
      setLoading(true);

      const [transactionsRes, billsRes] = await Promise.all([
        listTransactions(),
        listBills(),
      ]);

      setData(transactionsRes);
      setBills(billsRes.bills);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao buscar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const formatBRL = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const parseToCents = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  };

  const onSave = async () => {
    try {
      setFormError(null);
      setSaving(true);

      const value = amountCents / 100;

      if (!name.trim()) throw new Error("Nome é obrigatório");
      if (!Number.isFinite(value) || value <= 0) throw new Error("Valor inválido");

      await createTransaction({
        name: name.trim(),
        amount: value,
        type,
      });

      setOpen(false);
      setName("");
      setType("expense");
      setAmountCents(0);

      await refresh();
    } catch (e: any) {
      setFormError(e?.message ?? "Erro ao criar transação");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Olá, bem-vindo de volta 👋</p>
            <h1 className="text-xl font-display font-bold text-foreground">Meu Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={open} onOpenChange={setOpen}>
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

            <button className="p-2.5 rounded-xl bg-secondary hover:bg-accent transition-colors">
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>

            <button className="p-2.5 rounded-xl bg-secondary hover:bg-accent transition-colors relative">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {loading && <div className="text-sm text-muted-foreground">Carregando...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}

        {data && (
          <>
            <BalanceCard balance={data.summary.balance} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SummaryCard
                title="Total Entradas"
                value={data.summary.totalIncome}
                icon={TrendingUp}
                type="income"
                delay="0.1s"
              />
              <SummaryCard
                title="Total Saídas"
                value={data.summary.totalExpense}
                icon={TrendingDown}
                type="expense"
                delay="0.2s"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UpcomingBills bills={bills} onBillsChanged={refresh} />
              <RecentTransactions transactions={data.transactions} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
