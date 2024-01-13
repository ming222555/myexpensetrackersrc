import React, { useMemo, useRef } from 'react';
import { useDebounce } from 'rooks';

import MultiSelectCheckboxes from './components/MultiSelectCheckboxes';
import CategoryMultiSelectDropdown from './components/CategoryMultiSelectDropdown';

function TransactionsPage(): JSX.Element {
  const formRef = useRef(null);
  const multiSelectFieldnames = useRef(['categories', 'cashflow', 'paymentmode']);

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

  return (
    <div className='App'>
      {Math.random()}
      <form id='filters-form' role='search' ref={formRef}>
        <CategoryMultiSelectDropdown fieldname='categories' title='Category' handleFormChangeDebounced={handleFormChangeDebounced} />
        <MultiSelectCheckboxes
          fieldname='cashflow'
          valuesLabels='income;Income|expense;Expense'
          title='Cashflow'
          handleFormChangeDebounced={handleFormChangeDebounced}
        />
        <MultiSelectCheckboxes
          fieldname='paymentmode'
          valuesLabels='cash;Cash|debitcard;Debit Card|creditcard;Credit Card'
          title='Payment Mode'
          handleFormChangeDebounced={handleFormChangeDebounced}
        />
      </form>
    </div>
  );
}

export default TransactionsPage;
