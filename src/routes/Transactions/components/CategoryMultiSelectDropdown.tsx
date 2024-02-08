import React, { useState, useRef, useEffect } from 'react';

import './CategoryMultiSelectDropdown.scss';

const allCategories = [
  { name: 'clothing', label: 'Clothing', isSelected: false },
  { name: 'entertainment', label: 'Entertainment', isSelected: false },
  { name: 'food', label: 'Food', isSelected: false },
  { name: 'lottery', label: 'Lottery', isSelected: false },
  { name: 'shopping', label: 'Shopping', isSelected: false },
  { name: 'sports', label: 'Sports', isSelected: false },
  { name: 'transport', label: 'Transport', isSelected: false },
  { name: 'utilities', label: 'Utilities', isSelected: false },
];

function Unselected(props: { selectedCategoryNames: string[]; handleChangeAddSelection: (categoryName: string) => void }): JSX.Element {
  const [val, setVal] = useState('');

  function handleChange(evt: React.ChangeEvent<HTMLSelectElement>): void {
    const categoryName = evt.currentTarget.value;

    if (categoryName) {
      setVal(categoryName);
      props.handleChangeAddSelection(categoryName);
    }
  }

  useEffect(() => {
    if (val) {
      setVal('');
    }
  }, [val]);

  return (
    <select value={val} onChange={handleChange}>
      <option value=''></option>
      {allCategories
        .filter(category => {
          const pos = props.selectedCategoryNames.findIndex(categoryName => categoryName === category.name);
          if (pos > -1) {
            return false;
          }
          return true;
        })
        .map(catgy => (
          <option key={catgy.name} value={catgy.name}>
            {catgy.label}
          </option>
        ))}
    </select>
  );
}

function CategoryMultiSelectDropdown(props: { fieldname: string; title: string; handleFormChange: () => void }): JSX.Element {
  const { fieldname, title } = props;
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[] | []>([]);

  function handleChangeRemoveSelection(evt: React.ChangeEvent<HTMLInputElement>): void {
    const categoryName = evt.currentTarget.value;
    const pos = selectedCategoryNames.findIndex(nme => nme === categoryName);
    const dupSelectedCategoryNames = [...selectedCategoryNames];
    dupSelectedCategoryNames.splice(pos, 1);
    setSelectedCategoryNames(dupSelectedCategoryNames);
  }

  function handleChangeAddSelection(categoryName: string): void {
    const categoryToAdd = allCategories.find(category => category.name === categoryName);
    const dupSelectedCategoryNames = [...selectedCategoryNames];
    dupSelectedCategoryNames.push(categoryToAdd!.name);
    setSelectedCategoryNames(dupSelectedCategoryNames);
  }

  function handleClearSelection(): void {
    setSelectedCategoryNames([]);
  }

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    console.log('CategoryMultiSelectDropdown useeffect', Math.random());
    props.handleFormChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryNames]);

  return (
    <div className='CategoryMultiSelectDropdown'>
      {Math.random()} {title}
      <div className='CategoryMultiSelectDropdown__selected'>
        {selectedCategoryNames.length === 0 ? <span>Select Categories</span> : null}
        {selectedCategoryNames.map((categoryName, i) => {
          const selectedCategory = allCategories.find(category => {
            return category.name === categoryName;
          });
          return (
            <div key={categoryName} className='CategoryMultiSelectDropdown__selected-item'>
              <input
                type='checkbox'
                name={fieldname}
                id={fieldname + categoryName + i}
                value={categoryName}
                onChange={handleChangeRemoveSelection}
                checked
              />
              <label htmlFor={fieldname + categoryName + i}>{selectedCategory?.label}</label>{' '}
            </div>
          );
        })}
        {selectedCategoryNames.length > 0 ? (
          <button type='button' className='btn btn-danger btn-sm CategoryMultiSelectDropdown__clear' onClick={handleClearSelection}>
            <span className='bi-x-lg'></span>
          </button>
        ) : null}
      </div>
      <Unselected selectedCategoryNames={selectedCategoryNames} handleChangeAddSelection={handleChangeAddSelection} />
    </div>
  );
}

const MemoizedCategoryMultiSelectDropdown = React.memo(CategoryMultiSelectDropdown);

export default MemoizedCategoryMultiSelectDropdown;
