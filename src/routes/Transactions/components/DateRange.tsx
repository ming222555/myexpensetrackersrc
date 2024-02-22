import { useState } from 'react';

import DatePicker from 'react-datepicker';

import { toIntYYYYMMDD, dateFromYYYYMMDD } from '../../../util';
import './DateRange.scss';

/**
 * @param props.initialDateRange e.g. '20191001,20191231', '20191001,' or ',20191231'
 */
export default function DateRange(props: { handleDateRange: (dte: string, dte2: string) => void; initialDateRange: string }): JSX.Element {
  function initDateStates(fromTo: 'from' | 'to'): Date | null {
    const dates = props.initialDateRange.split(',');

    if (dates.length === 1 && dates[0] === '') {
      return null;
    }

    const strDte = dates[0];
    const strDte2 = dates[1];

    if (fromTo === 'from') {
      if (isNaN(parseInt(strDte))) {
        return null;
      } else {
        return dateFromYYYYMMDD(strDte);
      }
    }

    if (fromTo === 'to') {
      if (isNaN(parseInt(strDte2))) {
        return null;
      } else {
        return dateFromYYYYMMDD(strDte2);
      }
    }

    return null;
  }

  /* const [startDate, setStartDate] = useState<Date | null>(new Date('2019-10-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2019-12-31')); */
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(initDateStates('from'));
  const [endDate, setEndDate] = useState<Date | null>(initDateStates('to'));

  function handleDateRange(): void {
    if (startDate && endDate) {
      if (startDate > endDate) {
        props.handleDateRange(toIntYYYYMMDD(endDate) + '', toIntYYYYMMDD(startDate) + '');
      } else {
        props.handleDateRange(toIntYYYYMMDD(startDate) + '', toIntYYYYMMDD(endDate) + '');
      }

      return;
    }

    if (startDate) {
      props.handleDateRange(toIntYYYYMMDD(startDate) + '', '');
      return;
    }

    if (endDate) {
      props.handleDateRange('', toIntYYYYMMDD(endDate) + '');
      return;
    }

    props.handleDateRange('', '');
  }

  return (
    <div className='DateRange my-2'>
      <h6 className='h6 DateRange__title text-info'>Select a date range</h6>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date): void => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText='mm/dd/yyyy'
          isClearable
          excludeDateIntervals={[
            { start: new Date('2001-01-01'), end: new Date('2019-09-30') },
            { start: new Date('2019-12-31'), end: new Date('2099-12-01') },
          ]}
        />
      </div>
      <div className='d-flex'>
        <DatePicker
          selected={endDate}
          onChange={(date): void => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText='mm/dd/yyyy'
          isClearable
          excludeDateIntervals={[
            { start: new Date('2001-01-01'), end: new Date('2019-09-30') },
            { start: new Date('2019-12-31'), end: new Date('2099-12-01') },
          ]}
        />
        <button type='button' className='ms-2' onClick={handleDateRange}>
          Go
        </button>
      </div>
    </div>
  );
}
