import { queryOptions, keepPreviousData } from '@tanstack/react-query';

import type { Filter } from '../../store/ducks/transactions/transactionsSlice';
import {
  retrieveTransactions,
  retrieveTransactionsRecent,
  retrieveSumTransactionsAmount,
  retrieveSumIncomes,
  retrieveMonthlyIncomeExpenseBalance,
  retrieveExpensesByCategory,
} from '../../db/indexdb';
import queryClient from '../../reactquery';

const defaultOptions = queryClient.getDefaultOptions();
const defaultStaleTime = defaultOptions.queries ? defaultOptions.queries.staleTime : 0;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchTransactions(pagenum: number, filter: Filter) {
  try {
    const response = await retrieveTransactions(pagenum, { ...filter });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw err;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function transactionsQueryOptions(pagenum: number, filter: Filter, staleTime = -1) {
  return queryOptions({
    queryKey: ['transactions', pagenum, filter],
    queryFn: async () => fetchTransactions(pagenum, filter),
    placeholderData: keepPreviousData,
    staleTime: staleTime < 0 ? defaultStaleTime : staleTime,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchTransactionsRecent(dateRange: string) {
  try {
    const response = await retrieveTransactionsRecent(dateRange);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw err;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function transactionsRecentQueryOptions(dateRange: string, staleTime = -1) {
  return queryOptions({
    queryKey: ['transactionsrecent', dateRange],
    queryFn: async () => fetchTransactionsRecent(dateRange),
    placeholderData: keepPreviousData,
    staleTime: staleTime < 0 ? defaultStaleTime : staleTime,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchSumIncomes(dateRange: string) {
  try {
    const response = await retrieveSumIncomes(dateRange);
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw err;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function sumIncomesQueryOptions(dateRange: string, staleTime = -1) {
  return queryOptions({
    queryKey: ['sumIncomes', dateRange],
    queryFn: async () => fetchSumIncomes(dateRange),
    placeholderData: keepPreviousData,
    staleTime: staleTime < 0 ? defaultStaleTime : staleTime,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchMonthlyIncomeExpenseBalance(months: number[]) {
  const response = await retrieveMonthlyIncomeExpenseBalance(months);
  return response;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function monthlyIncomeExpenseBalanceQueryOptions(months: number[], staleTime = -1) {
  return queryOptions({
    queryKey: ['monthlyIncomeExpenseBalance', [months]],
    queryFn: async () => fetchMonthlyIncomeExpenseBalance(months),
    placeholderData: keepPreviousData,
    staleTime: staleTime < 0 ? defaultStaleTime : staleTime,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchSumTransactionsAmount(dateRange: string) {
  const response = await retrieveSumTransactionsAmount(dateRange);
  return response;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function sumTransactionsAmountQueryOptions(dateRange: string, staleTime = -1) {
  return queryOptions({
    queryKey: ['sumTransactionsAmount', dateRange],
    queryFn: async () => fetchSumTransactionsAmount(dateRange),
    placeholderData: keepPreviousData,
    staleTime: staleTime < 0 ? defaultStaleTime : staleTime,
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchExpensesByCategory(dateRange: string) {
  const response = await retrieveExpensesByCategory(dateRange);
  return response;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function expensesByCategoryQueryOptions(dateRange: string, staleTime = -1) {
  return queryOptions({
    queryKey: ['expensesByCategory', dateRange],
    queryFn: async () => fetchExpensesByCategory(dateRange),
    placeholderData: keepPreviousData,
    staleTime: staleTime < 0 ? defaultStaleTime : staleTime,
  });
}
