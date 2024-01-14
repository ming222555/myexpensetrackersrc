import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../../store';

export interface Filters {
  categories: string;
  cashflow: string;
  paymentmode: string;
}

interface FiltersWithSearch extends Filters {
  search: string;
}

interface TransactionsState {
  filter: FiltersWithSearch;
}

const initialState = {
  filter: {
    search: '',
    categories: '',
    cashflow: '',
    paymentmode: '',
  },
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
  },
});

export const { search, filter } = transactionsSlice.actions;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectFilter = (state: RootState) => state.transactions.filter;

const reducer = transactionsSlice.reducer;
// export default transactionsSlice.reducer;
export default reducer;
