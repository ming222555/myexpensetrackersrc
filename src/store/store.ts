import { configureStore } from '@reduxjs/toolkit';

import * as transactions from './ducks/transactions/slice';

export const store = configureStore({
  reducer: {
    transactions: transactions.default,
  },
});
