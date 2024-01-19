import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../store';

export interface Filters {
  categories: string;
  cashflow: string;
  paymentmode: string;
}

export interface FiltersWithSearch extends Filters {
  search: string;
}

interface TransactionsState {
  filter: FiltersWithSearch;
  selection: number[]; // transaction id's
}

export const initialState = {
  filter: {
    search: '',
    categories: '',
    cashflow: '',
    paymentmode: '',
  },
  selection: [],
} as TransactionsState;

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    search(state, action: PayloadAction<string>) {
      state.filter.search = action.payload;
    },
    filter(state, action: PayloadAction<Filters>) {
      const { categories, cashflow, paymentmode } = action.payload;
      state.filter.categories = categories;
      state.filter.cashflow = cashflow;
      state.filter.paymentmode = paymentmode;
    },
    addToSelection(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.selection.push(id);
    },
    removeFromSelection(state, action: PayloadAction<number>) {
      const id = action.payload;
      const pos = state.selection.findIndex(idFromSelection => idFromSelection === id);
      if (pos > -1) {
        state.selection.splice(pos, 1);
      }
    },
    clearSelection(state) {
      state.selection = [];
    },
    replaceSelection(state, action: PayloadAction<number[]>) {
      state.selection = action.payload;
    },
  },
});

export const { search, filter, addToSelection, removeFromSelection, clearSelection, replaceSelection } = transactionsSlice.actions;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const selectFilter = (state: RootState) => state.transactions.filter;
export const selectSelection = (state: RootState) => state.transactions.selection;
export const selectTransactions = (state: RootState) => state.transactions;
/* eslint-enable @typescript-eslint/explicit-function-return-type */

const reducer = transactionsSlice.reducer;
// export default transactionsSlice.reducer;
export default reducer;
