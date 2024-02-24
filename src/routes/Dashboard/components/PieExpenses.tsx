import { memo, forwardRef /* , ForwardedRef */ } from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';
// import type { ChartJSOrUndefined } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieExpenses(
  {
    data,
    options,
  }: {
    data: ChartData<'pie'>;
    options: ChartOptions<'pie'>;
  },
  /* ref: ForwardedRef<ChartJSOrUndefined<'pie', number[], unknown>> | undefined, */
  ref: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  // https://react-chartjs-2.js.org/faq/chartjs-instance
  // https://react-chartjs-2.js.org/faq/typescript
): JSX.Element {
  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Pie ref={ref} options={options} data={data} plugins={[ChartDataLabels]} />
      {/* note that above plugins={[ChartDataLabels]} will cause compile time ts error */}
    </div>
  );
}

export const MemoPieExpenses = memo(forwardRef(PieExpenses));
