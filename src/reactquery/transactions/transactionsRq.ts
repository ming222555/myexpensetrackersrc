import { queryOptions, keepPreviousData } from '@tanstack/react-query';

import type { Filter } from '../../store/ducks/transactions/transactionsSlice';
import { retrieveTransactions, retrieveSumTransactionsAmount, retrieveExpensesByCategory } from '../../db/indexdb';

export interface TransactionDto {
  cashflow: string;
  category: string;
  paymentmode: string;
  amount: number;
  expenseDate: number; // yyyymmdd for simplicity
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchTransactions(pagenum: number, filter: Filter) {
  const response = await retrieveTransactions(pagenum, { ...filter });
  return response;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function transactionsQueryOptions(pagenum: number, filter: Filter, staleTime = -1) {
  if (staleTime < 0) {
    return queryOptions({
      queryKey: ['transactions', pagenum, filter],
      queryFn: async () => fetchTransactions(pagenum, filter),
      placeholderData: keepPreviousData,
      // use global default staleTime
    });
  }

  return queryOptions({
    queryKey: ['transactions', pagenum, filter],
    queryFn: async () => fetchTransactions(pagenum, filter),
    placeholderData: keepPreviousData,
    staleTime,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchSumTransactionsAmount(dateRange: string) {
  const response = await retrieveSumTransactionsAmount(dateRange);
  return response;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function sumTransactionsAmountQueryOptions(dateRange: string, staleTime = -1) {
  if (staleTime < 0) {
    return queryOptions({
      queryKey: ['sumTransactionsAmount', dateRange],
      queryFn: async () => fetchSumTransactionsAmount(dateRange),
      placeholderData: keepPreviousData,
      // use global default staleTime
    });
  }

  return queryOptions({
    queryKey: ['sumTransactionsAmount', dateRange],
    queryFn: async () => fetchSumTransactionsAmount(dateRange),
    placeholderData: keepPreviousData,
    staleTime,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchExpensesByCategory(dateRange: string) {
  const response = await retrieveExpensesByCategory(dateRange);
  return response;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function expensesByCategoryQueryOptions(dateRange: string, staleTime = -1) {
  if (staleTime < 0) {
    return queryOptions({
      queryKey: ['expensesByCategory', dateRange],
      queryFn: async () => fetchExpensesByCategory(dateRange),
      placeholderData: keepPreviousData,
      // use global default staleTime
    });
  }

  return queryOptions({
    queryKey: ['expensesByCategory', dateRange],
    queryFn: async () => fetchExpensesByCategory(dateRange),
    placeholderData: keepPreviousData,
    staleTime,
  });
}
