import { memo, forwardRef /* , ForwardedRef */ } from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
// import type { ChartJSOrUndefined } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutExpenses(
  {
    data,
    options,
  }: {
    data: ChartData<'doughnut'> | undefined;
    options: ChartOptions<'doughnut'>;
  },
  /* ref: ForwardedRef<ChartJSOrUndefined<'doughnut', number[], unknown>> | undefined, */
  ref: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  // https://react-chartjs-2.js.org/faq/chartjs-instance
  // https://react-chartjs-2.js.org/faq/typescript
): JSX.Element {
  return (
    <div className='DoughnutExpenses'>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      {data && <Doughnut ref={ref} options={options} data={data} plugins={[ChartDataLabels]} />}
      {/* note that above plugins={[ChartDataLabels]} will cause compile time ts error */}
    </div>
  );
}

export const MemoDoughnutExpenses = memo(forwardRef(DoughnutExpenses));
