import React, { useMemo, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import Filters from './components/Filters';
import type { Filters as IFilters } from '../../store/ducks/transactions/transactionsSlice';
import {
  search,
  filter as filterActionCreator,
  /* clearFilter, */
  selectTransactions,
  clearSelection,
  initialState,
} from '../../store/ducks/transactions/transactionsSlice';
import Search from './components/Search';
import TransactionsList from './components/TransactionsList';
import EditModal from './components/EditModal';
import CreateModal from './components/CreateModal';
import DeleteModal from './components/DeleteModal';
import { useAppSelector, useAppDispatch } from '../../hooks';
import queryClient from '../../reactquery';
import { transactionsQueryOptions, TransactionDto } from '../../reactquery/transactions/transactionsRq';
import SiderDrawer from '../AppLayout/components/SiderDrawer';
import ModalCreate from '../../components/Modals/ModalCreate';
import { createArrayofSize } from '../../util';

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
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [transactionIDsToDelete, setTransactionIDsToDelete] = useState<number[] | []>([]);

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

  function handleOpenCreateModal(): void {
    dispatch(clearSelection());
    setIsOpenCreateModal(true);
  }

  function handleCloseCreateModal(): void {
    setIsOpenCreateModal(false);
  }

  function handleOpenDeleteModal(): void {
    setTransactionIDsToDelete(selection);
  }

  function handleCloseDeleteModal(): void {
    setTransactionIDsToDelete([]);
  }

  function handleUpdateSuccess(): void {
    dispatch(clearSelection());
    handleCloseEditModal();
    queryClient.invalidateQueries({ queryKey: transactionsQueryOptions(pagenumRef.current, filter).queryKey });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  /* async */ function handleCreateSuccess() {
    handleCloseCreateModal();
    /* await queryClient.invalidateQueries({ queryKey: transactionsQueryOptions(1, initialState.filter).queryKey });
    pagenumRef.current = 1;
    dispatch(clearFilter());
    // todo... redux on filters search */
    queryClient.invalidateQueries({ queryKey: transactionsQueryOptions(pagenumRef.current, filter).queryKey });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function handleDeleteSuccess() {
    dispatch(clearSelection());
    handleCloseDeleteModal();
    const totalPagesB4Delete = data!.totalPages;
    try {
      const dataAfterDelete = await queryClient.fetchQuery(transactionsQueryOptions(pagenumRef.current, filter, 0));
      const totalPagesAfterDelete = dataAfterDelete.totalPages;
      const pagenumAfterDelete = dataAfterDelete.pagenum;

      if (totalPagesAfterDelete === totalPagesB4Delete) {
        return;
      }
      if (totalPagesAfterDelete < totalPagesB4Delete && totalPagesAfterDelete > 0) {
        if (pagenumRef.current > pagenumAfterDelete) {
          pagenumRef.current = pagenumAfterDelete;
          await queryClient.invalidateQueries({ queryKey: transactionsQueryOptions(pagenumRef.current, filter).queryKey });
          setRender({});
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  function handlePagenumClick(evt: React.MouseEvent<HTMLButtonElement>): void {
    const pagenum = parseInt(evt.currentTarget.getAttribute('data-pagenum')!);
    if (pagenumRef.current === pagenum) {
      return;
    }
    pagenumRef.current = pagenum;
    setRender({});
    dispatch(clearSelection());
  }

  useEffect(() => {
    console.log('transactions useeffect filter', Math.random());
  }, [filter]);

  useEffect(() => {
    console.log('transactions useeffect dispatch', Math.random());
  }, [dispatch]);

  return (
    <>
      <article className='Transactions'>
        <section className='TransactionsSection'>
          <h2 className='TransactionsSection__title h6 p-3'>All Transactions</h2>
          <Search handleSearchChange={handleSearchChange} />
          <div className='button__actions'>
            <button type='button' onClick={handleOpenCreateModal}>
              New
            </button>
            <button type='button' onClick={handleOpenEditModal} disabled={selection.length !== 1}>
              Edit
            </button>
            <button type='button' onClick={handleOpenDeleteModal} disabled={selection.length === 0}>
              Delete
            </button>
          </div>
          <TransactionsList transactions={data!.transactions} />
          {createArrayofSize(data!.totalPages).map(pagenum => (
            <button key={pagenum} data-pagenum={pagenum} onClick={handlePagenumClick}>
              {pagenum === data?.pagenum ? <em>{pagenum}</em> : pagenum}
            </button>
          ))}
        </section>
        <aside className='Transactions__filters'>
          <SiderDrawer placement='end'>
            <Filters handleFiltersChange={handleFiltersChange} />
          </SiderDrawer>
        </aside>
        {/* <div className='Transactions__filterString'>
          <strong>{JSON.stringify(filter)}</strong>
          <br />
          <strong>{Math.random()}</strong>
        </div>
        <div className='Transactions__data'>api response dataa {JSON.stringify(data)}</div> */}
        {/* <button
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
        </button> */}
      </article>
      {transactionToEdit && (
        <ModalCreate onClose={handleCloseEditModal}>
          <EditModal transaction={transactionToEdit} handleClose={handleCloseEditModal} handleUpdateSuccess={handleUpdateSuccess} />
        </ModalCreate>
      )}
      {isOpenCreateModal && (
        <ModalCreate onClose={handleCloseCreateModal}>
          <CreateModal
            initial={{
              cashflow: '',
              category: '',
              paymentmode: '',
              amount: '',
              expenseDate: '',
              note: '',
            }}
            handleClose={handleCloseCreateModal}
            handleCreateSuccess={handleCreateSuccess}
          />
        </ModalCreate>
      )}
      {transactionIDsToDelete.length > 0 && (
        <ModalCreate onClose={handleCloseDeleteModal}>
          <DeleteModal selection={transactionIDsToDelete} handleClose={handleCloseDeleteModal} handleDeleteSuccess={handleDeleteSuccess} />
        </ModalCreate>
      )}
    </>
  );
}
