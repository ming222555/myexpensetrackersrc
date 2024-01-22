import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';

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
      id: 589460,
    },
    {
      cashflow: 'expense',
      category: 'utilities',
      paymentmode: 'debitcard',
      amount: 666555.99,
      expenseDate: 20231128,
      note: 'Notist',
      id: 777777777,
    },
    {
      cashflow: 'income',
      category: 'utilities',
      paymentmode: 'debitcard',
      amount: 666111.99,
      expenseDate: 20231128,
      note: 'Notist',
      id: 999460,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 666888.99,
      expenseDate: 20231111,
      note: 'Notedfoodie',
      id: 666888,
    },
    {
      cashflow: 'expense',
      category: 'clothing',
      paymentmode: 'creditcard',
      amount: 654321.99,
      expenseDate: 20231129,
      note: 'Noteee',
      id: 895478666,
    },
    {
      cashflow: 'income',
      category: 'transport',
      paymentmode: 'cash',
      amount: 111666.99,
      expenseDate: 20231128,
      note: 'Notable',
      id: 666666666,
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
  let totalPages = 0;
  let totalItems = 0;

  await fakeNetwork();
  let transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    transactions = [];
  } else {
    console.log('retrieveTransactions pagenum ' + pagenum, JSON.stringify(filter));
    let filteringTerms = filter.cashflow.split(',');
    if (filteringTerms.length === 1 && filteringTerms[0] === '') {
      //
    } else {
      transactions = transactions.filter(trx => filteringTerms.includes(trx.cashflow));
    }

    filteringTerms = filter.categories.split(',');
    if (filteringTerms.length === 1 && filteringTerms[0] === '') {
      //
    } else {
      transactions = transactions.filter(trx => filteringTerms.includes(trx.category));
    }

    filteringTerms = filter.paymentmode.split(',');
    if (filteringTerms.length === 1 && filteringTerms[0] === '') {
      //
    } else {
      transactions = transactions.filter(trx => filteringTerms.includes(trx.paymentmode));
    }

    if (transactions.length > 0) {
      const searchText = filter.search.trim();
      console.log('retrieveTransactions searchText.' + searchText + '.');
      console.log('retrieveTransactions transactions ' + pagenum, JSON.stringify(transactions));
      transactions = matchSorter(transactions, searchText, { keys: ['category', 'paymentmode', 'note'] });

      if (transactions.length > 0) {
        // todo... identify transactions of pagenum... determine totalPages, totalItems
        console.log('retrieveTransactions transactions after matchSorter', JSON.stringify(transactions));
        transactions.sort(sortBy<TransactionDto>('-expenseDate', '-id'));
        totalPages = 666;
        totalItems = 888;
      }
    }
  }

  const ret: TransactionsPaginatedDataDto = {
    transactions,
    pagenum,
    totalPages,
    totalItems,
  };

  return ret;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function updateTransaction(updates: TransactionDto) {
  await fakeNetwork();
  let transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    transactions = [];
  }
  const pos = transactions.findIndex(trx => trx.id === updates.id);
  if (pos < 0) throw new Error('Transaction id ' + updates.id + ' not found');

  const origTransaction = transactions[pos];
  const newTransaction = { ...origTransaction, ...updates };
  transactions[pos] = newTransaction;
  await set(transactions);
  return newTransaction;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function createTransaction(creationDetails: Omit<TransactionDto, 'id'>) {
  await fakeNetwork();
  let transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    transactions = [];
  }
  const newId = Date.now();
  transactions.unshift({ ...creationDetails, id: newId });
  await set(transactions);
  console.log('newId', newId);
  return newId;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function set(transactions: TransactionDto[]) {
  return localforage.setItem('transactions', transactions);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function fakeNetwork() {
  return new Promise(resolve => {
    setTimeout(resolve, Math.random() * 8000); // 800
  });
}
