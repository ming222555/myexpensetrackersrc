import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDebounce } from 'rooks';

import './App.css';

function RadioButtonGroup(props: { setFormDataDebounced: (fm: HTMLFormElement) => void }): JSX.Element {
  const [selectedOption, setSelectedOption] = useState('');

  const handleRadioChange = useMemo(() => {
    return function (evt: React.ChangeEvent<HTMLInputElement>) {
      setSelectedOption(evt.currentTarget.value);
      props.setFormDataDebounced(evt.currentTarget.form!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p>{Math.random()}</p>
      <label>
        <input type='radio' name='rb1' value='rb1' checked={selectedOption === 'rb1'} onChange={handleRadioChange} />
        Option 1
      </label>
      <br />
      <label>
        <input type='radio' name='rb2' value='rb2' checked={selectedOption === 'rb2'} onChange={handleRadioChange} />
        Option 2
      </label>
      <br />
      <label>
        <input type='radio' name='rb3' value='rb3' checked={selectedOption === 'rb3'} onChange={handleRadioChange} />
        Option 3
      </label>
    </div>
  );
}

const MemoizedRadioButtonGroup = React.memo(RadioButtonGroup);

function App(): JSX.Element {
  const setFormData = useMemo(() => {
    return function (form: HTMLFormElement) {
      const formData = new FormData(form);
      console.log('fm', Object.fromEntries(formData));
    };
  }, []);

  const setFormDataFromEvent = useMemo(() => {
    return function (evt: React.ChangeEvent<HTMLInputElement>) {
      setFormDataDebounced(evt.currentTarget.form!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFormDataDebounced = useDebounce(setFormData, 500);

  const qPrevTrimmedVal = useRef('');
  const pPrevTrimmedVal = useRef('');

  const formRef = useRef(null);

  const [color, setColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (color !== undefined) {
      setFormDataDebounced(formRef.current);
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
          <MemoizedRadioButtonGroup setFormDataDebounced={setFormDataDebounced} />
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
                setFormDataDebounced(e.currentTarget.form);
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
                setFormDataDebounced(e.currentTarget.form);
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
          <input type='checkbox' name='myCheck' onChange={setFormDataFromEvent} />
        </form>
        <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
