import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';

import type { Filter } from '../store/ducks/transactions/transactionsSlice';
import { TransactionDto, TransactionsPaginatedDataDto } from '../reactquery/transactions/transactionsRq';

export const tblCashflows = [
  { name: 'income', label: 'Income' },
  { name: 'expense', label: 'Expense' },
];

export const tblCategories = [
  { name: 'bills', label: 'Bills' },
  { name: 'business', label: 'Business' },
  { name: 'clothing', label: 'Clothing' },
  { name: 'education', label: 'Education' },
  { name: 'extraincome', label: 'Extra income' },
  { name: 'food', label: 'Food' },
  { name: 'healthcare', label: 'Health Care' },
  { name: 'housing', label: 'Housing' },
  { name: 'insurance', label: 'Insurance' },
  { name: 'miscellaneous', label: 'Miscellaneous' },
  { name: 'personalcare', label: 'Personal Care' },
  { name: 'salary', label: 'Salary' },
  { name: 'shopping', label: 'Shopping' },
  { name: 'tax', label: 'Tax' },
  { name: 'transportation', label: 'Transportation' },
  { name: 'utilities', label: 'Utilities' },
];

export const tblPaymentmodes = [
  { name: 'cash', label: 'Cash' },
  { name: 'debitcard', label: 'Debit Card' },
  { name: 'creditcard', label: 'Credit Card' },
];

export function dbLookupCategories(key: string): string {
  const category = tblCategories.find(catgy => catgy.name === key);
  if (category) {
    return category.label;
  }
  return '';
}

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

export async function retrieveTransactions(pagenum: number, filter: Filter): Promise<TransactionsPaginatedDataDto> {
  let totalPages = 0;

  const ITEMS_PER_PAGE = 10;

  const EMPTY_DTO: Readonly<TransactionsPaginatedDataDto> = {
    transactions: [],
    pagenum,
    totalPages: 0,
    totalItems: 0,
  };

  await fakeNetwork();
  let transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    return EMPTY_DTO;
  }

  if (transactions.length === 0) {
    return EMPTY_DTO;
  }

  // apply filters
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

  // apply amountRange
  filteringTerms = filter.amountRange.split(',');
  if (filteringTerms.length === 1 && filteringTerms[0] === '') {
    //
  } else {
    const amt = filteringTerms[0];
    const amt2 = filteringTerms[1];

    if (amt || amt2) {
      const filterByAmountRangeFn = (trx: TransactionDto): boolean => {
        if (amt && amt2) {
          if (trx.amount >= parseInt(amt) && trx.amount <= parseInt(amt2)) {
            return true;
          }
          return false;
        } else if (amt) {
          if (trx.amount >= parseInt(amt)) {
            return true;
          }
          return false;
        } else if (amt2) {
          if (trx.amount <= parseInt(amt2)) {
            return true;
          }
          return false;
        } else {
          // here, amt and amt2 both empty strings
          // by above logic, we shdn't be here, but typescript not aware so it complains
          return true;
        }
      };
      transactions = transactions.filter(filterByAmountRangeFn);
    }
  }

  // apply dateRange
  filteringTerms = filter.dateRange.split(',');
  if (filteringTerms.length === 1 && filteringTerms[0] === '') {
    //
  } else {
    const dte = filteringTerms[0];
    const dte2 = filteringTerms[1];

    if (dte || dte2) {
      const filterByDateRangeFn = (trx: TransactionDto): boolean => {
        if (dte && dte2) {
          if (trx.expenseDate >= parseInt(dte) && trx.expenseDate <= parseInt(dte2)) {
            return true;
          }
          return false;
        } else if (dte) {
          if (trx.expenseDate >= parseInt(dte)) {
            return true;
          }
          return false;
        } else if (dte2) {
          if (trx.expenseDate <= parseInt(dte2)) {
            return true;
          }
          return false;
        } else {
          // here, dte and dte2 both empty strings
          // by above logic, we shdn't be here, but typescript not aware so it complains
          return true;
        }
      };
      transactions = transactions.filter(filterByDateRangeFn);
    }
  }

  if (transactions.length === 0) {
    return EMPTY_DTO;
  }

  // apply search
  const searchText = filter.search.trim();
  console.log('retrieveTransactions searchText.' + searchText + '.');
  console.log('retrieveTransactions transactions ' + pagenum, JSON.stringify(transactions));
  transactions = matchSorter(transactions, searchText, { keys: ['category', 'paymentmode', 'note'] });

  if (transactions.length === 0) {
    return EMPTY_DTO;
  }

  console.log('retrieveTransactions transactions after matchSorter', JSON.stringify(transactions));
  transactions.sort(sortBy<TransactionDto>('-expenseDate', '-id'));

  const totalItems = transactions.length; // after filtering

  // pagination
  const retTransactions: TransactionDto[] = [];
  totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const remainder = transactions.length % ITEMS_PER_PAGE;

  if (pagenum < totalPages || (pagenum === totalPages && remainder === 0)) {
    const idxFrom = (pagenum - 1) * ITEMS_PER_PAGE; // 0 index based
    const idxTo = idxFrom + (ITEMS_PER_PAGE - 1);
    const idxToPlusOne = idxTo + 1;
    for (let i = idxFrom; i < idxToPlusOne; i++) {
      retTransactions.push(transactions[i]);
    }

    return {
      transactions: retTransactions,
      pagenum,
      totalPages,
      totalItems,
    };
  } else if (pagenum === totalPages && remainder !== 0) {
    // at last page with items less than ITEMS_PER_PAGE
    const idxStart = (totalPages - 1) * ITEMS_PER_PAGE; // 0 index based
    const idxFinish = idxStart + (remainder - 1);
    const idxFinishPlusOne = idxFinish + 1;
    for (let i = idxStart; i < idxFinishPlusOne; i++) {
      retTransactions.push(transactions[i]);
    }

    return {
      transactions: retTransactions,
      pagenum,
      totalPages,
      totalItems,
    };
  } else if (pagenum > totalPages) {
    // e.g. user has deleted all items from last page shown and then do a refresh
    const idxBegin = (totalPages - 1) * ITEMS_PER_PAGE; // 0 index based
    const idxEnd = idxBegin + (remainder > 0 ? remainder - 1 : ITEMS_PER_PAGE - 1);
    const idxEndPlusOne = idxEnd + 1;
    for (let i = idxBegin; i < idxEndPlusOne; i++) {
      retTransactions.push(transactions[i]);
    }

    return {
      transactions: retTransactions,
      pagenum: totalPages,
      totalPages,
      totalItems,
    };
  } else {
    // shouldn't reach here though
    return EMPTY_DTO;
  }
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
export async function deleteTransactions(selection: number[]) {
  await fakeNetwork();
  const transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    return true;
  }
  if (transactions.length === 0) {
    return true;
  }
  for (let i = 0; i < selection.length; i++) {
    const id = selection[i];
    const pos = transactions.findIndex(trx => trx.id === id);
    if (pos > -1) {
      transactions.splice(pos, 1);
    }
  }
  await set(transactions);
  return true;
}

export async function retrieveSumTransactionsAmount(): Promise<number> {
  await fakeNetwork();
  const transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    return 0;
  }

  if (transactions.length === 0) {
    return 0;
  }

  const getSum = (sum: number, trx: TransactionDto): number => {
    return sum + trx.amount;
  };

  const sum = transactions.reduce(getSum, 0);
  return sum;
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
