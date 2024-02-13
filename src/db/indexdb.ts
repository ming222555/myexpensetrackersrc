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
  { name: 'interests', label: 'Interests' },
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
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 6,
      expenseDate: 20191110,
      note: 'Beer cheese',
      id: 1707826993282,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 10,
      expenseDate: 20191110,
      note: 'Maintenance and repairs',
      id: 1707826896544,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 8,
      expenseDate: 20191110,
      note: 'Fatback or hog jowl',
      id: 1707826837382,
    },
    {
      cashflow: 'expense',
      category: 'utilities',
      paymentmode: 'cash',
      amount: 160,
      expenseDate: 20191110,
      note: 'Expense for Utilities',
      id: 1707826777066,
    },
    {
      cashflow: 'expense',
      category: 'miscellaneous',
      paymentmode: 'cash',
      amount: 5,
      expenseDate: 20191110,
      note: 'Movie Outing',
      id: 1707826605125,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 11,
      expenseDate: 20191110,
      note: 'Maintenance and repairs',
      id: 1707826539176,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 8,
      expenseDate: 20191110,
      note: 'Chicken salad, Mello Yello',
      id: 1707826482751,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191111,
      note: 'Pimento cheese sandwich',
      id: 1707826222207,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 10,
      expenseDate: 20191111,
      note: 'Vehicle purchases',
      id: 1707826127950,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191111,
      note: 'Peanuts in Coke',
      id: 1707826056927,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 10,
      expenseDate: 20191111,
      note: 'Public and private hires',
      id: 1707825953141,
    },
    {
      cashflow: 'expense',
      category: 'personalcare',
      paymentmode: 'cash',
      amount: 10,
      expenseDate: 20191111,
      note: 'Deodorant, roll-on',
      id: 1707825830382,
    },
    {
      cashflow: 'income',
      category: 'extraincome',
      paymentmode: 'cash',
      amount: 120,
      expenseDate: 20191111,
      note: 'Income from refund',
      id: 1707825772509,
    },
    {
      cashflow: 'expense',
      category: 'shopping',
      paymentmode: 'creditcard',
      amount: 65,
      expenseDate: 20191111,
      note: 'Beauty care things',
      id: 1707825598774,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 8,
      expenseDate: 20191111,
      note: 'Fatback or hog jowl',
      id: 1707825428811,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 8,
      expenseDate: 20191112,
      note: 'Pickled pigs feet',
      id: 1707825045845,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191112,
      note: 'Other vehicle expenses',
      id: 1707824942892,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 12,
      expenseDate: 20191112,
      note: "Po' boy sandwich, RC Cola",
      id: 1707824838686,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191112,
      note: 'Vehicle purchases',
      id: 1707824722502,
    },
    {
      cashflow: 'expense',
      category: 'insurance',
      paymentmode: 'creditcard',
      amount: 230,
      expenseDate: 20191112,
      note: 'Vehicle insurance',
      id: 1707824649464,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 8,
      expenseDate: 20191112,
      note: 'Fatback or hog jowl',
      id: 1707824542932,
    },
    {
      cashflow: 'expense',
      category: 'housing',
      paymentmode: 'cash',
      amount: 25,
      expenseDate: 20191112,
      note: 'Household furnishings',
      id: 1707824468413,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 7,
      expenseDate: 20191113,
      note: "Po' boy sandwich, RC Cola",
      id: 1707824324201,
    },
    {
      cashflow: 'expense',
      category: 'miscellaneous',
      paymentmode: 'cash',
      amount: 2,
      expenseDate: 20191113,
      note: 'Tennis Court Rent',
      id: 1707824253721,
    },
    {
      cashflow: 'income',
      category: 'extraincome',
      paymentmode: 'cash',
      amount: 90,
      expenseDate: 20191113,
      note: 'Income from Gits',
      id: 1707824135007,
    },
    {
      cashflow: 'expense',
      category: 'healthcare',
      paymentmode: 'cash',
      amount: 180,
      expenseDate: 20191113,
      note: 'Expense for Health Care',
      id: 1707823890948,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 9,
      expenseDate: 20191113,
      note: 'Public and other transportation',
      id: 1707823806347,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 8,
      expenseDate: 20191113,
      note: 'Chicken salad, Mello Yello',
      id: 1707823682450,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 11,
      expenseDate: 20191113,
      note: 'Other vehicle expenses',
      id: 1707823581007,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 11,
      expenseDate: 20191113,
      note: 'Cheese straws, Red Rock Cola',
      id: 1707823495642,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 12,
      expenseDate: 20191114,
      note: 'Palmetto Cheese, Mint julep',
      id: 1707823361877,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191114,
      note: 'Other vehicle expenses',
      id: 1707823288213,
    },
    {
      cashflow: 'income',
      category: 'business',
      paymentmode: 'cash',
      amount: 190,
      expenseDate: 20191114,
      note: 'Income from Own Buisness',
      id: 1707823206313,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 6,
      expenseDate: 20191114,
      note: 'Boiled peanuts',
      id: 1707823117427,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191114,
      note: 'Vehicle purchases',
      id: 1707823054862,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 12,
      expenseDate: 20191114,
      note: 'Fatback or hog jowl',
      id: 1707822994768,
    },
    {
      cashflow: 'expense',
      category: 'bills',
      paymentmode: 'creditcard',
      amount: 220,
      expenseDate: 20191115,
      note: 'Cellular phone service',
      id: 1707822604834,
    },
    {
      cashflow: 'expense',
      category: 'shopping',
      paymentmode: 'debitcard',
      amount: 65,
      expenseDate: 20191115,
      note: 'Personal things',
      id: 1707822518297,
    },
    {
      cashflow: 'income',
      category: 'extraincome',
      paymentmode: 'cash',
      amount: 100,
      expenseDate: 20191115,
      note: 'Interest from Deposit',
      id: 1707822357458,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 10,
      expenseDate: 20191115,
      note: 'Pickled pigs feet',
      id: 1707822214684,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 11,
      expenseDate: 20191115,
      note: 'Cars and trucks, used',
      id: 1707822152239,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191115,
      note: 'Vienna sausages, Mello Yello',
      id: 1707822062887,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 11,
      expenseDate: 20191115,
      note: 'Vehicle purchases',
      id: 1707821879373,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 7,
      expenseDate: 20191115,
      note: 'Peanut butter and banana sandwich',
      id: 1707821747671,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 8,
      expenseDate: 20191116,
      note: 'Peanut butter and banana sandwich',
      id: 1707810725645,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 11,
      expenseDate: 20191116,
      note: 'Other vehicle expenses',
      id: 1707810661979,
    },
    {
      cashflow: 'expense',
      category: 'miscellaneous',
      paymentmode: 'creditcard',
      amount: 3,
      expenseDate: 20191116,
      note: 'Cinema',
      id: 1707810591079,
    },
    {
      cashflow: 'expense',
      category: 'clothing',
      paymentmode: 'cash',
      amount: 135,
      expenseDate: 20191116,
      note: 'Pair of Jeans',
      id: 1707810521635,
    },
    {
      cashflow: 'expense',
      category: 'housing',
      paymentmode: 'cash',
      amount: 20,
      expenseDate: 20191116,
      note: 'Household furnishings',
      id: 1707810305941,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191116,
      note: 'Chicken salad, Mello Yello',
      id: 1707810233933,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191116,
      note: 'Other vehicle expenses',
      id: 1707810087796,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191116,
      note: 'Peanuts in Coke',
      id: 1707810025888,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 11,
      expenseDate: 20191117,
      note: 'Confederate cush',
      id: 1707809879366,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191117,
      note: 'Cars and trucks, used',
      id: 1707809815685,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191117,
      note: 'Boiled peanuts',
      id: 1707809763555,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191117,
      note: 'Public and other transportation',
      id: 1707809704764,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 6,
      expenseDate: 20191117,
      note: 'Peanut butter and banana sandwich',
      id: 1707809639153,
    },
    {
      cashflow: 'expense',
      category: 'utilities',
      paymentmode: 'creditcard',
      amount: 160,
      expenseDate: 20191117,
      note: 'Expense for Utilities',
      id: 1707809429334,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 10,
      expenseDate: 20191118,
      note: "Po' boy sandwich, RC Cola",
      id: 1707802294886,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 10,
      expenseDate: 20191118,
      note: 'Maintenance and repairs',
      id: 1707802170751,
    },
    {
      cashflow: 'expense',
      category: 'personalcare',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191118,
      note: '1 box of antibiotics (12 doses)',
      id: 1707802054624,
    },
    {
      cashflow: 'expense',
      category: 'shopping',
      paymentmode: 'debitcard',
      amount: 60,
      expenseDate: 20191118,
      note: 'Beauty care things',
      id: 1707801929300,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191118,
      note: "Po' boy sandwich, RC Cola",
      id: 1707801654474,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 10,
      expenseDate: 20191118,
      note: 'Other vehicle expenses',
      id: 1707801517147,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191118,
      note: 'Palmetto Cheese, Mint julep',
      id: 1707801407766,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 6,
      expenseDate: 20191119,
      note: 'Cheese straws, Red Rock Cola',
      id: 1707797442138,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 10,
      expenseDate: 20191119,
      note: 'Cars and trucks, used',
      id: 1707797317997,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191119,
      note: 'Confederate cush',
      id: 1707797257614,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 9,
      expenseDate: 20191119,
      note: 'Vehicle purchases',
      id: 1707797172162,
    },
    {
      cashflow: 'expense',
      category: 'housing',
      paymentmode: 'debitcard',
      amount: 30,
      expenseDate: 20191119,
      note: 'Major appliances, housewares',
      id: 1707797062581,
    },
    {
      cashflow: 'expense',
      category: 'miscellaneous',
      paymentmode: 'cash',
      amount: 3,
      expenseDate: 20191119,
      note: 'Cappuccino (regular)',
      id: 1707796962410,
    },
    {
      cashflow: 'income',
      category: 'extraincome',
      paymentmode: 'cash',
      amount: 90,
      expenseDate: 20191119,
      note: 'Income from Gits',
      id: 1707796889772,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 12,
      expenseDate: 20191119,
      note: 'Frito pie, Muscadine wine and juice',
      id: 1707796780555,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 12,
      expenseDate: 20191120,
      note: 'Boiled peanuts',
      id: 1707796393785,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 8,
      expenseDate: 20191120,
      note: 'Vehicle purchases',
      id: 1707796323757,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191120,
      note: 'Beer cheese',
      id: 1707796261234,
    },
    {
      cashflow: 'expense',
      category: 'healthcare',
      paymentmode: 'cash',
      amount: 170,
      expenseDate: 20191120,
      note: 'Expense for Health Care',
      id: 1707796189499,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 8,
      expenseDate: 20191120,
      note: 'Other vehicle expenses',
      id: 1707796107393,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 12,
      expenseDate: 20191120,
      note: 'Creole cream cheese',
      id: 1707796013751,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 12,
      expenseDate: 20191121,
      note: 'Beer cheese',
      id: 1707795771613,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 8,
      expenseDate: 20191121,
      note: 'Vehicle purchases',
      id: 1707795583405,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 11,
      expenseDate: 20191121,
      note: 'Frito pie, Muscadine wine and juice',
      id: 1707795492162,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 11,
      expenseDate: 20191121,
      note: 'Gasoline and motor oil',
      id: 1707795429097,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 12,
      expenseDate: 20191121,
      note: 'Confederate cush',
      id: 1707795348188,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 10,
      expenseDate: 20191122,
      note: 'Peanut butter and banana sandwich',
      id: 1707795209486,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 9,
      expenseDate: 20191122,
      note: 'Vehicle purchases',
      id: 1707795014519,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 8,
      expenseDate: 20191122,
      note: 'Chicken salad, Mello Yello',
      id: 1707794921298,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 8,
      expenseDate: 20191122,
      note: 'Cars and trucks, used',
      id: 1707794778007,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 11,
      expenseDate: 20191122,
      note: 'Peanuts in Coke',
      id: 1707794621371,
    },
    {
      cashflow: 'expense',
      category: 'shopping',
      paymentmode: 'debitcard',
      amount: 50,
      expenseDate: 20191122,
      note: 'Beauty care things',
      id: 1707794538761,
    },
    {
      cashflow: 'income',
      category: 'extraincome',
      paymentmode: 'cash',
      amount: 80,
      expenseDate: 20191122,
      note: 'Income from refund',
      id: 1707794437690,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 8,
      expenseDate: 20191123,
      note: 'Vienna sausages, Mello Yello',
      id: 1707794200166,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 9,
      expenseDate: 20191123,
      note: 'Cars and trucks, used',
      id: 1707794130086,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 11,
      expenseDate: 20191123,
      note: 'Vienna sausages, Mello Yello',
      id: 1707794038856,
    },
    {
      cashflow: 'expense',
      category: 'housing',
      paymentmode: 'cash',
      amount: 30,
      expenseDate: 20191123,
      note: 'Major appliances, housewares',
      id: 1707793960625,
    },
    {
      cashflow: 'expense',
      category: 'miscellaneous',
      paymentmode: 'cash',
      amount: 4,
      expenseDate: 20191123,
      note: 'Taxi Start (Normal Tariff)',
      id: 1707793853846,
    },
    {
      cashflow: 'expense',
      category: 'clothing',
      paymentmode: 'creditcard',
      amount: 140,
      expenseDate: 20191123,
      note: 'Textwood Jeans',
      id: 1707793714838,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191123,
      note: 'Public and other transportation',
      id: 1707793627680,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191123,
      note: 'Chicken salad, Mello Yello',
      id: 1707793569810,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 9,
      expenseDate: 20191124,
      note: 'Other vehicle expenses',
      id: 1707792783998,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 7,
      expenseDate: 20191124,
      note: 'Chicken salad, Mello Yello',
      id: 1707792711359,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191124,
      note: 'Public and other transportation',
      id: 1707792640425,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191124,
      note: 'Pimento cheese sandwich',
      id: 1707792481142,
    },
    {
      cashflow: 'expense',
      category: 'insurance',
      paymentmode: 'cash',
      amount: 250,
      expenseDate: 20191124,
      note: 'Vehicle insurance',
      id: 1707792405453,
    },
    {
      cashflow: 'expense',
      category: 'utilities',
      paymentmode: 'debitcard',
      amount: 130,
      expenseDate: 20191124,
      note: 'Expense for Utilities',
      id: 1707792280683,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 6,
      expenseDate: 20191124,
      note: 'Confederate cush',
      id: 1707792170100,
    },
    {
      cashflow: 'expense',
      category: 'tax',
      paymentmode: 'debitcard',
      amount: 180,
      expenseDate: 20191125,
      note: 'Social Security and Medicare taxes',
      id: 1707787227381,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 10,
      expenseDate: 20191125,
      note: 'Cheese straws, Red Rock Cola',
      id: 1707787115022,
    },
    {
      cashflow: 'expense',
      category: 'personalcare',
      paymentmode: 'cash',
      amount: 15,
      expenseDate: 20191125,
      note: 'Cold medicine',
      id: 1707787037406,
    },
    {
      cashflow: 'expense',
      category: 'shopping',
      paymentmode: 'debitcard',
      amount: 60,
      expenseDate: 20191125,
      note: 'Household things & Utilities',
      id: 1707786971278,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 7,
      expenseDate: 20191125,
      note: 'Cars and trucks, used',
      id: 1707786906391,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191125,
      note: 'Fatback or hog jowl',
      id: 1707786848672,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 11,
      expenseDate: 20191125,
      note: 'Public and other transportation',
      id: 1707786765712,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191125,
      note: 'Vienna sausages, Mello Yello',
      id: 1707786699450,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 12,
      expenseDate: 20191126,
      note: 'Palmetto Cheese, Mint julep',
      id: 1707786574093,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 8,
      expenseDate: 20191126,
      note: 'Other vehicle expenses',
      id: 1707786510647,
    },
    {
      cashflow: 'income',
      category: 'extraincome',
      paymentmode: 'cash',
      amount: 80,
      expenseDate: 20191126,
      note: 'Income from refund',
      id: 1707786431021,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 8,
      expenseDate: 20191126,
      note: 'Peanut butter and banana sandwich',
      id: 1707786205914,
    },
    {
      cashflow: 'expense',
      category: 'housing',
      paymentmode: 'debitcard',
      amount: 25,
      expenseDate: 20191126,
      note: 'Laundry and cleaning supplies',
      id: 1707786128030,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 9,
      expenseDate: 20191126,
      note: 'Cars and trucks, used',
      id: 1707786047740,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 6,
      expenseDate: 20191126,
      note: 'Beer cheese',
      id: 1707785980973,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 12,
      expenseDate: 20191127,
      note: 'Pickled pigs feet',
      id: 1707785842911,
    },
    {
      cashflow: 'expense',
      category: 'personalcare',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191127,
      note: 'Skin care solution',
      id: 1707785744844,
    },
    {
      cashflow: 'expense',
      category: 'healthcare',
      paymentmode: 'cash',
      amount: 70,
      expenseDate: 20191127,
      note: 'Expense for Health Care',
      id: 1707785567009,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191127,
      note: 'Peanuts in Coke',
      id: 1707785465644,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 8,
      expenseDate: 20191127,
      note: 'Vehicle purchases',
      id: 1707785387335,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191127,
      note: "Po' boy sandwich, RC Cola",
      id: 1707785285948,
    },
    {
      cashflow: 'income',
      category: 'business',
      paymentmode: 'cash',
      amount: 200,
      expenseDate: 20191128,
      note: 'Income from investments',
      id: 1707784365645,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'creditcard',
      amount: 9,
      expenseDate: 20191128,
      note: 'Cars and trucks, used',
      id: 1707784175772,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191128,
      note: 'Cheese straws, Red Rock Cola',
      id: 1707784036599,
    },
    {
      cashflow: 'expense',
      category: 'bills',
      paymentmode: 'creditcard',
      amount: 180,
      expenseDate: 20191128,
      note: 'Electricity bill',
      id: 1707783950009,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 6,
      expenseDate: 20191128,
      note: 'Muffuletta sandwich, Mint julep',
      id: 1707783855849,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191128,
      note: 'Maintenance and repairs',
      id: 1707783735734,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191128,
      note: 'Fatback or hog jowl',
      id: 1707783632880,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 6,
      expenseDate: 20191130,
      note: 'Palmetto Cheese, Mint julep',
      id: 1707742637007,
    },
    {
      cashflow: 'expense',
      category: 'housing',
      paymentmode: 'creditcard',
      amount: 20,
      expenseDate: 20191130,
      note: 'Laundry and cleaning supplies',
      id: 1707742568504,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191130,
      note: 'Other vehicle expenses',
      id: 1707742501285,
    },
    {
      cashflow: 'income',
      category: 'extraincome',
      paymentmode: 'cash',
      amount: 110,
      expenseDate: 20191130,
      note: 'Income from Sale',
      id: 1707742409486,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 10,
      expenseDate: 20191130,
      note: 'Muffuletta sandwich, Mint julep',
      id: 1707742294917,
    },
    {
      cashflow: 'expense',
      category: 'clothing',
      paymentmode: 'debitcard',
      amount: 45,
      expenseDate: 20191130,
      note: 'Pair of Running Shoes',
      id: 1707742238637,
    },
    {
      cashflow: 'expense',
      category: 'education',
      paymentmode: 'cash',
      amount: 50,
      expenseDate: 20191130,
      note: 'Expense for Education',
      id: 1707742153872,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191130,
      note: 'Cars and trucks, used',
      id: 1707742070714,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 12,
      expenseDate: 20191130,
      note: 'Palmetto Cheese, Mint julep',
      id: 1707732689977,
    },
    {
      cashflow: 'expense',
      category: 'shopping',
      paymentmode: 'cash',
      amount: 65,
      expenseDate: 20191129,
      note: 'Beauty care things',
      id: 1707732497907,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 8,
      expenseDate: 20191129,
      note: 'Peanuts in Coke',
      id: 1707732420896,
    },
    {
      cashflow: 'expense',
      category: 'miscellaneous',
      paymentmode: 'debitcard',
      amount: 7,
      expenseDate: 20191129,
      note: 'Cinema, International Release',
      id: 1707732229881,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191129,
      note: 'Public and other transportation',
      id: 1707732155364,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'debitcard',
      amount: 11,
      expenseDate: 20191129,
      note: "Steen's cane syrup",
      id: 1707731944137,
    },
    {
      cashflow: 'expense',
      category: 'transportation',
      paymentmode: 'cash',
      amount: 7,
      expenseDate: 20191129,
      note: 'Vehicle purchases',
      id: 1707731207609,
    },
    {
      cashflow: 'expense',
      category: 'food',
      paymentmode: 'creditcard',
      amount: 11,
      expenseDate: 20191129,
      note: 'Palmetto Cheese, Mint julep',
      id: 1707731069623,
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
