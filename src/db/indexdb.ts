import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';

import './seed';
import type { Filter } from '../store/ducks/transactions/transactionsSlice';
import { TransactionDto, TransactionsPaginatedDataDto } from '../reactquery/transactions/transactionsRq';

export interface ExpensesByCategoryDto {
  expense: number;
  legend: string;
}

export const tblCashflows = [
  { name: 'income', label: 'Income' },
  { name: 'expense', label: 'Expense' },
];

export const tblCategories = [
  { name: 'bills', label: 'Bills', cashflow: 'expense' },
  { name: 'business', label: 'Business', cashflow: 'income' },
  { name: 'clothing', label: 'Clothing', cashflow: 'expense' },
  { name: 'education', label: 'Education', cashflow: 'expense' },
  { name: 'extraincome', label: 'Extra income', cashflow: 'income' },
  { name: 'food', label: 'Food', cashflow: 'expense' },
  { name: 'healthcare', label: 'Health Care', cashflow: 'expense' },
  { name: 'housing', label: 'Housing', cashflow: 'expense' },
  { name: 'insurance', label: 'Insurance', cashflow: 'expense' },
  { name: 'interests', label: 'Interests', cashflow: 'income' },
  { name: 'lottery', label: 'Lottery', cashflow: 'expense' },
  { name: 'miscellaneous', label: 'Miscellaneous', cashflow: 'expense' },
  { name: 'salary', label: 'Salary', cashflow: 'income' },
  { name: 'shopping', label: 'Shopping', cashflow: 'expense' },
  { name: 'tax', label: 'Tax', cashflow: 'expense' },
  { name: 'transportation', label: 'Transport', cashflow: 'expense' },
  { name: 'utilities', label: 'Utilities', cashflow: 'expense' },
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

  // after all filters (by search, amount range, date range, etc...)
  const totalItems = transactions.length;

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

export async function retrieveExpensesByCategory(dateRange: string): Promise<ExpensesByCategoryDto[]> {
  // only on categories that are an expense (as opposed to income)
  // 'Others' refer to category (expense) not listed e.g. tax
  const _CATEGORIES = ['bills', 'clothing', 'food', 'healthcare', 'housing', 'insurance', 'shopping', 'transportation', 'utilities'];
  const _CATEGORIES_DESCRIBE = [
    'Bills',
    'Clothing',
    'Food',
    'Healthcare',
    'Housing',
    'Insurance',
    'Shopping',
    'Transport', // 'Transportation',
    'Utilities',
  ];

  const EMPTY_DTO: Readonly<ExpensesByCategoryDto>[] = [..._CATEGORIES_DESCRIBE, 'Others'].map(describe => {
    return {
      expense: 0,
      legend: describe + '  $0',
    };
  });

  await fakeNetwork();
  let transactions = await localforage.getItem<TransactionDto[]>('transactions');
  if (!transactions) {
    return EMPTY_DTO;
  }

  if (transactions.length === 0) {
    return EMPTY_DTO;
  }

  // we only want transactions that are expenses
  if (transactions.findIndex(trx => trx.cashflow === 'expense') < 0) {
    return EMPTY_DTO;
  }

  transactions = transactions.filter(trx => trx.cashflow === 'expense');

  // apply dateRange
  const filteringTerms = dateRange.split(',');
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
    return [];
  }

  // now lets determine the ExpensesByCategoryDto[] to return...
  let sumExpenses = 0;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getExpensesByCategoryObj = (
    expensesByCategoryObj: {
      [category: string]: {
        describe: string;
        totalAmount: number;
      };
    },
    trx: TransactionDto,
  ) => {
    // for each trx
    //   is trx.category already a key of expensesByCategoryObj?
    //   if no, then add trx.category as key to expensesByCategoryObj, with initialised value
    //   else update its totalAmount
    const category = trx.category;
    const pos = _CATEGORIES.findIndex(catgy => catgy === category);

    if (pos < 0) {
      expensesByCategoryObj.others.totalAmount += trx.amount;
    } else {
      // is category already a key of expensesByCategoryObj ?
      if (expensesByCategoryObj[category]) {
        expensesByCategoryObj[category].totalAmount += trx.amount;
      } else {
        expensesByCategoryObj[category] = {
          describe: _CATEGORIES_DESCRIBE[pos],
          totalAmount: trx.amount,
        };
      }
    }

    sumExpenses += trx.amount;

    return expensesByCategoryObj;
  };

  const expensesByCategory = transactions.reduce(getExpensesByCategoryObj, {
    others: {
      describe: 'Others',
      totalAmount: 0,
    },
  });

  const ret: ExpensesByCategoryDto[] = Object.values(expensesByCategory)
    .map(x => {
      const expense = parseFloat(x.totalAmount.toFixed(2));
      const strExpense = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense);
      const strPct = ((x.totalAmount / sumExpenses) * 100).toFixed(2);

      return {
        expense,
        legend: x.describe + '  ' + strExpense + '  ' + strPct + '%',
      };
    })
    .sort(function (a, b) {
      return a.expense - b.expense;
    });

  return ret;
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
    const delta = trx.cashflow === 'income' ? trx.amount : trx.cashflow === 'expense' ? -1 * trx.amount : 0;
    return sum + delta;
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
