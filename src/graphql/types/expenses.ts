export type Expense = {
  id: string;
  title: string;
  currency: string | null;
  archived: boolean;
  monthlyRecurring: boolean;
  spendingLimit: number | null;
  sum: number;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseTransaction = {
  id: string;
  describtion: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  category: ExpenseCategory | null;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

