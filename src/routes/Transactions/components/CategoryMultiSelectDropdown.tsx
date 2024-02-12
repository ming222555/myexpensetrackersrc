import React, { useState, useRef, useEffect } from 'react';

import Form from 'react-bootstrap/Form';

import { tblCategories } from '../../../db/indexdb';
import './CategoryMultiSelectDropdown.scss';

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
    <Form.Group className='mb-3'>
      <Form.Select size='sm' value={val} onChange={handleChange}>
        <option value=''></option>
        {tblCategories
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
      </Form.Select>
    </Form.Group>
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
    const categoryToAdd = tblCategories.find(category => category.name === categoryName);
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
    <div className='CategoryMultiSelectDropdown my-3'>
      <h6 className='h6 CategoryMultiSelectDropdown__title text-info'>{title}</h6> {/* {Math.random()} */}
      <div className='CategoryMultiSelectDropdown__selected'>
        {selectedCategoryNames.length === 0 ? (
          <span className='CategoryMultiSelectDropdown__dropdownLabel text-paper-dark'>Select Categories</span>
        ) : null}
        {selectedCategoryNames.map((categoryName, i) => {
          const selectedCategory = tblCategories.find(category => {
            return category.name === categoryName;
          });
          return (
            <div key={categoryName} className='CategoryMultiSelectDropdown__selected-item bg-paper text-black'>
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
