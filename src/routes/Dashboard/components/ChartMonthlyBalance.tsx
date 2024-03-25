import { memo, forwardRef /* , ForwardedRef */ } from 'react';

import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
// import type { ChartJSOrUndefined } from 'react-chartjs-2';

import { QueryStatus } from '@tanstack/react-query';

import './ChartMonthlyBalance.scss';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

function ChartMonthlyBalance(
  {
    data,
    options,
    status,
  }: {
    data: ChartData<'line'> | undefined;
    options: ChartOptions<'line'>;
    status: 'fetching' | QueryStatus;
  },
  /* ref: ForwardedRef<ChartJSOrUndefined<'line', number[], unknown>> | undefined, */
  ref: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  // https://react-chartjs-2.js.org/faq/chartjs-instance
  // https://react-chartjs-2.js.org/faq/typescript
): JSX.Element {
  return (
    <div className='ChartMonthlyBalance__Wrapper'>
      <div className='ChartMonthlyBalance'>
        {data && <Line ref={ref} options={options} data={data} />}
        {status === 'fetching' ? (
          <p className='ChartMonthlyBalance__status'>
            <i className='text-info'>loading...</i>
          </p>
        ) : status === 'error' ? (
          <p className='ChartMonthlyBalance__status text-red'>Error encountered</p>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export const MemoChartMonthlyBalance = memo(forwardRef(ChartMonthlyBalance));
