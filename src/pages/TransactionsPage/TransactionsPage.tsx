import React, { useMemo } from 'react';

import Filters from './components/Filters';
import type { Filters as IFilters } from './components/Filters';

function TransactionsPage(): JSX.Element {
  const handleFiltersChange = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (filters: IFilters) {
      //
    };
  }, []);

  return (
    <div>
      <Filters handleFiltersChange={handleFiltersChange} />
    </div>
  );
}

export default TransactionsPage;
