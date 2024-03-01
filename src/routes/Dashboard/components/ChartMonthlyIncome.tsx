import { memo, forwardRef /* , ForwardedRef */ } from 'react';

import { Chart as ChartJS, BarElement, Tooltip, Legend } from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import type { ChartJSOrUndefined } from 'react-chartjs-2';

import './ChartMonthlyIncome.scss';

ChartJS.register(BarElement, Tooltip, Legend);

function ChartMonthlyIncome(
  {
    data,
    options,
  }: {
    data: ChartData<'bar'> | undefined;
    options: ChartOptions<'bar'>;
  },
  /* ref: ForwardedRef<ChartJSOrUndefined<'bar', number[], unknown>> | undefined, */
  ref: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  // https://react-chartjs-2.js.org/faq/chartjs-instance
  // https://react-chartjs-2.js.org/faq/typescript
): JSX.Element {
  return <div className='ChartMonthlyIncome'>{data && <Bar ref={ref} options={options} data={data} />}</div>;
}

export const MemoChartMonthlyIncome = memo(forwardRef(ChartMonthlyIncome));
