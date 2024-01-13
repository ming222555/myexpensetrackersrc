import React, { useMemo } from 'react';

import Filters from './components/Filters';
import type { Filters as IFilters } from '../../store/ducks/transactions/slice';
import Search from './components/Search';

function TransactionsPage(): JSX.Element {
  const handleFiltersChange = useMemo(() => {
    return function (filters: IFilters) {
      //
    };
  }, []);

  const handleSearchChange = useMemo(() => {
    return function (search: string) {
      //
    };
  }, []);

  return (
    <div className='TransactionsPage'>
      <Search handleSearchChange={handleSearchChange} />
      <Filters handleFiltersChange={handleFiltersChange} />
    </div>
  );
}

export default TransactionsPage;
