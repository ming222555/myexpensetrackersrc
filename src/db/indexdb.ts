import localforage from 'localforage';

import type { FiltersWithSearch } from '../store/ducks/transactions/transactionsSlice';
import { TransactionDto, TransactionsPaginatedDataDto } from '../reactquery/transactions/transactionsRq';

const seed = async (): Promise<void> => {
  const initialData: TransactionDto[] = [
    {
      cashflow: 'income',
      category: 'food',
      paymentmode: 'cash',
      amount: 123456.99,
      expenseDate: 20231130,
      note: 'Noted',
      createdAt: 589460,
    },
    {
      cashflow: 'expense',
      category: 'clothing',
      paymentmode: 'creditcard',
      amount: 654321.99,
      expenseDate: 20231129,
      note: 'Noteee',
      createdAt: 895478666,
    },
  ];
  const transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    set(initialData);
  }
};

seed();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function retrieveTransactions(pagenum: number, filter: FiltersWithSearch) {
  await fakeNetwork();
  let transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    transactions = [];
  } else {
    // Todo filter, sort by createdAt transactions and also to determine totalPages
    // transactions = ...;
  }

  const ret: TransactionsPaginatedDataDto = {
    transactions,
    pagenum: 1,
    totalPages: 6,
  };

  return ret;
}

function set(transactions: TransactionDto[]): void {
  localforage.setItem('transactions', transactions);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function fakeNetwork() {
  return new Promise(resolve => {
    setTimeout(resolve, Math.random() * 800);
  });
}
