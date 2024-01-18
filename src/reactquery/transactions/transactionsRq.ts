import { queryOptions, keepPreviousData } from '@tanstack/react-query';

import type { FiltersWithSearch } from '../../store/ducks/transactions/transactionsSlice';
import { retrieveTransactions } from '../../db/indexdb';

export interface TransactionDto {
  cashflow: string;
  category: string;
  paymentmode: string;
  amount: number;
  expenseDate: number; // yyyymmdd for simplicity
  note: string;
  createdAt: number; // epoch
}

export interface TransactionsPaginatedDataDto {
  transactions: TransactionDto[];
  pagenum: number;
  totalPages: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchTransactions(pagenum: number, filter: FiltersWithSearch) {
  const response = await retrieveTransactions(pagenum, { ...filter });
  return response;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function transactionsQueryOptions(pagenum: number, filter: FiltersWithSearch) {
  return queryOptions({
    queryKey: ['transactions', pagenum, filter],
    queryFn: async () => fetchTransactions(pagenum, filter),
    placeholderData: keepPreviousData,
  });
}
