import { queryOptions, keepPreviousData } from '@tanstack/react-query';

import type { FiltersWithSearch } from '../../store/ducks/transactions/transactionsSlice';

const transactionsApiUrl = 'http://localhost:8081/api/transactions/';

interface TransactionsPaginatedDataDto {
  transactions: string[];
  pagenum: number;
  totalPages: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function fetchTransactions(pagenum: string, filter: FiltersWithSearch, signal: AbortSignal) {
  const qs = new URLSearchParams({ ...filter, pagenum }).toString();
  const response = await fetch(transactionsApiUrl + '?' + qs, { signal });
  if (!response.ok) {
    // throw new Error('Transactions api response was not ok');
    // throw new Response('Transactions api response was not okyyyyyyy', { status: response.status });
    throw response;
  }
  return response.json() as Promise<TransactionsPaginatedDataDto>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function transactionsQueryOptions(pagenum: number, filter: FiltersWithSearch) {
  return queryOptions({
    queryKey: ['transactions', pagenum, filter],
    queryFn: async ({ signal }) => fetchTransactions(pagenum + '', filter, signal),
    placeholderData: keepPreviousData,
  });
}
