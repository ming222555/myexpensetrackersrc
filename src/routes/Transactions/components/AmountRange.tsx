import { ChangeEvent, useState } from 'react';

import './AmountRange.scss';

export default function AmountRange(props: { handleAmountRange: (amt: string, amt2: string) => void }): JSX.Element {
  const [amt, setAmt] = useState('');
  const [amt2, setAmt2] = useState('');

  function handleOnChangeAmt(evt: ChangeEvent<HTMLInputElement>): void {
    const amt = evt.target.value.replace(/\D/g, '');
    setAmt(amt);
  }

  function handleOnChangeAmt2(evt: ChangeEvent<HTMLInputElement>): void {
    const amt2 = evt.target.value.replace(/\D/g, '');
    setAmt2(amt2);
  }

  function handleAmountRange(): void {
    if (amt && amt2) {
      const intAmt = parseInt(amt);
      const intAmt2 = parseInt(amt2);

      if (intAmt > intAmt2) {
        props.handleAmountRange(amt2, amt);
      } else {
        props.handleAmountRange(amt, amt2);
      }

      return;
    }
    props.handleAmountRange(amt, amt2);
  }

  return (
    <div className='AmountRange my-2'>
      <h6 className='h6 AmountRange__title text-info'>Amount range</h6>
      <div>
        <input
          type='text'
          value={amt}
          id='AmountRangeAmt'
          maxLength={6}
          placeholder='000000'
          style={{ textAlign: 'right' }}
          onChange={handleOnChangeAmt}
        />
      </div>
      <div className='d-flex'>
        <input
          type='text'
          value={amt2}
          id='AmountRangeAmt2'
          maxLength={6}
          placeholder='000000'
          style={{ textAlign: 'right' }}
          onChange={handleOnChangeAmt2}
        />
        <button type='button' className='ms-2' onClick={handleAmountRange}>
          Go
        </button>
      </div>
    </div>
  );
}
