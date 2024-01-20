import React, { useMemo, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import Filters from './components/Filters';
import type { Filters as IFilters } from '../../store/ducks/transactions/transactionsSlice';
import {
  search,
  filter as filterActionCreator,
  selectTransactions,
  clearSelection,
  initialState,
} from '../../store/ducks/transactions/transactionsSlice';
import Search from './components/Search';
import TransactionsList from './components/TransactionsList';
import EditModal from './components/EditModal';
import { useAppSelector, useAppDispatch } from '../../hooks';
import queryClient from '../../reactquery';
import { transactionsQueryOptions, TransactionDto } from '../../reactquery/transactions/transactionsRq';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loader = async () => {
  const query = transactionsQueryOptions(1, initialState.filter);
  return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
};

export default function Transactions(): JSX.Element {
  const { filter, selection } = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();

  console.log('filter', JSON.stringify(filter));

  const pagenumRef = useRef(1);
  const setRender = useState({})[1];
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionDto | undefined>(undefined);

  useMemo(() => {
    pagenumRef.current = 1; // reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const { isPending, isError, error, data, fetchStatus } = useQuery(transactionsQueryOptions(pagenumRef.current, filter));

  const handleFiltersChange = useMemo(() => {
    return function (filters: IFilters) {
      dispatch(filterActionCreator(filters));
      dispatch(clearSelection());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = useMemo(() => {
    return function (searchText: string) {
      dispatch(search(searchText));
      dispatch(clearSelection());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOpenEditModal(): void {
    const id = selection[0];
    const transaction = data?.transactions.find(trx => trx.id === id);
    setTransactionToEdit(transaction);
  }

  function handleCloseEditModal(): void {
    setTransactionToEdit(undefined);
  }

  useEffect(() => {
    console.log('transactions useeffect filter', Math.random());
  }, [filter]);

  useEffect(() => {
    console.log('transactions useeffect dispatch', Math.random());
  }, [dispatch]);

  return (
    <>
      <div className='Transactions'>
        <div className='Transactions__filterString'>
          <strong>{JSON.stringify(filter)}</strong>
          <br />
          <strong>{Math.random()}</strong>
        </div>
        <div className='Transactions__data'>api response dataa {JSON.stringify(data)}</div>
        <button type='button' onClick={handleOpenEditModal} disabled={selection.length !== 1}>
          Edit
        </button>{' '}
        <button type='button' disabled={selection.length === 0}>
          Delete
        </button>
        <TransactionsList transactions={data!.transactions} />
        <Search handleSearchChange={handleSearchChange} />
        <Filters handleFiltersChange={handleFiltersChange} />
        <button
          onClick={(): void => {
            pagenumRef.current = 1;
            setRender({});
          }}
        >
          pg1
        </button>
        <button
          onClick={(): void => {
            pagenumRef.current = 2;
            setRender({});
          }}
        >
          pg2
        </button>
        <button
          onClick={(): void => {
            pagenumRef.current = 3;
            setRender({});
          }}
        >
          pg3
        </button>
      </div>
      {transactionToEdit && (
        <EditModal transaction={transactionToEdit} handleClose={handleCloseEditModal} handleUpdateSuccess={handleCloseEditModal} />
      )}
    </>
  );
}