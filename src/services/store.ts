import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { burgerConstructorSlice } from '../components/slices/burgerConstructorSlice';
import { feedSlice } from '../components/slices/feedSlice';
import { ingredientsSlice } from '../components/slices/ingredientsSlice';
import { userSlice } from '../components/slices/userProfileSlice';

export const rootReducer = combineSlices(
  burgerConstructorSlice,
  feedSlice,
  ingredientsSlice,
  userSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
