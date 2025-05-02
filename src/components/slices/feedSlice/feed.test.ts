import { feedSlice, fetchFeed, createOrder, initialState } from './index';

describe('feedSlice', () => {
  const mockOrder = {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Test Order',
    number: 1234,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  const mockFeedResponse = {
    orders: [mockOrder],
    total: 1,
    totalToday: 1
  };

  it('get the initial state', () => {
    const result = feedSlice.reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('reducers', () => {
    it('Opening the modal order window', () => {
      const action = feedSlice.actions.openOrderModal();
      const state = feedSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
    });

    it('Closing the modal order window', () => {
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

    it('Checking the connection', () => {
      const action = feedSlice.actions.setWsConnected(true);
      const state = feedSlice.reducer(initialState, action);
      expect(state.connected).toBe(true);
    });

    it('Checking the order clearance when receiving a response from the server', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder,
        orderRequest: true
      };
      const action = feedSlice.actions.clearOrder();
      const state = feedSlice.reducer(stateWithOrder, action);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });

    it('Checking the order clearance without receiving a response from the server', () => {
      const action = feedSlice.actions.clearOrder();
      const state = feedSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(false);
    });
  });

  describe('extraReducers', () => {
    it('Preparing to send the request', () => {
      const action = { type: fetchFeed.pending.type };
      const state = feedSlice.reducer(initialState, action);
      expect(state.connected).toBe(false);
      expect(state.error).toBe(false);
    });

    it('Error handling check', () => {
      const action = { type: fetchFeed.rejected.type };
      const state = feedSlice.reducer(initialState, action);
      expect(state.connected).toBe(false);
      expect(state.error).toBe(true);
    });

    it('Verification of successful request processing', () => {
      const action = {
        type: fetchFeed.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = feedSlice.reducer(initialState, action);
      expect(state.connected).toBe(true);
      expect(state.feed).toEqual(mockFeedResponse);
      expect(state.error).toBe(false);
    });

    it('Preparing to send the request', () => {
      const action = { type: createOrder.pending.type };
      const state = feedSlice.reducer(initialState, action);
      expect(state.connected).toBe(false);
      expect(state.error).toBe(false);
    });

    it('Error handling check', () => {
      const action = { type: createOrder.rejected.type };
      const state = feedSlice.reducer(initialState, action);
      expect(state.error).toBe(true);
    });

    it('Verification of successful request processing', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = feedSlice.reducer(initialState, action);
      expect(state.orderRequest).toBe(true);
      expect(state.connected).toBe(true);
      expect(state.orderModalData).toEqual(mockOrder);
    });
  });

  describe('selectors', () => {
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

    it('selectOrderRequest should return request status', () => {
      expect(feedSlice.selectors.selectOrderRequest(testState)).toBe(true);
    });

    it('Getting data about the modal order window', () => {
      expect(feedSlice.selectors.selectOrderModalData(testState)).toEqual(
        mockOrder
      );
    });

    it('Checking the connection status', () => {
      expect(feedSlice.selectors.selectWsConnected(testState)).toBe(true);
    });

    it('Checking the error status', () => {
      expect(feedSlice.selectors.selectFeedError(testState)).toBe(false);
    });

    it('Checking the download status', () => {
      expect(feedSlice.selectors.selectFeedLoading(testState)).toBe(false);
    });

    it('Verification receipt of all order data', () => {
      expect(feedSlice.selectors.selectAllOrders(testState)).toEqual([
        mockOrder
      ]);
    });
  });
});
