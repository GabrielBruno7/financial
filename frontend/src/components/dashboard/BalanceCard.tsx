import { Wallet } from "lucide-react";

type BalanceCardProps = {
  balance: number;
};

const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 animate-fade-in">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Saldo do mês</span>
        </div>
        <p className="text-4xl font-display font-bold text-foreground tracking-tight mt-4">
          R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;