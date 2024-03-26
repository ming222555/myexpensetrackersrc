import localforage from 'localforage';

import './seed';
import type { Filter } from '../store/ducks/transactions/transactionsSlice';
import { TransactionDto, TransactionsPaginatedDataDto, ExpensesByCategoryDto, MonthlyIncomeExpenseBalanceDto } from './dto';
import { axiosGet, axiosPost } from '../util_axios';

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
  try {
    const res = await axiosPost<number>('api/v1/transactions', creationDetails);
    return res;
  } catch (err) {
    throw err;
  }
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

/**
 * @param dateRange e.g. '20191001,20191231', '20191001,' or ',20191231'
 * @returns ExpensesByCategoryDto object
 */
export async function retrieveExpensesByCategory(dateRange: string): Promise<ExpensesByCategoryDto> {
  // dateRange e.g... '20191001,20191231', '20191001,' or ',20191231'
  // meaning... 'Oct 1 - Dec 31', 'Oct 1 or later' or 'Dec 31 or earlier'
  const querystring = dateRange ? `?dateRange=${encodeURIComponent(dateRange)}` : '';
  try {
    const res = await axiosGet<ExpensesByCategoryDto>('/api/v1/accounts/expensesbycategory' + querystring);
    return res;
  } catch (err) {
    throw err;
  }
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
  const querystring = months.length > 0 ? `?months=${encodeURIComponent(months.join(','))}` : '';
  try {
    const res = await axiosGet<MonthlyIncomeExpenseBalanceDto>('/api/v1/accounts' + querystring);
    return res;
  } catch (err) {
    throw err;
  }
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
