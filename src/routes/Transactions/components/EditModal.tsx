import React, { useReducer, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import Form from 'react-bootstrap/Form';

import { TransactionDto } from '../../../reactquery/transactions/transactionsRq';
import { updateTransaction } from '../../../db/indexdb';
import ModalSpinner from '../../../components/Modals/ModalSpinner';
import ModalAlert from '../../../components/Modals/ModalAlert';
import './EditModal.scss';
import { formatAMPM, formatYYYYMMDD, isNonValidRegexMonetaryAmout } from '../../../util';

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
      validationErrors.paymentmode = 'Payment Mode is required';
      rc = -1;
    }

    const strAmount = amount.trim();
    if (!strAmount) {
      validationErrors.amount = 'Amount is required';
      rc = -1;
    } else {
      const errmsg = isNonValidRegexMonetaryAmout(strAmount);
      if (errmsg) {
        validationErrors.amount = errmsg;
        rc = -1;
      }
    }

    if (!expenseDate) {
      validationErrors.expenseDate = 'ExpenseDate is required';
      rc = -1;
    }

    setErrors(validationErrors);
    return rc;
  }

  function handleOnChange(evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
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
        <Form onSubmit={handleUpdate}>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editcashflow'>Cashflow</Form.Label>
            <Form.Select
              aria-label='Select Cashflow'
              id='editcashflow'
              aria-describedby='editcashflowHelpBlock'
              value={transaction.cashflow}
              data-actiontype='cashflow'
              onChange={handleOnChange}
            >
              <option value=''></option>
              <option value='income'>Income</option>
              <option value='expense'>Expense</option>
            </Form.Select>
            <Form.Text id='editcashflowHelpBlock' className='text-danger'>
              {errors.cashflow ? errors.cashflow : ''}
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editcategory'>Category</Form.Label>
            <Form.Select
              aria-label='Select Category'
              id='editcategory'
              aria-describedby='editcategoryHelpBlock'
              value={transaction.category}
              data-actiontype='category'
              onChange={handleOnChange}
            >
              <option value=''></option>
              <option value='clothing'>Clothing</option>
              <option value='food'>Food</option>
              <option value='transport'>Transport</option>
              <option value='utilities'>Utilities</option>
            </Form.Select>
            <Form.Text id='editcategoryHelpBlock' className='text-danger'>
              {errors.category ? errors.category : ''}
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editpaymentmode'>Payment Mode</Form.Label>
            <Form.Select
              aria-label='Select Payment Mode'
              id='editpaymentmode'
              aria-describedby='editpaymentmodeHelpBlock'
              value={transaction.paymentmode}
              data-actiontype='paymentmode'
              onChange={handleOnChange}
            >
              <option value=''></option>
              <option value='cash'>Cash</option>
              <option value='creditcard'>Credit Card</option>
              <option value='debitcard'>Debit Card</option>
            </Form.Select>
            <Form.Text id='editpaymentmodeHelpBlock' className='text-danger'>
              {errors.paymentmode ? errors.paymentmode : ''}
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editamount'>Amount $</Form.Label>
            <Form.Control
              type='text'
              aria-label='Amount'
              id='editamount'
              aria-describedby='editamountHelpBlock'
              value={transaction.amount}
              data-actiontype='amount'
              onChange={handleOnChange}
            />
            <Form.Text id='editamountHelpBlock' className='text-danger'>
              {errors.amount ? errors.amount : ''}
            </Form.Text>
          </Form.Group>
          <div>
            expenseDate <input type='text' value={transaction.expenseDate} data-actiontype='expenseDate' onChange={handleOnChange} />
            <span>{errors.expenseDate ? errors.expenseDate : ' '}</span>
          </div>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editnote'>Note</Form.Label>
            <Form.Control as='textarea' rows={3} id='editnote' value={transaction.note} data-actiontype='note' onChange={handleOnChange} />
          </Form.Group>
          <br />
          <Form.Text muted>
            Created: {formatYYYYMMDD(new Date(transaction.id))}, {formatAMPM(new Date(transaction.id))}
          </Form.Text>
          <div className='button__actions'>
            <button type='submit' disabled={mutation.isPending}>
              Update
            </button>
            <button type='button' onClick={props.handleClose} disabled={mutation.isPending}>
              Cancel
            </button>
          </div>
        </Form>
      </div>
      {mutation.isPending && <ModalSpinner />}
      {mutation.isSuccess && <ModalAlert message='Transaction successfully updated!' />}
    </>
  );
}
