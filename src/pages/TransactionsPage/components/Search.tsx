import React, { useMemo, useRef } from 'react';

import { useDebounce } from 'rooks';

function Search(props: { handleSearchChange: (search: string) => void }): JSX.Element {
  const qPrevTrimmedVal = useRef('');

  const handleSearchChange = useMemo(() => {
    return function (search: string) {
      console.log('Search', '"' + search + '"');
      props.handleSearchChange(search);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChangeDebounced = useDebounce<(search: string) => void>(handleSearchChange, 500);

  return (
    <div className='Search'>
      <input
        aria-label='Search'
        placeholder='Search'
        type='search'
        name='search'
        defaultValue=''
        onChange={(e): void => {
          const val = e.currentTarget.value;
          const valTrimmed = val.trim();
          console.log('val', val);
          if (valTrimmed !== qPrevTrimmedVal.current) {
            qPrevTrimmedVal.current = valTrimmed;
            handleFormChangeDebounced(valTrimmed);
          }
        }}
      />
    </div>
  );
}

export default Search;
