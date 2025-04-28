import { createAsyncThunk } from '@reduxjs/toolkit';
import { feedSlice, fetchFeed, createOrder, fetchOrderNumber } from './index';
import { getFeedsApi, getOrderByNumberApi, orderBurgerApi } from '@api';

// Моки для API
jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('feedSlice', () => {
  const initialState = {
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

  const mockOrder = {
    _id: '680f3e15e8e61d001cec4f04',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0940'
    ],
    status: 'done',
    name: 'Флюоресцентный метеоритный бургер',
    createdAt: '2025-04-28T08:36:37.955Z',
    updatedAt: '2025-04-28T08:36:38.757Z',
    number: 75771
  };

  const mockFeedResponse = {
    orders: [mockOrder],
    total: 1,
    totalToday: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(feedSlice.reducer(undefined, { type: '' })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    it('should handle openOrderModal', () => {
      const action = feedSlice.actions.openOrderModal();
      const state = feedSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
    });

    it('should handle closeOrderModal', () => {
      const stateWithModal = {
        ...initialState,
        orderRequest: true,
        orderModalData: mockOrder
      };
      const action = feedSlice.actions.closeOrderModal();
      const state = feedSlice.reducer(stateWithModal, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });

    it('should handle resetFeedError', () => {
      const stateWithError = { ...initialState, error: true };
      const action = feedSlice.actions.resetFeedError();
      const state = feedSlice.reducer(stateWithError, action);
      expect(state.error).toBe(false);
    });

    it('should handle setWsConnected', () => {
      const action = feedSlice.actions.setWsConnected(true);
      const state = feedSlice.reducer(initialState, action);
      expect(state.connected).toBe(true);
    });

    it('should handle clearOrder', () => {
      const stateWithOrder = {
        ...initialState,
        orderRequest: true,
        orderModalData: mockOrder
      };
      const action = feedSlice.actions.clearOrder();
      const state = feedSlice.reducer(stateWithOrder, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('async thunks', () => {
    describe('fetchFeed', () => {
      it('should handle pending', () => {
        const action = { type: fetchFeed.pending.type };
        const state = feedSlice.reducer(initialState, action);
        expect(state.connected).toBe(false);
        expect(state.error).toBe(false);
      });

      it('should handle fulfilled', async () => {
        (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedResponse);
        const action = {
          type: fetchFeed.fulfilled.type,
          payload: mockFeedResponse
        };
        const state = feedSlice.reducer(initialState, action);
        expect(state.connected).toBe(true);
        expect(state.feed).toEqual(mockFeedResponse);
      });

      it('should handle rejected', () => {
        const action = { type: fetchFeed.rejected.type };
        const state = feedSlice.reducer(initialState, action);
        expect(state.connected).toBe(false);
        expect(state.error).toBe(true);
      });
    });

    describe('Получение информации о заказе', () => {
      it('По номеру заказа', async () => {
        const mockResponse = { success: true, orders: [mockOrder] };
        (getOrderByNumberApi as jest.Mock).mockResolvedValue(mockResponse);
        const thunk = createAsyncThunk(
          'test/fetchOrderNumber',
          fetchOrderNumber
        );
        const dispatch = jest.fn();
        const getState = jest.fn();

        await thunk(75771)(dispatch, getState, undefined);
        expect(getOrderByNumberApi).toHaveBeenCalledWith(mockOrder);
      });

      it('Обработка неудачного запроса', async () => {
        (getOrderByNumberApi as jest.Mock).mockRejectedValue(
          new Error('Failed')
        );
        const thunk = createAsyncThunk(
          'test/fetchOrderNumber',
          fetchOrderNumber
        );
        const dispatch = jest.fn();

        const result = await thunk(75771)(dispatch, () => {}, undefined);
        expect(result.meta.requestStatus).toBe('rejected');
      });
    });
  });

  describe('Селекторы', () => {
    const testState = {
      feed: {
        feed: mockFeedResponse,
        orderRequest: true,
        orderModalData: mockOrder,
        connected: true,
        error: false,
        isLoading: false
      }
    };

    it('Получение информации заказов', () => {
      expect(feedSlice.selectors.selectFeed(testState)).toEqual(
        mockFeedResponse
      );
    });

    it('Получение статуса заказа', () => {
      expect(feedSlice.selectors.selectOrderRequest(testState)).toBe(true);
    });

    it('Получение информации о заказе', () => {
      expect(feedSlice.selectors.selectOrderModalData(testState)).toEqual(
        mockOrder
      );
    });

    it('Получить информацию о статусе подключения', () => {
      expect(feedSlice.selectors.selectWsConnected(testState)).toBe(true);
    });

    it('Получение статуса ошибки', () => {
      expect(feedSlice.selectors.selectFeedError(testState)).toBe(false);
    });

    it('Получение статуса загрузки', () => {
      expect(feedSlice.selectors.selectFeedLoading(testState)).toBe(false);
    });

    it('Получение информации всех заказов', () => {
      expect(feedSlice.selectors.selectAllOrders(testState)).toEqual([
        mockOrder
      ]);
    });
  });
});
