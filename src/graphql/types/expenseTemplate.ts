import type { ExpenseCategory } from "@/graphql/types/expenses";

export type ExpenseTransactionTemplate = {
  id: string;
  describtion: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  category: ExpenseCategory | null;
};

