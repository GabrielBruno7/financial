import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Bell, Search } from "lucide-react";

import BalanceCard from "@/components/dashboard/BalanceCard";
import SummaryCard from "@/components/dashboard/SummaryCard";
import UpcomingBills from "@/components/dashboard/UpcomingBills";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

import {
  listTransactions,
  createTransaction,
  listBills,
  type ListTransactionsResponse,
  type Bill,
} from "@/lib/api";

const Index = () => {
  const [data, setData] = useState<ListTransactionsResponse | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Olá, bem-vindo de volta 👋
            </p>
            <h1 className="text-xl font-display font-bold text-foreground">
              Meu Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
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
        {loading && (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        )}

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <UpcomingBills bills={bills} onBillsChanged={refresh} />

              <RecentTransactions
                transactions={data.transactions}
                onCreateTransaction={async (payload) => {
                  await createTransaction(payload);
                  await refresh();
                }}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;