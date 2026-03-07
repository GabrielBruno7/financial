type BalanceCardProps = {
  balance: number;
  hideAmounts?: boolean;
};

const BalanceCard = ({ balance, hideAmounts = false }: BalanceCardProps) => {
  const formatted = balance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="rounded-2xl border border-primary/20 bg-card p-6">
      <p className="text-sm text-muted-foreground">Saldo do mês</p>
      <h2 className="text-4xl font-bold text-foreground mt-2">
        {hideAmounts ? "R$ •••••" : formatted}
      </h2>
    </div>
  );
};

export default BalanceCard;