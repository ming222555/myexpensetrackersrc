import { configureStore } from '@reduxjs/toolkit';

import * as transactions from './ducks/transactions/transactionsSlice';

const store = configureStore({
  reducer: {
    transactions: transactions.default,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
