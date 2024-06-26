import { useMemo, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { useDebounce } from 'rooks';

import Filters from './components/Filters';
import AmountRange from './components/AmountRange';
import DateRange from './components/DateRange';
import type { Filters as IFilters } from '../../store/ducks/transactions/transactionsSlice';
import {
  search,
  filters as filtersActionCreator,
  amountRange,
  dateRange,
  selectTransactions,
  clearSelection,
  clearFilterExceptDateRange,
  initialState,
} from '../../store/ducks/transactions/transactionsSlice';
import Search from './components/Search';
import TransactionsList from './components/TransactionsList';
import EditModal from './components/EditModal';
import CreateModal from './components/CreateModal';
import DeleteModal from './components/DeleteModal';
import { useAppSelector, useAppDispatch } from '../../hooks';
import queryClient from '../../reactquery';
import { TransactionDto } from '../../db/dto';
import { transactionsQueryOptions, sumTransactionsAmountQueryOptions } from '../../reactquery/transactions/transactionsRq';
// import SiderDrawer from '../AppLayout/components/SiderDrawer';
import SiderDrawer2 from '../AppLayout/components/SiderDrawer2';
import ModalCreate from '../../components/Modals/ModalCreate';
import ModalSpinner from '../../components/Modals/ModalSpinner';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const loader = async () => {
  const query = transactionsQueryOptions(1, initialState.filter);
  return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const sumTransactionsAmountLoader = async () => {
  const query = sumTransactionsAmountQueryOptions(initialState.filter.dateRange);
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

  const { isPending, isError, error, data, fetchStatus, isFetching } = useQuery(transactionsQueryOptions(pagenumRef.current, filter));

  const handleFiltersChange = useMemo(() => {
    return function (argfilters: IFilters) {
      dispatch(filtersActionCreator(argfilters));
      dispatch(clearSelection());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAmountRange = useMemo(() => {
    return function (amt: string, amt2: string) {
      dispatch(amountRange(amt + ',' + amt2));
      dispatch(clearSelection());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateRange = useMemo(() => {
    return function (dte: string, dte2: string) {
      dispatch(dateRange(dte + ',' + dte2));
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
    queryClient.invalidateQueries({ queryKey: sumTransactionsAmountQueryOptions(filter.dateRange).queryKey });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  /* async */ function handleCreateSuccess() {
    handleCloseCreateModal();
    queryClient.invalidateQueries({ queryKey: transactionsQueryOptions(pagenumRef.current, filter).queryKey });
    queryClient.invalidateQueries({ queryKey: sumTransactionsAmountQueryOptions(filter.dateRange).queryKey });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function handleDeleteSuccess() {
    dispatch(clearSelection());
    handleCloseDeleteModal();
    queryClient.invalidateQueries({ queryKey: sumTransactionsAmountQueryOptions(filter.dateRange).queryKey });
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

  const handlePagenumClick = useMemo(() => {
    return function (selectedItem: { selected: number }): void {
      const pagenum = selectedItem.selected + 1; // ReactPaginate starts from 0 while we from 1
      console.log('selectedItem.selected', pagenum);
      if (pagenumRef.current === pagenum) {
        return;
      }
      pagenumRef.current = pagenum;
      setRender({});
      dispatch(clearSelection());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePagenumClickDebounced = useDebounce<(selectedItem: { selected: number }) => void>(handlePagenumClick, 500);

  useEffect(() => {
    return () => {
      dispatch(clearSelection());
      dispatch(clearFilterExceptDateRange());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('transactions useeffect filter', Math.random());
  }, [filter]);

  useEffect(() => {
    console.log('transactions useeffect dispatch', Math.random());
  }, [dispatch]);

  return (
    <>
      <article className='Transactions'>
        <section className='TransactionsSection bg-light px-3'>
          <h2 className='h6 py-3'>All Transactions</h2>
          <div className='d-flex'>
            <Search handleSearchChange={handleSearchChange} />
            <button type='button' className='ms-2' onClick={handleOpenCreateModal}>
              New
            </button>
          </div>
          <div className='button__actions py-3'>
            <button type='button' onClick={handleOpenEditModal} disabled={selection.length !== 1}>
              Edit
            </button>
            <button type='button' onClick={handleOpenDeleteModal} disabled={selection.length === 0}>
              Delete
            </button>
          </div>
          {isError ? <p className='text-red'>{error.message} while fetching</p> : null}
          {data && <TransactionsList transactions={data.transactions} />}
          {data && data.totalPages > 1 && (
            <div className='Transactions__paginate d-flex align-items-baseline'>
              <ReactPaginate
                nextLabel=' >'
                onPageChange={handlePagenumClickDebounced}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={data.totalPages}
                previousLabel='< '
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                breakLabel='...'
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination'
                activeClassName='active'
                renderOnZeroPageCount={null}
                forcePage={data.pagenum - 1} // we are 1 index based but react-paginate 0 based
              />
              <div className='ms-2'>{`${data.pagenum} of ${data.totalPages} pages (${data.totalItems}) items`}</div>
            </div>
          )}
        </section>
        <aside className='Transactions__filters position-sm-sticky top-0'>
          <SiderDrawer2 as='nav' responsiveBreakPoint='mg' className='d-inline-flex flex-column px-2' placement='end'>
            <>
              <Filters handleFiltersChange={handleFiltersChange} />
              <DateRange handleDateRange={handleDateRange} initialDateRange={filter.dateRange} />
              <AmountRange handleAmountRange={handleAmountRange} />
            </>
          </SiderDrawer2>
        </aside>
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
      {isFetching && <ModalSpinner />}
    </>
  );
}
