import React, { useState, useRef, useEffect } from 'react';

function MultiSelectCheckboxes(props: {
  fieldname: string;
  valuesLabels: string;
  title: string;
  handleFormChangeDebounced: () => void;
}): JSX.Element {
  const { fieldname, title } = props;
  const valuesLabels = useRef(props.valuesLabels.split('|'));
  // flag 0 not selected, 1 selected
  const [selectedFlags, setSelectedFlags] = useState<number[]>(() => Array(valuesLabels.current.length).fill(0));

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
    const idx = parseInt(evt.target.getAttribute('data-idx')!);
    const dupSelectedFlags = [...selectedFlags];
    const origFlag = dupSelectedFlags[idx];
    dupSelectedFlags[idx] = origFlag === 0 ? 1 : 0;
    setSelectedFlags(dupSelectedFlags);
  }

  const isMounted = useRef(false);
  const cntRedraw = useRef(0);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    } else {
      if (cntRedraw.current === 0) {
        cntRedraw.current = 1;
        return;
      }
      props.handleFormChangeDebounced();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlags]);

  return (
    <div style={{ display: 'flex' }}>
      {Math.random()} {title}
      {valuesLabels.current.map((valueDescriptionString, i) => {
        const valueDescription = valueDescriptionString.split(';');
        const val = valueDescription[0];
        return (
          <div key={val}>
            <input
              type='checkbox'
              name={fieldname}
              id={fieldname + val + i}
              value={val}
              data-idx={i}
              onChange={handleChange}
              checked={!!selectedFlags[i]}
            />
            <label htmlFor={fieldname + val + i}>{valueDescription[1]}</label>{' '}
          </div>
        );
      })}
    </div>
  );
}

const MemoizedMultiSelectCheckboxes = React.memo(MultiSelectCheckboxes);

export default MemoizedMultiSelectCheckboxes;
