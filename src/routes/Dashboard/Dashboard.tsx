import { useMemo, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import type { ChartOptions, ChartData } from 'chart.js';
import { Ticks } from 'chart.js';

import DateRange from '../Transactions/components/DateRange';
import { dateRange as dateRangeActionCreator, selectTransactions } from '../../store/ducks/transactions/transactionsSlice';
import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  expensesByCategoryQueryOptions,
  sumTransactionsAmountQueryOptions,
  sumIncomesQueryOptions,
  monthlyIncomeExpenseBalanceQueryOptions,
  transactionsRecentQueryOptions,
} from '../../reactquery/transactions/transactionsRq';
import { ExpensesByCategoryDto, MonthlyIncomeExpenseBalanceDto } from '../../db/dto';
import { humaniseDateRange } from '../../util';
import { MemoDoughnutExpenses } from './components/DoughnutExpenses';
import { MemoChartMonthlyIncome } from './components/ChartMonthlyIncome';
import { MemoChartMonthlyBalance } from './components/ChartMonthlyBalance';
import SumsIncomeExpensesBalanceTransactions from './components/SumsIncomeExpensesBalanceTransactions';
import TransactionsListNoSelects from '../Transactions/components/TransactionsListNoSelects';
import ModalSpinner from '../../components/Modals/ModalSpinner';

export default function Dashboard(): JSX.Element {
  const {
    filter: { dateRange },
  } = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();

  const isFetching = useRef(false);

  const {
    /* isPending, isError, error, */ status,
    data,
    isFetching: isFetchingExpensesByCategory,
  } = useQuery(expensesByCategoryQueryOptions(dateRange));

  const {
    /* isPending, isError, status, */
    error: errorSumBalance,
    data: dataSumBalance,
    isFetching: isFetchingSumBalance,
  } = useQuery(sumTransactionsAmountQueryOptions(dateRange));
  const sumTransactionsAmount = dataSumBalance ? parseFloat(dataSumBalance.split(',')[0]) : undefined;
  const totalTransactions = dataSumBalance ? parseFloat(dataSumBalance.split(',')[1]) : undefined;

  const {
    /* isPending, isError, status, */
    error: errorSumIncomes,
    data: dataSumIncomes,
    isFetching: isFetchingSumIncomes,
  } = useQuery(sumIncomesQueryOptions(dateRange));

  const {
    /* isPending, isError, error, */ status: statusMonthlyBalance,
    data: dataMonthlyIncomeExpenseBalance,
    isFetching: isFetchingMonthlyBalance,
  } = useQuery(monthlyIncomeExpenseBalanceQueryOptions([10, 11, 12])); // Oct, Nov, Dec

  const {
    /* isPending, status, */
    isError: isErrorTransactionsRecent,
    error: errorTransactionsRecent,
    data: dataTransactionsRecent,
    isFetching: isFetchingTransactionsRecent,
  } = useQuery(transactionsRecentQueryOptions(dateRange));

  isFetching.current =
    isFetchingExpensesByCategory ||
    isFetchingSumBalance ||
    isFetchingSumIncomes ||
    isFetchingTransactionsRecent ||
    isFetchingMonthlyBalance;

  const initialLoadedData = useRef<ExpensesByCategoryDto | undefined>(undefined);
  const initialChartExpensesData = useRef<ChartData<'doughnut'> | undefined>(undefined);

  const initialLoadedDataMonthlyIncomeExpenseBalance = useRef<MonthlyIncomeExpenseBalanceDto | undefined>(undefined);
  const initialDataChartMonthlyBalance = useRef<ChartData<'line'> | undefined>(undefined);
  const initialDataChartMonthlyIncome = useRef<ChartData<'bar'> | undefined>(undefined);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const chartRef = useRef<any | null>(null);
  const chartRefMonthlyBalance = useRef<any | null>(null);
  const chartRefMonthlyIncome = useRef<any | null>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  ////// doughnut Chart for ExpensesByCategory
  useMemo(() => {
    if (initialLoadedData.current) {
      return;
    }
    if (status == 'success') {
      initialLoadedData.current = data;

      initialChartExpensesData.current = {
        labels: initialLoadedData.current.expenses.map(x => x.legend),
        datasets: [
          {
            data: initialLoadedData.current.expenses.map(x => x.expense),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    }
  }, [status, data]);

  useMemo(() => {
    if (data && chartRef.current) {
      const chart = chartRef.current;
      chart.data.datasets[0].data = data.expenses.map(x => x.expense);
      chart.data.labels = data.expenses.map(x => x.legend);
      chart.update();
    }
  }, [data]);

  ////// line Chart for MonthlyBalance, bar Charts MonthlyIncome, MonthlyExpense
  useMemo(() => {
    if (initialLoadedDataMonthlyIncomeExpenseBalance.current) {
      return;
    }
    if (statusMonthlyBalance == 'success') {
      const labels = ['Oct', 'Nov', 'Dec'];
      const fill = false;
      const borderColor = 'rgb(75, 192, 192)';
      const tension = 0.1;

      initialLoadedDataMonthlyIncomeExpenseBalance.current = dataMonthlyIncomeExpenseBalance;

      initialDataChartMonthlyBalance.current = {
        labels,
        datasets: [
          {
            label: 'Monthly Account Balance',
            data: initialLoadedDataMonthlyIncomeExpenseBalance.current.months.map(mth => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const bal = initialLoadedDataMonthlyIncomeExpenseBalance.current!.balances.find(bal => bal.month === mth);
              return bal ? bal.amount : null;
            }),
            fill,
            borderColor,
            tension,
          },
        ],
      };

      initialDataChartMonthlyIncome.current = {
        labels,
        datasets: [
          {
            label: 'Monthly Income',
            data: initialLoadedDataMonthlyIncomeExpenseBalance.current.months.map(mth => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const income = initialLoadedDataMonthlyIncomeExpenseBalance.current!.incomes.find(income => income.month === mth);
              return income ? income.amount : null;
            }),
            borderColor,
            backgroundColor: ['rgba(153, 102, 255, 0.2)'],
          },
          {
            label: 'Monthly Expense',
            data: initialLoadedDataMonthlyIncomeExpenseBalance.current.months.map(mth => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const expense = initialLoadedDataMonthlyIncomeExpenseBalance.current!.expenses.find(expense => expense.month === mth);
              return expense ? expense.amount : null;
            }),
            borderColor,
            backgroundColor: ['rgba(201, 203, 207, 0.2)'],
          },
        ],
      };
    }
  }, [statusMonthlyBalance, dataMonthlyIncomeExpenseBalance]);

  useMemo(() => {
    let chart;

    if (dataMonthlyIncomeExpenseBalance && statusMonthlyBalance === 'success') {
      if (chartRefMonthlyBalance.current) {
        chart = chartRefMonthlyBalance.current;
        chart.data.datasets[0].data = dataMonthlyIncomeExpenseBalance.months.map(mth => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const bal = dataMonthlyIncomeExpenseBalance.balances.find(bal => bal.month === mth);
          return bal ? bal.amount : null;
        });
        chart.update();
      }
      if (chartRefMonthlyIncome.current) {
        chart = chartRefMonthlyIncome.current;
        // chart.data.datasets[0].data = dataMonthlyIncomeExpenseBalance.incomes;
        chart.data.datasets[0].data = dataMonthlyIncomeExpenseBalance.months.map(mth => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const income = dataMonthlyIncomeExpenseBalance.incomes.find(income => income.month === mth);
          return income ? income.amount : null;
        });

        chart.data.datasets[1].data = dataMonthlyIncomeExpenseBalance.months.map(mth => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const expense = dataMonthlyIncomeExpenseBalance.expenses.find(expense => expense.month === mth);
          return expense ? expense.amount : null;
        });

        chart.update();
      }
    }
  }, [statusMonthlyBalance, dataMonthlyIncomeExpenseBalance]);

  // console.log(data);

  const options = useMemo((): ChartOptions<'doughnut'> => {
    return {
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Chart.js Doughnut Chart',
          color: '#000',
        },
      },
    };
  }, []);

  const optionsChartMonthlyIncome = useMemo((): ChartOptions<'bar'> => {
    return {
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Bar Chart',
          color: '#000',
        },
      },
      scales: {
        y: {
          ticks: {
            // https://www.chartjs.org/docs/latest/axes/labelling.html
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks): string {
              return '$' + Ticks.formatters.numeric.apply(this, [value as number, index, ticks]);
            },
          },
        },
      },
    };
  }, []);

  const optionsChartMonthlyBalance = useMemo((): ChartOptions<'line'> => {
    return {
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Line Chart',
          color: '#000',
        },
      },
      scales: {
        y: {
          ticks: {
            // https://www.chartjs.org/docs/latest/axes/labelling.html
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks): string {
              return '$' + Ticks.formatters.numeric.apply(this, [value as number, index, ticks]);
            },
          },
        },
      },
    };
  }, []);

  const handleDateRange = useMemo(() => {
    return function (dte: string, dte2: string) {
      dispatch(dateRangeActionCreator(dte + ',' + dte2));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <article className='Dashboard'>
        <section className='DashboardSection bg-light px-3'>
          <h2 className='h6 py-3'>Dashboard</h2>
          <div className='d-flex justify-content-end mt-n4'>
            <DateRange handleDateRange={handleDateRange} initialDateRange={dateRange} inline={true} />
          </div>
          <SumsIncomeExpensesBalanceTransactions
            sumIncomes={dataSumIncomes}
            sumExpenses={data?.sumExpenses}
            sumBalance={sumTransactionsAmount}
            sumTransactions={totalTransactions}
            errorSumIncomes={errorSumIncomes}
            errorSumBalance={errorSumBalance}
            errorSumTransactions={errorSumBalance}
          />
          <h5 className='h5 pt-5 text-info text-center'>
            Total Expenses
            <span className='text-success' style={{ fontSize: '0.8em', marginLeft: '1rem' }}>
              {humaniseDateRange(dateRange)}
            </span>
          </h5>
          <MemoDoughnutExpenses ref={chartRef} options={options} data={initialChartExpensesData.current} />
          <div className='row'>
            <div className='col-12 col-mg-6'>
              <h5 className='h5 pt-5 text-info'>Account - Balance</h5>
              <MemoChartMonthlyBalance
                ref={chartRefMonthlyBalance}
                options={optionsChartMonthlyBalance}
                data={initialDataChartMonthlyBalance.current}
              />
            </div>
            <div className='col-12 col-mg-6'>
              <h5 className='h5 pt-5 text-info'>Income - Expense</h5>
              <MemoChartMonthlyIncome
                ref={chartRefMonthlyIncome}
                options={optionsChartMonthlyIncome}
                data={initialDataChartMonthlyIncome.current}
              />
            </div>
          </div>
          <h5 className='h5 pt-5 text-info'>Recent Transactions</h5>
          {dataTransactionsRecent && <TransactionsListNoSelects transactions={dataTransactionsRecent} />}
          {isErrorTransactionsRecent ? <p className='text-red'>{errorTransactionsRecent.message} while fetching</p> : null}
        </section>
      </article>
      {isFetching.current && <ModalSpinner />}
    </>
  );
}
