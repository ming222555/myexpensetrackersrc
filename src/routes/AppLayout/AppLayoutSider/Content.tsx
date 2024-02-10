import React from 'react';

import { NavLink } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import { useQuery } from '@tanstack/react-query';

import { sumTransactionsAmountQueryOptions } from '../../../reactquery/transactions/transactionsRq';

const navLinkPending = 'btn btn-warning text-white mx-4 mb-4';
const navLinkActive = 'btn btn-info text-white mx-4 mb-4';
const navLinkDefault = 'btn btn-light mx-4 mb-4';

export default function Content(): JSX.Element {
  const { isPending, isError, error, data, fetchStatus } = useQuery(sumTransactionsAmountQueryOptions());

  return (
    <>
      <h1 className='position-sticky top-0 bg-dark h5 p-3 text-info'>EXPENSE TRACKER</h1>
      <br />
      <br />
      <Image src='face.png' rounded width='64%' className='align-self-center' />
      <br />
      <div className='mx-4'>
        <svg className='p-1' width='140px' height='80px' viewBox='0 0 140 80' xmlns='http://www.w3.org/2000/svg'>
          <style>
            {
              '.wallet-balance { \
                  fill: #828282; \
                  font-size: 1.2rem; \
                }'
            }
          </style>
          <g>
            <path
              d='m4 10 a 5 5 0 0 1 5 -5 h125 a5 5 0 0 1 0 10 h-125 a5 5 0 0 1 -5 -5 v60
a5 5 0 0 0 5 5 h125 a5 5 0 0 0 5 -5 v-25 a5 5 0 0 1 -10 0 a5 5 0 0 1 10 0 v-35'
              style={{ fill: 'none', stroke: '#828282', strokeWidth: '2px' }}
            />
            <text x='68' y='50' style={{ textAnchor: 'middle', letterSpacing: '0.5pt' }} className='wallet-balance'>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data ?? 0)}
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
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
      </NavLink>
      <NavLink
        to='about'
        className={({ isActive, isPending }): string => (isPending ? navLinkPending : isActive ? navLinkActive : navLinkDefault)}
        role='button'
      >
        About
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
