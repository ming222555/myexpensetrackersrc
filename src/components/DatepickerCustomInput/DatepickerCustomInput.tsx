import { useState, forwardRef, memo } from 'react';

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
      excludeDateIntervals={[
        // { start: new Date('2001-01-01'), end: new Date('2019-05-31') },
        // { start: new Date('2019-11-30'), end: new Date('2099-12-01') },
        { start: new Date('2001-01-01'), end: new Date('2019-09-30') },
        { start: new Date('2019-12-31'), end: new Date('2099-12-01') },
      ]}
    />
  );
}

/**
 * @param initialDateString a valid date string e.g. '2023-05-23'
 * @param memoOnChange memoised callback to return picked date to caller
 * @param id e.g. 'idMydateButton'
 */
const MemoizedDatepickerCustomInput = memo(DatepickerCustomInput);

export default MemoizedDatepickerCustomInput;
