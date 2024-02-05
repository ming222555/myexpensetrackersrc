import React, { useState } from 'react';

import DatePicker from 'react-datepicker';

import { toIntYYYYMMDD } from '../../../util';

export default function DateRange(props: { handleDateRange: (dte: string, dte2: string) => void }): JSX.Element {
  // const [startDate, setStartDate] = useState<Date | null>(new Date('2019-06-01'));
  // const [endDate, setEndDate] = useState<Date | null>(new Date('2019-11-30'));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
    <div>
      <button onClick={(): void => console.log('startDate endDate', startDate + '   ' + endDate)}>clk me</button>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date): void => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText='mm/dd/yyyy'
          isClearable
        />
      </div>
      <div>
        <DatePicker
          selected={endDate}
          onChange={(date): void => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText='mm/dd/yyyy'
          isClearable
        />
      </div>
      <div className='button__actions'>
        <button type='button' onClick={handleDateRange}>
          Go
        </button>
      </div>
    </div>
  );
}
