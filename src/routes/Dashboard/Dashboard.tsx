import { useMemo, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import type { ChartOptions, ChartData } from 'chart.js';

import DateRange from '../Transactions/components/DateRange';
import { dateRange as dateRangeActionCreator, selectTransactions } from '../../store/ducks/transactions/transactionsSlice';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { expensesByCategoryQueryOptions } from '../../reactquery/transactions/transactionsRq';
import { ExpensesByCategoryDto } from '../../db/indexdb';
import { MemoDoughnutExpenses } from './components/DoughnutExpenses';
import ModalSpinner from '../../components/Modals/ModalSpinner';

export default function Dashboard(): JSX.Element {
  const {
    filter: { dateRange },
  } = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();

  const { isPending, isError, error, data, status, isFetching } = useQuery(expensesByCategoryQueryOptions(dateRange));

  const initialLoadedData = useRef<ExpensesByCategoryDto[] | undefined>(undefined);
  const initialChartExpensesData = useRef<ChartData<'doughnut'> | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any | null>(null);

  useMemo(() => {
    if (initialLoadedData.current) {
      return;
    }
    if (status == 'success') {
      initialLoadedData.current = data;

      initialChartExpensesData.current = {
        labels: initialLoadedData.current.map(x => x.legend),
        datasets: [
          {
            data: initialLoadedData.current.map(x => x.expense),
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
      chart.data.datasets[0].data = data.map(x => x.expense);
      chart.data.labels = data.map(x => x.legend);
      chart.update();
    }
  }, [data]);

  console.log(data);

  const options = useMemo((): ChartOptions<'doughnut'> => {
    return {
      responsive: true,
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

  const handleDateRange = useMemo(() => {
    return function (dte: string, dte2: string) {
      dispatch(dateRangeActionCreator(dte + ',' + dte2));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <article className='Dashboard'>
        <p>Dashboard</p>
        <DateRange handleDateRange={handleDateRange} initialDateRange={dateRange} />
        {initialChartExpensesData.current && (
          <MemoDoughnutExpenses ref={chartRef} options={options} data={initialChartExpensesData.current} />
        )}
        ppppppppppppppppppppppppppppppp
      </article>
      {isFetching && <ModalSpinner />}
    </>
  );
}
