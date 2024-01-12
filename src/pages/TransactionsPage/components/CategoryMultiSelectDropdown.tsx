import React, { useState, useRef, useEffect } from 'react';

function CategoryMultiSelectDropdown(props: { fieldname: string; title: string; handleFormChangeDebounced: () => void }): JSX.Element {
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
      {Math.random()} {title}
      <div style={{ display: 'flex' }}>
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

const MemoizedCategoryMultiSelectDropdown = React.memo(CategoryMultiSelectDropdown);

export default MemoizedCategoryMultiSelectDropdown;
