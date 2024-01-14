import React, { useMemo, useEffect } from 'react';

import Filters from './components/Filters';
import type { Filters as IFilters } from '../../store/ducks/transactions/transactionsSlice';
import { search, filter, selectFilter } from '../../store/ducks/transactions/transactionsSlice';
import Search from './components/Search';
import { useAppSelector, useAppDispatch } from '../../hooks';

function TransactionsPage(): JSX.Element {
  const filterSelected = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();

  console.log('filterSelected', JSON.stringify(filterSelected));

  const handleFiltersChange = useMemo(() => {
    return function (filters: IFilters) {
      dispatch(filter(filters));
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
    console.log('transactionsPage useeffect filterSelected', Math.random());
  }, [filterSelected]);

  useEffect(() => {
    console.log('transactionsPage useeffect dispatch', Math.random());
  }, [dispatch]);

  return (
    <div className='TransactionsPage'>
      <strong>{JSON.stringify(filterSelected)}</strong>
      <br />
      <strong>{Math.random()}</strong>
      <Search handleSearchChange={handleSearchChange} />
      <Filters handleFiltersChange={handleFiltersChange} />
    </div>
  );
}

export default TransactionsPage;
