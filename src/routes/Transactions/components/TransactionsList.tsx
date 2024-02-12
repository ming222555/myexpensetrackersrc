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
import { delimitMMDDYYYY, zeroPaddMoney } from '../../../util';

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
    <div className='TransactionsList bg-white'>
      {/* <p>{Math.random()}</p> */}
      <div className='app__row TransactionsList__row bg-paper'>
        <input
          type='checkbox'
          checked={selection.length === transactions.length && transactions.length > 0}
          style={{ display: `${transactions.length > 0 ? 'inline-block' : 'none'}` }}
          onChange={handleToggleAll}
          className={`${selection.length > 0 && selection.length < transactions.length ? 'TransactionsList__partiallyselected' : ''}`}
        />
        <div className='app__col TransactionsList__col TransactionsList__col--category'>
          <span>Category</span>
        </div>
        <div className='app__col TransactionsList__col TransactionsList__col--expensedate'>
          <span>Date</span>
        </div>
        <div className='app__col TransactionsList__col TransactionsList__col--paymentmode'>
          <span>Paid By</span>
        </div>
        <div className='app__col TransactionsList__col TransactionsList__col--amount'>
          <span>Amount</span>
        </div>
        <div className='app__col TransactionsList__col TransactionsList__col--note'>
          <span className='TransactionsList__field TransactionsList__field--note'>Note</span>
        </div>
        <div className='app__col TransactionsList__col TransactionsList__col--amount-desktop'>
          <span>Amount</span>
        </div>
      </div>
      {/* <input
        type='checkbox'
        checked={selection.length === transactions.length && transactions.length > 0}
        style={{ display: `${transactions.length > 0 ? 'inline-block' : 'none'}` }}
        onChange={handleToggleAll}
        className={`${selection.length > 0 && selection.length < transactions.length ? 'TransactionsList__partiallyselected' : ''}`}
      /> */}
      {transactions.map(trx => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <label
          key={trx.id}
          className='app__row TransactionsList__row'
          data-checked={selection.findIndex(id => id === trx.id) > -1}
          data-id={trx.id}
          htmlFor={'trxlist' + trx.id}
        >
          <input
            type='checkbox'
            checked={selection.findIndex(id => id === trx.id) > -1}
            data-id={trx.id}
            id={'trxlist' + trx.id}
            onChange={handleChange}
          />
          <div className='app__col TransactionsList__col TransactionsList__col--category'>
            <span>{trx.category}</span>
          </div>
          <div className='app__col TransactionsList__col TransactionsList__col--expensedate'>
            <span>{delimitMMDDYYYY(trx.expenseDate, '-')}</span>
          </div>
          <div className='app__col TransactionsList__col TransactionsList__col--paymentmode'>
            {/* <span>{trx.paymentmode}</span> */}
            {/* <span>{`${trx.paymentmode === 'cash' ? 'Cash' : trx.paymentmode === 'creditcard' ? 'Credit Card' : trx.paymentmode === 'debitcard ? 'Debit Card' : ''}`}</span> */}
            <span>{`${
              trx.paymentmode === 'cash'
                ? 'Cash'
                : trx.paymentmode === 'creditcard'
                  ? 'Credit Card'
                  : trx.paymentmode === 'debitcard'
                    ? 'Debit Card'
                    : ''
            }`}</span>
          </div>
          <div className='app__col TransactionsList__col TransactionsList__col--amount'>
            <span>$ {zeroPaddMoney(trx.amount)}</span>
          </div>
          <div className='app__col TransactionsList__col TransactionsList__col--note'>
            <span className='TransactionsList__field TransactionsList__field--note'>{trx.note}</span>
          </div>
          <div className='app__col TransactionsList__col TransactionsList__col--amount-desktop'>
            <span>$ {zeroPaddMoney(trx.amount)}</span>
          </div>
        </label>
        // <div key={trx.id}>
        //   <input type='checkbox' checked={selection.findIndex(id => id === trx.id) > -1} data-id={trx.id} onChange={handleChange} />
        //   <span>{trx.category}</span> <span>{trx.expenseDate}</span> <span>{trx.paymentmode}</span> <span>{trx.note}</span>{' '}
        //   <span>{trx.amount}</span>
        // </div>
      ))}
    </div>
  );
}

const MemoizedTransactionsList = React.memo(TransactionsList);

export default MemoizedTransactionsList;
