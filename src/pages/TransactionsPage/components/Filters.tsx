import React, { useMemo, useRef } from 'react';

import { useDebounce } from 'rooks';

import MultiSelectCheckboxes from './MultiSelectCheckboxes';
import CategoryMultiSelectDropdown from './CategoryMultiSelectDropdown';

export interface Filters {
  categories: string;
  cashflow: string;
  paymentmode: string;
}

function Filters(props: { handleFiltersChange: (filters: Filters) => void }): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const multiSelectFieldnames = useRef<Array<keyof Filters>>(['categories', 'cashflow', 'paymentmode']);

  const handleFormChange = useMemo(() => {
    return function () {
      const data = new FormData(formRef.current!);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _formFields = Object.fromEntries(data) as unknown;
      const formFields = _formFields as Filters;

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
      props.handleFiltersChange(formFields);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChangeDebounced = useDebounce(handleFormChange, 500);

  return (
    <div className='Filters'>
      {Math.random()}
      <form className='Filters__form' role='search' ref={formRef}>
        <CategoryMultiSelectDropdown fieldname='categories' title='Category' handleFormChange={handleFormChangeDebounced} />
        <MultiSelectCheckboxes
          fieldname='cashflow'
          valuesLabels='income;Income|expense;Expense'
          title='Cashflow'
          handleFormChange={handleFormChangeDebounced}
        />
        <MultiSelectCheckboxes
          fieldname='paymentmode'
          valuesLabels='cash;Cash|debitcard;Debit Card|creditcard;Credit Card'
          title='Payment Mode'
          handleFormChange={handleFormChangeDebounced}
        />
      </form>
    </div>
  );
}

export default Filters;
