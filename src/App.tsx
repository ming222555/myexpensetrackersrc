import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDebounce } from 'rooks';

import './App.css';

function MultiSelectCheckboxes(props: { fieldname: string; valuesDescriptions: string; title: string }): JSX.Element {
  const { fieldname, title } = props;
  const valuesDescriptions = useRef(props.valuesDescriptions.split('|'));
  // flag 0 not selected, 1 selected
  const [selectedFlags, setSelectedFlags] = useState<number[]>(() => Array(valuesDescriptions.current.length).fill(0));

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
    const idx = parseInt(evt.target.getAttribute('data-idx')!);
    const dupSelectedFlags = [...selectedFlags];
    const origFlag = dupSelectedFlags[idx];
    dupSelectedFlags[idx] = origFlag === 0 ? 1 : 0;
    setSelectedFlags(dupSelectedFlags);
  }

  return (
    <div style={{ display: 'flex' }}>
      {Math.random()} {title}
      {valuesDescriptions.current.map((valueDescriptionString, i) => {
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

function CategorySelect(props: { handleFormChangeDebounced: () => void }): JSX.Element {
  const allCategoriesRef = useRef([
    { name: 'clothing', label: 'Clothing', isSelected: false },
    { name: 'food', label: 'Food', isSelected: false },
    { name: 'transport', label: 'Transport', isSelected: false },
    { name: 'utilities', label: 'Utilities', isSelected: false },
  ]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[] | []>([]);

  function handleChangeRemoveSelection(evt: React.ChangeEvent<HTMLInputElement>): void {
    const categoryName = evt.currentTarget.value;
    const pos = selectedCategoryNames.findIndex(nme => nme === categoryName);
    const dupSelectedCategoryNames = [...selectedCategoryNames];
    dupSelectedCategoryNames.splice(pos, 1);
    setSelectedCategoryNames(dupSelectedCategoryNames);
  }

  function handleChangeAddSelection(evt: React.MouseEvent<HTMLSpanElement>): void {
    const categoryName = evt.currentTarget.title;
    const categoryToAdd = allCategoriesRef.current.find(category => category.name === categoryName);
    const dupSelectedCategoryNames = [...selectedCategoryNames];
    dupSelectedCategoryNames.push(categoryToAdd!.name);
    setSelectedCategoryNames(dupSelectedCategoryNames);
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
  }, [selectedCategoryNames]);

  return (
    <div>
      {Math.random()}
      <div style={{ display: 'flex' }}>
        {selectedCategoryNames.map(categoryName => {
          const selectedCategory = allCategoriesRef.current.find(category => {
            return category.name === categoryName;
          });
          return (
            <div key={categoryName}>
              <input
                type='checkbox'
                name='categories'
                id={'category' + categoryName}
                value={categoryName}
                onChange={handleChangeRemoveSelection}
                checked
              />
              <label htmlFor={'category' + categoryName}>{selectedCategory?.label}</label>{' '}
            </div>
          );
        })}
      </div>
      <ul>
        {allCategoriesRef.current
          .filter(category => {
            const pos = selectedCategoryNames.findIndex(categoryName => categoryName === category.name);
            if (pos > -1) {
              return false;
            }
            return true;
          })
          .map(catgy => (
            <li key={catgy.name}>
              <span title={catgy.name} onClick={handleChangeAddSelection}>
                {catgy.label}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

const MemoizedCategorySelect = React.memo(CategorySelect);

function RadioButtonGroup(props: { handleFormChangeDebounced: () => void }): JSX.Element {
  const [selectedOption, setSelectedOption] = useState('');

  const handleRadioChange = useMemo(() => {
    return function (evt: React.ChangeEvent<HTMLInputElement>) {
      setSelectedOption(evt.currentTarget.value);
      props.handleFormChangeDebounced();
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
  const formRef = useRef(null);

  const handleFormChange = useMemo(() => {
    return function () {
      const data = new FormData(formRef.current!);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formFields = Object.fromEntries(data) as any;
      const categories = data.getAll('categories');
      if (categories.length > 0) {
        categories.sort(); // future use for react-query queryKey
        formFields['categories'] = categories.join(',');
      } else if (categories.length === 0) {
        formFields['categories'] = '';
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
          <MemoizedRadioButtonGroup handleFormChangeDebounced={handleFormChangeDebounced} />
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
          <MemoizedCategorySelect handleFormChangeDebounced={handleFormChangeDebounced} />
          <MemoizedMultiSelectCheckboxes fieldname='animals' valuesDescriptions='snail;Smail|dog;Doggy|cat;Caty' title='Creatures' />
        </form>
        <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
