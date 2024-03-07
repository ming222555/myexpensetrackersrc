import { NavLink, useLocation } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import { useQuery } from '@tanstack/react-query';

import { selectTransactions } from '../../../store/ducks/transactions/transactionsSlice';
import { useAppSelector } from '../../../hooks';
import { sumTransactionsAmountQueryOptions } from '../../../reactquery/transactions/transactionsRq';

const navLinkPending = 'btn btn-warning text-white mx-4 mb-4';
const navLinkActive = 'btn btn-info text-white mx-4 mb-4';
const navLinkDefault = 'btn btn-light mx-4 mb-4';

export default function Content(): JSX.Element {
  const {
    filter: { dateRange },
  } = useAppSelector(selectTransactions);
  const { isPending, isError, error, data, fetchStatus, status, isFetching } = useQuery(sumTransactionsAmountQueryOptions(dateRange));

  const sumTransactionsAmount = data ? parseFloat(data.split(',')[0]) : 0;

  const { pathname } = useLocation();

  return (
    <>
      <h1 className='position-sticky top-0 bg-dark h5 p-3 text-info'>EXPENSE TRACKER</h1>
      <br />
      <br />
      <Image src='face.png' rounded width='64%' className='align-self-center' />
      <br />
      <div className='mx-4'>
        <svg
          className={`p-1${isFetching ? ' wallet-fetching' : ''}`}
          width='140px'
          height='80px'
          viewBox='0 0 140 80'
          xmlns='http://www.w3.org/2000/svg'
        >
          <style>
            {
              '.wallet-balance { \
                fill: #828282; \
                font-size: 1.2rem; \
                } \
                .wallet-balance.deficit { \
                  fill: #ff0000; \
                  font-weight: 500; \
                } \
                .wallet-fetching { \
                  outline: 1px solid #0000ff; \
                  outline-style: dotted; \
                } \
                .wallet-balance.wallet-fetching { \
                  outline-style: none; \
                  fill: #0000ff; \
                }'
            }
          </style>
          <g>
            <path
              d='m4 10 a 5 5 0 0 1 5 -5 h125 a5 5 0 0 1 0 10 h-125 a5 5 0 0 1 -5 -5 v60
a5 5 0 0 0 5 5 h125 a5 5 0 0 0 5 -5 v-25 a5 5 0 0 1 -10 0 a5 5 0 0 1 10 0 v-35'
              style={{ fill: 'none', stroke: '#828282', strokeWidth: '2px' }}
            />
            <text
              x='68'
              y='50'
              style={{ textAnchor: 'middle', letterSpacing: '0.5pt' }}
              className={`wallet-balance${isFetching ? ' wallet-fetching' : ''}${sumTransactionsAmount < 0 ? ' deficit' : ''}`}
            >
              {isFetching
                ? 'Fetching...'
                : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sumTransactionsAmount)}
            </text>
          </g>
        </svg>
      </div>
      <br />
      <br />
      <NavLink
        to='transactions'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        Transactions
      </NavLink>
      <NavLink
        to='dashboard'
        className={({ isActive, isPending }): string =>
          isPending ? navLinkPending : isActive || pathname === '/' ? navLinkActive : navLinkDefault
        }
        role='button'
      >
        Dashboard
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
    </>
  );
}
