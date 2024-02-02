import React, { useState, forwardRef } from 'react';

import DatePicker from 'react-datepicker';

// https://reactdatepicker.com/
// https://blog.shhdharmen.me/how-to-utilise-jsdoc-comment-tags-so-that-visual-studio-code-intellisense-works-great

function DatepickerCustomInput({
  initialDateString,
  className = '',
  memoOnChange,
  id = '',
}: {
  initialDateString?: string;
  className?: string;
  memoOnChange?: (date: Date | null) => void;
  id?: string;
}): JSX.Element {
  const [startDate, setStartDate] = useState<Date | null>(initialDateString ? new Date(initialDateString) : new Date());

  const propsOnChange = memoOnChange;

  // eslint-disable-next-line react/display-name, react/prop-types
  const ExampleCustomInput = forwardRef<HTMLButtonElement>(({ value, onClick }: { value?: string; onClick?: () => void }, ref) => (
    <button type='button' className={className} onClick={onClick} ref={ref} id={id}>
      {value}
    </button>
  ));
  return (
    <DatePicker
      selected={startDate}
      onChange={(date): void => {
        setStartDate(date);
        propsOnChange ? propsOnChange(date) : '';
      }}
      customInput={<ExampleCustomInput />}
      dateFormat='YYYY/MM/dd'
    />
  );
}

/**
 * @param initialDateString a valid date string e.g. '2023-05-23'
 * @param memoOnChange memoised callback to return picked date to caller
 * @param id e.g. 'idMydateButton'
 */
const MemoizedDatepickerCustomInput = React.memo(DatepickerCustomInput);

export default MemoizedDatepickerCustomInput;
