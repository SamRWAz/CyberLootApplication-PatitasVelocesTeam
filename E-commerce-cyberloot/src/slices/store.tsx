import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './ProductSlice';
import usersReducer from './UserSlice';
import commentsReducer from './CommentSlice';
import cartReducer from './CartSlice';
import favoriteReducer from './FavoriteSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    users: usersReducer,
    comments: commentsReducer,
    cart: cartReducer,
    favorites: favoriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

