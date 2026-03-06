export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  createdAt?: string;
};

export type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type ListTransactionsResponse = {
  summary: Summary;
  transactions: Transaction[];
};

type RawTransaction = {
  ID?: string;
  Name?: string;
  Amount?: number;
  Type?: TransactionType;
  CreatedAt?: string;
};

type RawListTransactionsResponse = {
  summary: Summary;
  transactions: RawTransaction[];
};

function normalizeTransaction(t: RawTransaction): Transaction {
  return {
    id: t.ID ?? "",
    name: t.Name ?? "",
    amount: Number(t.Amount ?? 0),
    type: (t.Type ?? "expense") as TransactionType,
    createdAt: t.CreatedAt,
  };
}

export async function listTransactions(params?: { startDate?: string; endDate?: string }) {
  const qs = new URLSearchParams();
  if (params?.startDate) qs.set("start_date", params.startDate);
  if (params?.endDate) qs.set("end_date", params.endDate);

  const res = await fetch(`/api/transactions?${qs.toString()}`);
  if (!res.ok) throw new Error(await res.text());

  const raw = (await res.json()) as RawListTransactionsResponse;

  return {
    summary: raw.summary,
    transactions: (raw.transactions ?? []).map(normalizeTransaction),
  } satisfies ListTransactionsResponse;
}

export async function createTransaction(input: { name: string; amount: number; type: TransactionType }) {
  const res = await fetch(`/api/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error(await res.text());

  return res.json();
}