import React, { useReducer } from 'react';

import { TransactionDto } from '../../../reactquery/transactions/transactionsRq';

export default function EditModal(props: {
  transaction: TransactionDto;
  handleClose: () => void;
  handleUpdateSuccess: () => void;
}): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function reducer(state: TransactionDto, action: { type: string; payload: any }): TransactionDto {
    switch (action.type) {
      case 'cashflow':
        return { ...state, cashflow: action.payload };
        break;
      case 'category':
        return { ...state, category: action.payload };
        break;
      case 'paymentmode':
        return { ...state, paymentmode: action.payload };
        break;
      case 'amount':
        return { ...state, amount: action.payload };
        break;
      case 'expenseDate':
        return { ...state, expenseDate: action.payload };
        break;
      case 'note':
        return { ...state, note: action.payload };
        break;
      default:
        return state;
    }
  }

  const [transaction, dispatch] = useReducer(reducer, { ...props.transaction });

  return (
    <div>
      <button type='button' onClick={props.handleClose}>
        Close
      </button>
      <div>
        cashflow <input type='text' value={transaction.cashflow} />
      </div>
      <div>
        category <input type='text' value={transaction.category} />
      </div>
      <div>
        paymentmode <input type='text' value={transaction.paymentmode} />
      </div>
      <div>
        amount <input type='text' value={transaction.amount} />
      </div>
      <div>
        expenseDate <input type='text' value={transaction.expenseDate} />
      </div>
      <div>
        note <input type='text' value={transaction.note} />
      </div>
    </div>
  );
}
