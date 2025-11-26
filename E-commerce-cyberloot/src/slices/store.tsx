import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './ProductSlice';
import usersReducer from './UserSlice';
import commentsReducer from './CommentSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    users: usersReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

