import { useMemo, useRef, memo } from 'react';

import { useDebounce } from 'rooks';
import Form from 'react-bootstrap/Form';

function Search(props: { handleSearchChange: (search: string) => void }): JSX.Element {
  const qPrevTrimmedVal = useRef('');

  const handleSearchChange = useMemo(() => {
    return function (search: string) {
      console.log('Search', '"' + search + '"');
      props.handleSearchChange(search);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChangeDebounced = useDebounce<(search: string) => void>(handleSearchChange, 500);

  return (
    <Form.Control
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
          handleSearchChangeDebounced(valTrimmed);
        }
      }}
      size='sm'
    />
  );
}

const MemoizedSearch = memo(Search);

export default MemoizedSearch;
