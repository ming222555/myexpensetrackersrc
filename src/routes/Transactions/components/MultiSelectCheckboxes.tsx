import React, { useState, useRef, useEffect } from 'react';

import Form from 'react-bootstrap/Form';

import './MultiSelectCheckboxes.scss';

function MultiSelectCheckboxes(props: {
  fieldname: string;
  valuesLabels: string;
  title: string;
  handleFormChange: () => void;
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

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    console.log('MultiSelectCheckboxes useeffect', Math.random());
    props.handleFormChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlags]);

  return (
    <div className='MultiSelectCheckboxes my-3'>
      <h6 className='h6 MultiSelectCheckboxes__title text-info'>{title}</h6> {/* {Math.random()} */}
      <div className='MultiSelectCheckboxes__cbxs'>
        {valuesLabels.current.map((valueDescriptionString, i) => {
          const valueDescription = valueDescriptionString.split(';');
          const val = valueDescription[0];
          return (
            <Form.Check
              key={val}
              type='checkbox'
              name={fieldname}
              id={fieldname + val + i}
              value={val}
              data-idx={i}
              onChange={handleChange}
              checked={!!selectedFlags[i]}
              label={valueDescription[1]}
            />
          );
        })}
      </div>
    </div>
  );
}

const MemoizedMultiSelectCheckboxes = React.memo(MultiSelectCheckboxes);

export default MemoizedMultiSelectCheckboxes;
