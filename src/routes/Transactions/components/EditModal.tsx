import React, { useReducer, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { TransactionDto } from '../../../reactquery/transactions/transactionsRq';
import { updateTransaction } from '../../../db/indexdb';
import ModalSpinner from '../../../components/Modals/ModalSpinner';
import ModalAlert from '../../../components/Modals/ModalAlert';
import './EditModal.scss';

interface StringisedFields {
  amount: string;
  expenseDate: string;
}
type TransactionForForm = Omit<TransactionDto, keyof StringisedFields> & StringisedFields;

export default function EditModal(props: {
  transaction: TransactionDto;
  handleClose: () => void;
  handleUpdateSuccess: () => void;
}): JSX.Element {
  function reducer(state: TransactionForForm, action: { type: string; payload: string }): TransactionForForm {
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

  const initialErrors = {
    cashflow: '',
    category: '',
    paymentmode: '',
    amount: '',
    expenseDate: '',
  };

  const [errors, setErrors] = useState({ ...initialErrors });

  const [transaction, dispatch] = useReducer(reducer, {
    ...props.transaction,
    amount: props.transaction.amount + '',
    expenseDate: props.transaction.expenseDate + '',
  });

  const mutation = useMutation({
    mutationFn: (updatesForTransaction: TransactionDto) => {
      return updateTransaction(updatesForTransaction);
    },
  });

  function validate(): number {
    let rc = 0;
    const validationErrors = { ...initialErrors };

    const { cashflow, category, paymentmode, amount, expenseDate } = transaction;

    if (!cashflow) {
      validationErrors.cashflow = 'Cashflow is required';
      rc = -1;
    }
    if (!category) {
      validationErrors.category = 'Category is required';
      rc = -1;
    }
    if (!paymentmode) {
      validationErrors.paymentmode = 'Paymentmode is required';
      rc = -1;
    }

    if (!amount) {
      validationErrors.amount = 'Amount is required';
      rc = -1;
    }

    if (!expenseDate) {
      validationErrors.expenseDate = 'ExpenseDate is required';
      rc = -1;
    }

    setErrors(validationErrors);
    return rc;
  }

  function handleOnChange(evt: React.ChangeEvent<HTMLInputElement>): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actiontype = evt.target.getAttribute('data-actiontype')!;
    if (actiontype !== 'note') {
      dispatch({ type: actiontype, payload: evt.target.value.trim() });
      return;
    }
    dispatch({ type: actiontype, payload: evt.target.value });
  }

  function handleUpdate(evt: React.FormEvent<HTMLFormElement>): void {
    evt.preventDefault();
    if (validate() < 0) {
      return;
    }
    mutation.mutate(
      {
        ...transaction,
        amount: parseFloat(transaction.amount),
        expenseDate: parseInt(transaction.expenseDate),
        note: transaction.note.trim(),
      },
      { onSuccess: () => setTimeout(() => props.handleUpdateSuccess(), 2000) },
    );
  }

  return (
    <>
      <div className='EditModal'>
        <p>
          <strong>Edit transaction</strong>
        </p>
        {mutation.isPending ? (
          <span>Updating transaction...</span>
        ) : (
          <>{mutation.isError ? <span className='text-danger'>An error occurred: {mutation.error.message}</span> : null}</>
        )}
        <hr />
        <form onSubmit={handleUpdate}>
          <div>
            cashflow <input type='text' value={transaction.cashflow} data-actiontype='cashflow' onChange={handleOnChange} />{' '}
            <span>{errors.cashflow ? errors.cashflow : ' '}</span>
          </div>
          <div>
            category <input type='text' value={transaction.category} data-actiontype='category' onChange={handleOnChange} />{' '}
            <span>{errors.category ? errors.category : ' '}</span>
          </div>
          <div>
            paymentmode <input type='text' value={transaction.paymentmode} data-actiontype='paymentmode' onChange={handleOnChange} />
            <span>{errors.paymentmode ? errors.paymentmode : ' '}</span>
          </div>
          <div>
            amount <input type='text' value={transaction.amount} data-actiontype='amount' onChange={handleOnChange} />
            <span>{errors.amount ? errors.amount : ' '}</span>
          </div>
          <div>
            expenseDate <input type='text' value={transaction.expenseDate} data-actiontype='expenseDate' onChange={handleOnChange} />
            <span>{errors.expenseDate ? errors.expenseDate : ' '}</span>
          </div>
          <div>
            note <input type='text' value={transaction.note} data-actiontype='note' onChange={handleOnChange} />
          </div>
          <div>
            created <span>{transaction.id}</span>
          </div>
          <div className='button__actions'>
            <button type='submit' disabled={mutation.isPending}>
              Update
            </button>
            <button type='button' onClick={props.handleClose} disabled={mutation.isPending}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {mutation.isPending && <ModalSpinner />}
      {mutation.isSuccess && <ModalAlert message='Transaction successfully updated!' />}
    </>
  );
}
