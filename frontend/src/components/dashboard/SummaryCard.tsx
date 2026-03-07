type SummaryCardProps = {
  title: string;
  value: number;
  icon: any;
  type: "income" | "expense";
  delay?: string;
  hideAmounts?: boolean;
};

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  type,
  delay,
  hideAmounts = false,
}: SummaryCardProps) => {
  const formatted = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div
      className="rounded-2xl border border-border bg-card p-6"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>

      <h3
        className={`mt-4 text-2xl font-bold ${
          type === "income" ? "text-income" : "text-expense"
        }`}
      >
        {hideAmounts ? "R$ •••••" : formatted}
      </h3>
    </div>
  );
};

export default SummaryCard;