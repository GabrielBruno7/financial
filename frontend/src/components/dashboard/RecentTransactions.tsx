import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Transaction } from "@/lib/api";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

function formatDate(t: Transaction) {
  const raw = t.createdAt;
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd MMM yyyy", { locale: ptBR });
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-display font-semibold text-foreground">Transações Recentes</h2>
        <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-2">
        {transactions.length === 0 && (
          <div className="text-sm text-muted-foreground">Nenhuma transação ainda.</div>
        )}

        {transactions.map((t) => {
          const date = formatDate(t);

          return (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${t.type === "income" ? "bg-income/10" : "bg-expense/10"}`}>
                  {t.type === "income" ? (
                    <ArrowDownLeft className="w-4 h-4 text-income" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-expense" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{date}</p>
                </div>
              </div>

              <p className={`text-sm font-semibold ${t.type === "income" ? "text-income" : "text-expense"}`}>
                {t.type === "income" ? "+" : "-"} R$ {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;