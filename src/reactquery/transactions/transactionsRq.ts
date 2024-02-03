import { queryOptions, keepPreviousData } from '@tanstack/react-query';

import type { Filter } from '../../store/ducks/transactions/transactionsSlice';
import { retrieveTransactions } from '../../db/indexdb';

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
