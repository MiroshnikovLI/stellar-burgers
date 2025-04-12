import { getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IInitialState } from './type';

const initialState: IInitialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  isLoading: false,
  error: undefined
};

const fetchOrder = createAsyncThunk('order/getOrder', async () =>
  getOrdersApi()
);

export const fetchOrderNumber = createAsyncThunk(
  'order/getOrderNumber',
  async (data: number) => getOrderByNumberApi(data)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    getOrder: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Unknown error';
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  }
});
