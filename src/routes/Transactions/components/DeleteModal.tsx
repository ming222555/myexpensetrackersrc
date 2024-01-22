import React from 'react';

import { useMutation } from '@tanstack/react-query';

import { deleteTransactions } from '../../../db/indexdb';

export default function DeleteModal(props: { selection: number[]; handleClose: () => void; handleDeleteSuccess: () => void }): JSX.Element {
  const mutation = useMutation({
    mutationFn: (selection: number[]) => {
      return deleteTransactions(selection);
    },
  });

  function handleDelete(): void {
    mutation.mutate(props.selection, { onSuccess: props.handleDeleteSuccess });
  }

  return (
    <>
      <div>
        <div>
          {mutation.isPending ? (
            'Deleting transaction(s)...'
          ) : (
            <>
              {mutation.isError ? <div>An error occurred: {mutation.error.message}</div> : null}
              {mutation.isSuccess ? <div>Transaction(s) deleted!</div> : null}
            </>
          )}
        </div>
        <hr />
        <p>Are you sure you want to delete selected transaction(s)?</p>
        <button type='button' onClick={handleDelete}>
          Yes
        </button>
        <button type='button' onClick={props.handleClose}>
          No
        </button>
      </div>
    </>
  );
}
