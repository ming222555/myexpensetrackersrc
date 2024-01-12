import React, { useState, useMemo, useRef } from 'react';

function RadioButtonGroup(props: { values: string; labels: string; title: string; handleFormChangeDebounced: () => void }): JSX.Element {
  const { title } = props;
  const values = useRef(props.values.split(','));
  const labels = useRef(props.labels.split(','));
  const [selectedValue, setSelectedValue] = useState('');

  const handleRadioChange = useMemo(() => {
    return function (evt: React.ChangeEvent<HTMLInputElement>) {
      setSelectedValue(evt.currentTarget.value);
      props.handleFormChangeDebounced();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>{Math.random()}</p> {title}
      {values.current.map((val, i) => (
        <label key={val}>
          <input type='radio' name={'rbg' + val + i} value={val} checked={selectedValue === val} onChange={handleRadioChange} />
          {labels.current[i]}
        </label>
      ))}
    </div>
  );
}

const MemoizedRadioButtonGroup = React.memo(RadioButtonGroup);

export default MemoizedRadioButtonGroup;
