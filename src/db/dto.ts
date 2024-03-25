export interface TransactionDto {
  cashflow: string;
  category: string;
  paymentmode: string;
  amount: number;
  expenseDate: number; // the transaction date. yyyymmdd for simplicity, should be using epoch seconds or milliseconds
  note: string;
  // createdAt: number; // epoch
  id: number; // epoch
}

export interface TransactionsPaginatedDataDto {
  transactions: TransactionDto[];
  pagenum: number;
  totalPages: number;
  totalItems: number;
}

export interface ExpensesByCategoryDto {
  expenses: {
    expense: number;
    legend: string;
  }[];
  sumExpenses: number;
}

/**
 * @key months: number[] e.g. [10,11,12] meaning Oct,Nov,Dec. Assume same year
 * @key incomes: { month: number; amount: number }[] Array of monthly income for months listed in months
 * @key expenses: { month: number; amount: number }[] Array of monthly expense for months listed in months
 * @key balances: { month: number; amount: number }[] Array of monthly balance for months listed in months
 */
export interface MonthlyIncomeExpenseBalanceDto {
  months: number[];
  incomes: {
    month: number;
    amount: number;
  }[];
  expenses: {
    month: number;
    amount: number;
  }[];
  balances: {
    month: number;
    amount: number;
  }[];
}
