import { useMutation } from '@tanstack/react-query';

import { deleteTransactions } from '../../../db/indexdb';
import ModalSpinner from '../../../components/Modals/ModalSpinner';
import ModalAlert from '../../../components/Modals/ModalAlert';
import './DeleteModal.scss';

export default function DeleteModal(props: { selection: number[]; handleClose: () => void; handleDeleteSuccess: () => void }): JSX.Element {
  const mutation = useMutation({
    mutationFn: (selection: number[]) => {
      return deleteTransactions(selection);
    },
  });

  function handleDelete(): void {
    mutation.mutate(props.selection, {
      onSuccess: () => setTimeout(() => props.handleDeleteSuccess(), 2000),
    });
  }

  return (
    <>
      <div className='DeleteModal'>
        <p>Are you sure you want to delete selected transaction(s)?</p>
        {mutation.isPending ? (
          <span>Deleting transaction(s)...</span>
        ) : (
          <>{mutation.isError ? <span className='text-danger'>An error occurred: {mutation.error.message}</span> : null}</>
        )}
        <br />
        <br />
        <div className='button__actions'>
          <button type='button' onClick={handleDelete} disabled={mutation.isPending || mutation.isError}>
            Yes
          </button>
          <button type='button' onClick={props.handleClose} disabled={mutation.isPending}>
            No
          </button>
        </div>
      </div>
      {mutation.isPending && <ModalSpinner />}
      {mutation.isSuccess && <ModalAlert message='Transaction(s) successfully deleted!' />}
    </>
  );
}
