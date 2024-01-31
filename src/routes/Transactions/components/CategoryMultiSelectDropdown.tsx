import React, { useState, useRef, useEffect } from 'react';

import './CategoryMultiSelectDropdown.scss';

function CategoryMultiSelectDropdown(props: { fieldname: string; title: string; handleFormChange: () => void }): JSX.Element {
  const { fieldname, title } = props;
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
        {selectedCategoryNames.map((categoryName, i) => {
          const selectedCategory = allCategoriesRef.current.find(category => {
            return category.name === categoryName;
          });
          return (
            <div key={categoryName}>
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
      </div>
      <ul className='CategoryMultiSelectDropdown__unselected'>
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

const MemoizedCategoryMultiSelectDropdown = React.memo(CategoryMultiSelectDropdown);

export default MemoizedCategoryMultiSelectDropdown;
