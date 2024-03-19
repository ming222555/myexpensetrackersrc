import { useReducer, useState, useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { createTransaction, tblCashflows, tblCategories, tblPaymentmodes } from '../../../db/indexdb';
import { TransactionDto } from '../../../db/dto';
import ModalSpinner from '../../../components/Modals/ModalSpinner';
import ModalAlert from '../../../components/Modals/ModalAlert';
import './CreateModal.scss';
import { formatAMPM, formatYYYYMMDD, toIntYYYYMMDD, delimitYYYYMMDD } from '../../../util';
import DatepickerCustomInput from '../../../components/DatepickerCustomInput/DatepickerCustomInput';

interface StringisedFields {
  amount: string;
  expenseDate: string;
}
type TransactionForForm = Omit<TransactionDto, keyof StringisedFields | 'id'> & StringisedFields;

export default function CreateModal(props: {
  initial: TransactionForForm;
  handleClose: () => void;
  handleCreateSuccess: () => void;
}): JSX.Element {
  function reducer(state: TransactionForForm, action: { type: string; payload: string }): TransactionForForm {
    switch (action.type) {
      case 'cashflow':
        return { ...state, cashflow: action.payload, category: '' }; // reset category
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
    ...props.initial,
    expenseDate: '20191231',
  });

  const [cents, setCents] = useState('');

  const mutation = useMutation({
    mutationFn: (creationDetails: Omit<TransactionDto, 'id'>) => {
      return createTransaction(creationDetails);
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

  function handleOnChange(evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actiontype = evt.target.getAttribute('data-actiontype')!;
    if (actiontype !== 'note') {
      if (actiontype !== 'amount') {
        // neither 'note' nor 'amount'
        dispatch({ type: actiontype, payload: evt.target.value.trim() });
        return;
      }
      // ...'amount'
      const amount = evt.target.value.replace(/\D/g, '');
      dispatch({ type: actiontype, payload: amount });
      return;
    }
    // ...'note'
    dispatch({ type: actiontype, payload: evt.target.value });
  }

  function handleOnChangeCents(evt: React.ChangeEvent<HTMLInputElement>): void {
    const cents = evt.target.value.replace(/\D/g, '');
    setCents(cents);
  }

  const handleOnChangeExpenseDate = useMemo(() => {
    return function (date: Date | null): void {
      const actiontype = 'expenseDate';
      dispatch({ type: actiontype, payload: toIntYYYYMMDD(date!) + '' });
    };
  }, []);

  function handleCreate(evt: React.FormEvent<HTMLFormElement>): void {
    evt.preventDefault();
    if (validate() < 0) {
      return;
    }

    let amount = parseFloat(transaction.amount);
    if (cents.length > 0) {
      const nbrCents = parseInt(cents);
      if (nbrCents > 0) {
        amount = parseFloat(transaction.amount + '.' + cents);
      }
    }

    mutation.mutate(
      {
        ...transaction,
        amount,
        expenseDate: parseInt(transaction.expenseDate),
        note: transaction.note.trim(),
      },
      { onSuccess: () => setTimeout(() => props.handleCreateSuccess(), 2000) },
    );
  }

  return (
    <>
      <div className='CreateModal'>
        <p>
          <strong>Create transaction</strong>
        </p>
        {mutation.isPending ? (
          <span>Creating transaction...</span>
        ) : (
          <>{mutation.isError ? <span className='text-danger'>An error occurred: {mutation.error.message}</span> : null}</>
        )}
        <hr />
        <Form onSubmit={handleCreate}>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editcashflow' className='EditModal__label'>
              Cashflow
            </Form.Label>
            <Form.Select
              aria-label='Select Cashflow'
              id='editcashflow'
              aria-describedby='editcashflowHelpBlock'
              value={transaction.cashflow}
              data-actiontype='cashflow'
              onChange={handleOnChange}
              size='sm'
            >
              <option value=''></option>
              {tblCashflows.map(cashflow => (
                <option key={cashflow.name} value={cashflow.name}>
                  {cashflow.label}
                </option>
              ))}
            </Form.Select>
            <Form.Text id='editcashflowHelpBlock' className='text-danger'>
              {errors.cashflow ? errors.cashflow : ''}
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editcategory' className='EditModal__label'>
              Category
            </Form.Label>
            <Form.Select
              aria-label='Select Category'
              id='editcategory'
              aria-describedby='editcategoryHelpBlock'
              value={transaction.category}
              data-actiontype='category'
              onChange={handleOnChange}
              size='sm'
            >
              <option value=''></option>
              {tblCategories.map(catgy => (
                <option
                  key={catgy.name}
                  value={catgy.name}
                  className={`${!transaction.cashflow || transaction.cashflow === catgy.cashflow ? 'd-block' : 'd-none'}`}
                >
                  {catgy.label}
                </option>
              ))}
            </Form.Select>
            <Form.Text id='editcategoryHelpBlock' className='text-danger'>
              {errors.category ? errors.category : ''}
            </Form.Text>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editpaymentmode' className='EditModal__label'>
              Payment Mode
            </Form.Label>
            <Form.Select
              aria-label='Select Payment Mode'
              id='editpaymentmode'
              aria-describedby='editpaymentmodeHelpBlock'
              value={transaction.paymentmode}
              data-actiontype='paymentmode'
              onChange={handleOnChange}
              size='sm'
            >
              <option value=''></option>
              {tblPaymentmodes.map(paymentmode => (
                <option key={paymentmode.name} value={paymentmode.name}>
                  {paymentmode.label}
                </option>
              ))}
            </Form.Select>
            <Form.Text id='editpaymentmodeHelpBlock' className='text-danger'>
              {errors.paymentmode ? errors.paymentmode : ''}
            </Form.Text>
          </Form.Group>
          <Row className='align-items-center'>
            <Col xs='auto'>
              <Form.Group className='mb-3'>
                <Form.Label htmlFor='editamount' className='EditModal__label'>
                  Amount $
                </Form.Label>
                <Form.Control
                  type='text'
                  aria-label='Amount'
                  id='editamount'
                  aria-describedby='editamountHelpBlock'
                  value={transaction.amount}
                  data-actiontype='amount'
                  onChange={handleOnChange}
                  maxLength={6}
                  placeholder='000000'
                  style={{ width: '6rem', textAlign: 'right' }}
                  size='sm'
                />
                <Form.Text id='editamountHelpBlock' className='text-danger'>
                  {errors.amount ? errors.amount : ''}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col xs='auto'>
              <Form.Text className='mb-3' muted>
                <strong>.</strong>
              </Form.Text>
            </Col>
            <Col xs='auto'>
              <Form.Group className='mb-3'>
                <Form.Label htmlFor='editcents' className='EditModal__label'>
                  cents
                </Form.Label>
                <Form.Control
                  type='text'
                  aria-label='Cents'
                  id='editcents'
                  value={cents}
                  onChange={handleOnChangeCents}
                  maxLength={2}
                  placeholder='00'
                  style={{ width: '4rem', textAlign: 'right' }}
                  size='sm'
                />
              </Form.Group>
            </Col>
          </Row>
          {/* <Form.Group className='mb-3'>
            <Form.Label htmlFor='editexpenseDate'>Date</Form.Label>
            <Form.Control
              type='text'
              aria-label='Expense Date'
              // id='editexpenseDate'
              aria-describedby='editexpenseDateHelpBlock'
              value={transaction.expenseDate}
              data-actiontype='expenseDate'
              onChange={handleOnChange}
            />
            <Form.Text id='editexpenseDateHelpBlock' className='text-danger'>
              {errors.expenseDate ? errors.expenseDate : ''}
            </Form.Text>
          </Form.Group> */}
          <Form.Group className='mb-3 mt-3'>
            <Form.Label htmlFor='editexpenseDate' className='me-3 EditModal__label'>
              Date
            </Form.Label>
            <DatepickerCustomInput
              initialDateString={delimitYYYYMMDD('20191231', '-')}
              className='btn btn-primary'
              memoOnChange={handleOnChangeExpenseDate}
              id='editexpenseDate'
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='editnote' className='EditModal__label'>
              Note
            </Form.Label>
            <Form.Control as='textarea' rows={3} id='editnote' value={transaction.note} data-actiontype='note' onChange={handleOnChange} />
          </Form.Group>
          <br />
          <Form.Text muted>
            Created:{' '}
            {mutation.data ? (
              <span>
                {formatYYYYMMDD(new Date(mutation.data))}, {formatAMPM(new Date(mutation.data))}
              </span>
            ) : (
              ''
            )}
          </Form.Text>
          <div className='button__actions'>
            <button type='submit' disabled={mutation.isPending || mutation.isError}>
              Create
            </button>
            <button type='button' onClick={props.handleClose} disabled={mutation.isPending}>
              Cancel
            </button>
          </div>
        </Form>
      </div>
      {mutation.isPending && <ModalSpinner />}
      {mutation.isSuccess && <ModalAlert message='Transaction successfully created!' />}
    </>
  );
}
