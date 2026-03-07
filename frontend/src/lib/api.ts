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

  const queryString = qs.toString();
  const url = queryString ? `/api/transactions?${queryString}` : `/api/transactions`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());

  const raw = (await res.json()) as RawListTransactionsResponse;

  return {
    summary: raw.summary,
    transactions: (raw.transactions ?? []).map(normalizeTransaction),
  } satisfies ListTransactionsResponse;
}

export async function createTransaction(input: {
  name: string;
  amount: number;
  type: TransactionType;
}) {
  const res = await fetch(`/api/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.details || data?.message || "Erro ao criar transação");
  }

  return data;
}

export type Bill = {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
  createdAt: string;
};

export type ListBillsResponse = {
  bills: Bill[];
};

type RawBill = {
  ID?: string;
  Name?: string;
  Amount?: number;
  IsPaid?: boolean;
  CreatedAt?: string;
};

type RawListBillsResponse = {
  bills: RawBill[];
};

function normalizeBill(b: RawBill): Bill {
  return {
    id: b.ID ?? "",
    name: b.Name ?? "",
    amount: Number(b.Amount ?? 0),
    isPaid: Boolean(b.IsPaid),
    createdAt: b.CreatedAt ?? "",
  };
}

export async function listBills(): Promise<ListBillsResponse> {
  const res = await fetch(`/api/bills`);

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const raw = (await res.json()) as RawListBillsResponse;

  return {
    bills: (raw.bills ?? []).map(normalizeBill),
  };
}

export async function createBill(input: { name: string; amount: number }) {
  const res = await fetch(`/api/bills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.details || data?.message || "Erro ao criar conta");
  }

  return data;
}

export async function updateBillStatus(id: string, isPaid: boolean) {
  const res = await fetch(`/api/bills/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isPaid }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.details || data?.message || "Erro ao atualizar conta");
  }

  return data;
}
