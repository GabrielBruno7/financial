import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  type: "income" | "expense";
  delay?: string;
}

const SummaryCard = ({ title, value, icon: Icon, type, delay = "0s" }: SummaryCardProps) => {
  const colorClass = type === "income" ? "text-income" : "text-expense";
  const bgClass = type === "income" ? "bg-income/10" : "bg-expense/10";
  const borderClass = type === "income" ? "border-income/15" : "border-expense/15";

  return (
    <div
      className={`rounded-2xl border ${borderClass} bg-card p-5 opacity-0 animate-fade-in`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={`p-2 rounded-xl ${bgClass}`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
      </div>
      <p className={`text-2xl font-display font-bold ${colorClass}`}>
        R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default SummaryCard;
