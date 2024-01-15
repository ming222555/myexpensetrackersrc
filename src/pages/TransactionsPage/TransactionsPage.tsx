import React, { useMemo, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import Filters from './components/Filters';
import type { Filters as IFilters } from '../../store/ducks/transactions/transactionsSlice';
import { search, filter as filterActionCreator, selectFilter } from '../../store/ducks/transactions/transactionsSlice';
import Search from './components/Search';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { transactionsOptions } from '../../reactquery/transactions/transactionsRq';

function TransactionsPage(): JSX.Element {
  const filter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();

  console.log('filter', JSON.stringify(filter));

  const pagenumRef = useRef(1);
  const setRender = useState({})[1];

  useMemo(() => {
    pagenumRef.current = 1; // reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const { isPending, isError, error, data, fetchStatus } = useQuery(transactionsOptions(pagenumRef.current, filter));

  const handleFiltersChange = useMemo(() => {
    return function (filters: IFilters) {
      dispatch(filterActionCreator(filters));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = useMemo(() => {
    return function (searchText: string) {
      dispatch(search(searchText));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('transactionsPage useeffect filter', Math.random());
  }, [filter]);

  useEffect(() => {
    console.log('transactionsPage useeffect dispatch', Math.random());
  }, [dispatch]);

  return (
    <div className='TransactionsPage'>
      <strong>{JSON.stringify(filter)}</strong>
      <br />
      <strong>{Math.random()}</strong>
      <hr />
      api response data {JSON.stringify(data)}
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
  );
}

export default TransactionsPage;
