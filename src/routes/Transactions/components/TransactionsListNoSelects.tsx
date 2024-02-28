import { memo } from 'react';

import { TransactionDto } from '../../../reactquery/transactions/transactionsRq';
import { delimitMMDDYYYY, zeroPaddMoney } from '../../../util';
import { dbLookupCategories } from '../../../db/indexdb';

function TransactionsListNoSelects(props: { transactions: TransactionDto[] }): JSX.Element {
  const transactions = props.transactions;

  return (
    <div className='TransactionsListNoSelects bg-white mt-0'>
      <div className='app__row TransactionsListNoSelects__row bg-paper'>
        <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--category'>
          <span>Category</span>
        </div>
        <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--expensedate'>
          <span>Date</span>
        </div>
        <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--paymentmode'>
          <span>Paid By</span>
        </div>
        <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--amount'>
          <span>Amount</span>
        </div>
        <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--note'>
          <span className='TransactionsListNoSelects__field TransactionsListNoSelects__field--note'>Note</span>
        </div>
        <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--amount-desktop'>
          <span>Amount</span>
        </div>
      </div>
      {transactions.map(trx => (
        <div key={trx.id} className='app__row TransactionsListNoSelects__row'>
          <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--category'>
            <span>{dbLookupCategories(trx.category)}</span>
          </div>
          <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--expensedate'>
            <span>{delimitMMDDYYYY(trx.expenseDate, '-')}</span>
          </div>
          <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--paymentmode'>
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
          <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--amount'>
            <span>$ {zeroPaddMoney(trx.amount)}</span>
          </div>
          <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--note'>
            <span className='TransactionsListNoSelects__field TransactionsListNoSelects__field--note'>{trx.note}</span>
          </div>
          <div className='app__col TransactionsListNoSelects__col TransactionsListNoSelects__col--amount-desktop'>
            <span>$ {zeroPaddMoney(trx.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const MemoizedTransactionsListNoSelects = memo(TransactionsListNoSelects);

export default MemoizedTransactionsListNoSelects;
