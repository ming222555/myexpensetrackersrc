import { useMemo } from 'react';

import DateRange from '../Transactions/components/DateRange';
import { dateRange, selectTransactions } from '../../store/ducks/transactions/transactionsSlice';
import { useAppSelector, useAppDispatch } from '../../hooks';

export default function Dashboard(): JSX.Element {
  const {
    filter: { dateRange: dateRangeOfFilter },
  } = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();

  const handleDateRange = useMemo(() => {
    return function (dte: string, dte2: string) {
      dispatch(dateRange(dte + ',' + dte2));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>Dashboard</p>
      <DateRange handleDateRange={handleDateRange} initialDateRange={dateRangeOfFilter} />
    </div>
  );
}
