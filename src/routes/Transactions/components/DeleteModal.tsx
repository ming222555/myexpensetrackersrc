import React from 'react';

import { useMutation } from '@tanstack/react-query';

import { deleteTransactions } from '../../../db/indexdb';
import ModalSpinner from '../../../components/Modals/ModalSpinner';

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
      <div className='DeleteModal'>
        <p>Are you sure you want to delete selected transaction(s)?</p>
        {mutation.isPending ? (
          <span>Deleting transaction(s)...</span>
        ) : (
          <>
            {mutation.isError ? <span>An error occurred: {mutation.error.message}</span> : null}
            {mutation.isSuccess ? <span>Transaction(s) deleted!</span> : null}
          </>
        )}
        <br />
        <br />
        <button type='button' onClick={handleDelete} disabled={mutation.isPending}>
          Yes
        </button>{' '}
        <button type='button' onClick={props.handleClose} disabled={mutation.isPending}>
          No
        </button>
      </div>
      {mutation.isPending && <ModalSpinner />}
    </>
  );
}
