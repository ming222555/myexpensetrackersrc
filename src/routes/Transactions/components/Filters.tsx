import { useMemo, useRef, memo } from 'react';

import { useDebounce } from 'rooks';

import MultiSelectCheckboxes from './MultiSelectCheckboxes';
import CategoryMultiSelectDropdown from './CategoryMultiSelectDropdown';
import type { Filters as IFilters } from '../../../store/ducks/transactions/transactionsSlice';
import { tblCashflows, tblPaymentmodes } from '../../../db/indexdb';
import './Filters.scss';

const getCashflows = (strConcat: string, elem: { name: string; label: string }, idx: number): string => {
  return strConcat + `${idx > 0 ? '|' + elem.name + ';' + elem.label : elem.name + ';' + elem.label}`;
};
// e.g. 'income;Income|expense;Expense'
const concatCashflows = tblCashflows.reduce(getCashflows, '');

const getPaymentmodes = (strConcat: string, elem: { name: string; label: string }, idx: number): string => {
  return strConcat + `${idx > 0 ? '|' + elem.name + ';' + elem.label : elem.name + ';' + elem.label}`;
};
// e.g. 'cash;Cash|debitcard;Debit Card|creditcard;Credit Card'
const concatPaymentmodes = tblPaymentmodes.reduce(getPaymentmodes, '');

function Filters(props: { handleFiltersChange: (filters: IFilters) => void }): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const multiSelectFieldnames = useRef<Array<keyof IFilters>>(['categories', 'cashflow', 'paymentmode']);

  const handleFormChange = useMemo(() => {
    return function () {
      const data = new FormData(formRef.current!);
      const _formFields = Object.fromEntries(data) as unknown;
      const formFields = _formFields as IFilters;

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
      <h5 className='h5 d-flex align-items-center bg-paper'>
        <span className='h1 bi-filter'></span>Filters
      </h5>
      {/* {Math.random()} */}
      <form className='Filters__form' role='search' ref={formRef}>
        <CategoryMultiSelectDropdown fieldname='categories' title='Category' handleFormChange={handleFormChangeDebounced} />
        <MultiSelectCheckboxes
          fieldname='cashflow'
          valuesLabels={concatCashflows}
          title='Cashflow'
          handleFormChange={handleFormChangeDebounced}
        />
        <MultiSelectCheckboxes
          fieldname='paymentmode'
          valuesLabels={concatPaymentmodes}
          title='Payment Mode'
          handleFormChange={handleFormChangeDebounced}
        />
      </form>
    </div>
  );
}

const MemoizedFilters = memo(Filters);

export default MemoizedFilters;
