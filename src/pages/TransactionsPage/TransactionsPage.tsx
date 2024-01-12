import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDebounce } from 'rooks';

import MultiSelectCheckboxes from './components/MultiSelectCheckboxes';
import CategoryMultiSelectDropdown from './components/CategoryMultiSelectDropdown';
import RadioButtonGroup from './components/RadioButtonGroup';

function TransactionsPage(): JSX.Element {
  const formRef = useRef(null);
  const multiSelectFieldnames = useRef(['categories', 'animals']);

  const handleFormChange = useMemo(() => {
    return function () {
      const data = new FormData(formRef.current!);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formFields = Object.fromEntries(data) as any;

      for (let i = 0; i < multiSelectFieldnames.current.length; i++) {
        const fieldname = multiSelectFieldnames.current[i];
        const valuesArry = data.getAll(fieldname);
        if (valuesArry.length > 0) {
          valuesArry.sort(); // future use for react-query queryKey
          formFields[fieldname] = valuesArry.join(',');
        } else if (valuesArry.length === 0) {
          formFields[fieldname] = '';
        }
      }
      console.log('fmjson', JSON.stringify(formFields));
    };
  }, []);

  const handleFormChangeDebounced = useDebounce(handleFormChange, 500);

  const qPrevTrimmedVal = useRef('');
  const pPrevTrimmedVal = useRef('');

  const [color, setColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (color !== undefined) {
      handleFormChangeDebounced(formRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <form id='search-form' role='search' ref={formRef}>
          <RadioButtonGroup
            values='rb1,rb2,rb3'
            labels='Option 1,Option 2,Option 3'
            title={'My radio'}
            handleFormChangeDebounced={handleFormChangeDebounced}
          />
          <input
            id='q'
            aria-label='Search contacts'
            placeholder='Search'
            type='search'
            name='q'
            defaultValue=''
            onChange={(e): void => {
              const val = e.currentTarget.value;
              const valTrimmed = val.trim();
              console.log('val', val);
              if (valTrimmed !== qPrevTrimmedVal.current) {
                qPrevTrimmedVal.current = valTrimmed;
                handleFormChangeDebounced(e.currentTarget.form);
              }
            }}
          />
          <input
            id='p'
            aria-label='Search contacts'
            placeholder='Search'
            type='search'
            name='p'
            defaultValue=''
            onChange={(e): void => {
              const val = e.currentTarget.value;
              const valTrimmed = val.trim();
              console.log('val', val);
              if (valTrimmed !== pPrevTrimmedVal.current) {
                pPrevTrimmedVal.current = valTrimmed;
                handleFormChangeDebounced(e.currentTarget.form);
              }
            }}
          />
          <br />
          <input
            id='colorTextInput'
            placeholder='Search'
            type='search'
            name='colorTextInput'
            value={color}
            readOnly
            // style={{display: 'none'}}
          />
          <button type='button' onClick={(): void => setColor('blue')}>
            blue
          </button>
          <button type='button' onClick={(): void => setColor('green')}>
            green
          </button>
          <br />
          <button
            type='button'
            onClick={(event): void => {
              const formData = new FormData(event.currentTarget.form!);
              console.log('fm', Object.fromEntries(formData));
            }}
          >
            show formData
          </button>
          <input type='checkbox' name='myCheck' onChange={handleFormChangeDebounced} />
          <CategoryMultiSelectDropdown fieldname='categories' title='Category' handleFormChangeDebounced={handleFormChangeDebounced} />
          <MultiSelectCheckboxes
            fieldname='animals'
            valuesLabels='snail;Smail|dog;Doggy|cat;Caty'
            title='Creatures'
            handleFormChangeDebounced={handleFormChangeDebounced}
          />
        </form>
        <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default TransactionsPage;
