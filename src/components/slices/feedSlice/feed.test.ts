import { feedSlice } from './index';

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

  describe('Начальное состояние', () => {
    it('Получение начального состояния', () => {
      expect(feedSlice.reducer(undefined, { type: '' })).toEqual(initialState);
    });
  });

  describe('Редюсер', () => {
    it('Проверка состояние получение информации', () => {
      const action = feedSlice.actions.openOrderModal();
      const state = feedSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
    });

    it('Проверка закрытие модального окна', () => {
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

    it('Проверка состояния подключения', () => {
      const action = feedSlice.actions.setWsConnected(true);
      const state = feedSlice.reducer(initialState, action);
      expect(state.connected).toBe(true);
    });

    it('Проверка состояния ошибки', () => {
      const stateWithError = { ...initialState, error: true };
      const action = feedSlice.actions.resetFeedError();
      const state = feedSlice.reducer(stateWithError, action);
      expect(state.error).toBe(false);
    });

    it('Очистка заказа после закрытия окна', () => {
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
