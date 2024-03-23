import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';

import './seed';
import type { Filter } from '../store/ducks/transactions/transactionsSlice';
import { TransactionDto, TransactionsPaginatedDataDto, ExpensesByCategoryDto, MonthlyIncomeExpenseBalanceDto } from './dto';
import { axiosGet } from '../util_axios';

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

export async function retrieveTransactions(pagenum: number, filter: Filter): Promise<TransactionsPaginatedDataDto> {
  const qs = new URLSearchParams({ ...filter, pagenum: pagenum + '' }).toString();
  try {
    const res = await axiosGet<TransactionsPaginatedDataDto>('/api/v1/transactions' + '?' + qs);
    return res;
  } catch (err) {
    throw err;
  }
}

export async function retrieveTransactionsRecent(dateRange: string): Promise<TransactionDto[]> {
  const querystring = dateRange ? `?dateRange=${encodeURIComponent(dateRange)}` : '';
  try {
    const res = await axiosGet<TransactionDto[]>('/api/v1/transactions/recent' + querystring);
    return res;
  } catch (err) {
    throw err;
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

function filterTransactionsByDateRange(transactions: TransactionDto[], dateRange: string): TransactionDto[] {
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
      return transactions.filter(filterByDateRangeFn);
    }
  }
  return transactions;
}

export async function retrieveExpensesByCategory(dateRange: string): Promise<ExpensesByCategoryDto> {
  // only on categories that are an expense (as opposed to income)
  // 'Others' refer to category (expense) not listed below e.g. tax
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

  const EMPTY_EXPENSES = [..._CATEGORIES_DESCRIBE, 'Others'].map(describe => {
    return {
      expense: 0,
      legend: describe + '  $0',
    };
  });

  const EMPTY_DTO = {
    expenses: EMPTY_EXPENSES,
    sumExpenses: 0,
  };

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
    return EMPTY_DTO;
  }

  // now lets determine the ExpensesByCategory to return...
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

  const expenses = Object.values(expensesByCategory)
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

  return {
    expenses,
    sumExpenses,
  };
}

/**
 * @param dateRange e.g. '20191001,20191231', '20191001,' or ',20191231'
 * @returns sum of incomes within dateRange
 */
export async function retrieveSumIncomes(dateRange: string): Promise<number> {
  const querystring = dateRange ? `?dateRange=${encodeURIComponent(dateRange)}` : '';
  try {
    const res = await axiosGet<number>('/api/v1/accounts/sumincomes' + querystring);
    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * @param months: number[] e.g. [10,11,12] meaning Oct,Nov,Dec. Assume same year
 * @returns MonthlyIncomeExpenseBalanceDto object
 */
export async function retrieveMonthlyIncomeExpenseBalance(months: number[]): Promise<MonthlyIncomeExpenseBalanceDto> {
  const zeros = new Array(months.length);
  zeros.fill(0);

  const EMPTY_DTO: Readonly<MonthlyIncomeExpenseBalanceDto> = {
    months,
    incomes: zeros,
    expenses: [...zeros],
    balances: [...zeros],
  };

  await fakeNetwork();
  let transactions = await localforage.getItem<TransactionDto[]>('transactions');

  if (!transactions || transactions.length === 0) {
    return EMPTY_DTO;
  }

  // we only want transactions whose transaction date has month found in months
  transactions = transactions.filter(trx => {
    const trxDate = trx.expenseDate + ''; // 'yyyymmdd'
    const mm = parseInt(trxDate.substring(4, 6));
    return months.includes(mm);
  });

  if (transactions.length === 0) {
    return EMPTY_DTO;
  }

  // now lets determine the monthly sums to return...
  const retObj: MonthlyIncomeExpenseBalanceDto = {
    months,
    incomes: zeros,
    expenses: [...zeros],
    balances: [...zeros],
  };

  for (let idx = 0; idx < transactions.length; idx++) {
    const trx = transactions[idx];
    const mm = parseInt((trx.expenseDate + '').substring(4, 6));
    const cashflow = trx.cashflow;

    const pos = months.findIndex(mth => mth === mm);

    if (pos > -1) {
      if (cashflow === 'income') {
        retObj.incomes[pos] += trx.amount;
      } else if (cashflow === 'expense') {
        retObj.expenses[pos] += trx.amount;
      }
    }
  }

  for (let idx = 0; idx < retObj.months.length; idx++) {
    retObj.balances[idx] = retObj.incomes[idx] - retObj.expenses[idx];
  }

  return retObj;
}

/**
 * @param dateRange e.g. '20191001,20191231', '20191001,' or ',20191231'
 * @returns comma delimited string e.g. '666.99,123' where 666.99 denotes sumTransactionsAmount and 123 totalTransactions within dateRange
 */
export async function retrieveSumTransactionsAmount(dateRange: string): Promise<string> {
  const querystring = dateRange ? `?dateRange=${encodeURIComponent(dateRange)}` : '';
  try {
    const res = await axiosGet<string>('/api/v1/accounts/sumtransactionsamount' + querystring);
    return res;
  } catch (err) {
    throw err;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function set(transactions: TransactionDto[]) {
  return localforage.setItem('transactions', transactions);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function fakeNetwork() {
  return new Promise(resolve => {
    setTimeout(resolve, Math.random() * 800); // 8000
  });
}
