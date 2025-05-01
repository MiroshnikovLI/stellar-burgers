import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { IInitialState } from './type';

export const initialState: IInitialState = {
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  orderRequest: false,
  orderModalData: null,
  connected: false,
  error: false,
  isLoading: false
};

export const fetchFeed = createAsyncThunk('feed/fetchAll', getFeedsApi);

export const createOrder = createAsyncThunk(
  'feed/createOrder',
  async (ingredients: string[]) => orderBurgerApi(ingredients)
);

export const fetchOrderNumber = createAsyncThunk(
  'order/getOrderNumber',
  async (data: number) => {
    try {
      const response = await getOrderByNumberApi(data);
      if (!response.success) {
        throw new Error(response.success || 'Failed to fetch order');
      }
      return response;
    } catch {}
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    openOrderModal: (state) => {
      state.orderRequest = true;
    },
    closeOrderModal: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    setWsConnected: (state, action) => {
      state.connected = action.payload;
    },
    clearOrder: (state) => {
      if (state.orderModalData) {
        state.orderRequest = false;
        state.orderModalData = null;
      }
    }
  },
  selectors: {
    selectFeed: (state) => state.feed,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectWsConnected: (state) => state.connected,
    selectFeedError: (state) => state.error,
    selectFeedLoading: (state) => state.isLoading,
    selectAllOrders: (state) => state.feed.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.connected = false;
        state.error = false;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.connected = false;
        state.error = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.connected = true;
        state.feed = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.connected = false;
        state.error = false;
      })
      .addCase(createOrder.rejected, (state) => {
        state.error = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = true;
        state.connected = true;
        state.orderModalData = action.payload.order;
      });
  }
});

export const { openOrderModal, closeOrderModal, setWsConnected, clearOrder } =
  feedSlice.actions;

export const {
  selectFeed,
  selectOrderRequest,
  selectOrderModalData,
  selectWsConnected,
  selectFeedError,
  selectFeedLoading,
  selectAllOrders
} = feedSlice.selectors;
