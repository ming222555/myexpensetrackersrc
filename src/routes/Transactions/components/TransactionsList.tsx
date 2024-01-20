import React from 'react';

import { TransactionDto } from '../../../reactquery/transactions/transactionsRq';
import {
  selectSelection,
  addToSelection,
  removeFromSelection,
  clearSelection,
  replaceSelection,
} from '../../../store/ducks/transactions/transactionsSlice';
import { useAppSelector, useAppDispatch } from '../../../hooks';

function TransactionsList(props: { transactions: TransactionDto[] }): JSX.Element {
  const transactions = props.transactions;
  const selection = useAppSelector(selectSelection);
  const dispatch = useAppDispatch();

  console.log('selection', selection);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
    const idx = parseInt(evt.target.getAttribute('data-id')!);
    const checked = evt.target.checked;
    if (checked) {
      dispatch(addToSelection(idx));
    } else {
      dispatch(removeFromSelection(idx));
    }
  }

  function handleToggleAll(evt: React.ChangeEvent<HTMLInputElement>): void {
    const checked = evt.target.checked;
    if (checked) {
      const newSelection = transactions.map(trx => trx.id);
      dispatch(replaceSelection(newSelection));
    } else {
      dispatch(clearSelection());
    }
  }

  return (
    <div className='TransactionsList'>
      <p>{Math.random()}</p>
      <input
        type='checkbox'
        checked={selection.length === transactions.length && transactions.length > 0}
        style={{ display: `${transactions.length > 0 ? 'inline-block' : 'none'}` }}
        onChange={handleToggleAll}
      />
      {transactions.map(trx => (
        <div key={trx.id}>
          <input type='checkbox' checked={selection.findIndex(id => id === trx.id) > -1} data-id={trx.id} onChange={handleChange} />
          <span>{trx.category}</span> <span>{trx.expenseDate}</span> <span>{trx.paymentmode}</span> <span>{trx.note}</span>{' '}
          <span>{trx.amount}</span>
        </div>
      ))}
    </div>
  );
}

const MemoizedTransactionsList = React.memo(TransactionsList);

export default MemoizedTransactionsList;
