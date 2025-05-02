import {
  userSlice,
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  fetchUserOrders,
  initialState
} from './index';

describe('userSlice', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockOrders = [
    {
      _id: 'string',
      status: 'string',
      name: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      number: 0,
      ingredients: ['string']
    }
  ];

  it('get the initial state', () => {
    const result = userSlice.reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  describe('reducers', () => {
    it('Verifying user authentication', () => {
      const action = userSlice.actions.setAuthChecked(true);
      const state = userSlice.reducer(initialState, action);
      expect(state.isAuthChecked).toBe(true);
    });

    it('Checking the users data record', () => {
      const action = userSlice.actions.setUser(mockUser);
      const state = userSlice.reducer(initialState, action);
      expect(state.user).toEqual(mockUser);
    });

    it('Error cleaning check', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = userSlice.actions.clearError();
      const state = userSlice.reducer(stateWithError, action);
      expect(state.error).toBe('');
    });
  });

  describe('extraReducers', () => {
    describe('Verification receipt of user data', () => {
      it('Preparing to send the request', () => {
        const action = { type: fetchUser.pending.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isAuthChecked).toBe(false);
        expect(state.error).toBe('');
      });

      it('Error handling check', () => {
        const action = {
          type: fetchUser.rejected.type,
          error: { message: 'Fetch error' }
        };
        const state = userSlice.reducer(initialState, action);
        expect(state.isAuthChecked).toBe(false);
        expect(state.error).toBe('Fetch error');
      });

      it('Verification of successful request processing', () => {
        const action = {
          type: fetchUser.fulfilled.type,
          payload: { user: mockUser, success: true }
        };
        const state = userSlice.reducer(initialState, action);
        expect(state.isAuthChecked).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.success).toBe(true);
        expect(state.errorBanner).toBe(false);
      });
    });

    describe('loginUser', () => {
      it('Preparing to send the request', () => {
        const action = { type: loginUser.pending.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isAuthChecked).toBe(false);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe('');
      });

      it('Error handling check', () => {
        const action = { type: loginUser.rejected.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isAuthChecked).toBe(true);
        expect(state.isLoading).toBe(false);
        expect(state.errorBanner).toBe(true);
      });

      it('Verification of successful request processing', () => {
        const action = {
          type: loginUser.fulfilled.type,
          payload: { user: mockUser }
        };
        const state = userSlice.reducer(initialState, action);
        expect(state.isAuthChecked).toBe(true);
        expect(state.error).toBe('');
        expect(state.isLoading).toBe(false);
        expect(state.errorBanner).toBe(false);
        expect(state.user).toEqual(mockUser);
      });
    });

    describe('logoutUser', () => {
      it('Preparing to send the request', () => {
        const action = { type: logoutUser.pending.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(true);
      });

      it('Error handling check', () => {
        const action = { type: logoutUser.rejected.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.errorBanner).toBe(true);
      });

      it('Verification of successful request processing', () => {
        const stateWithUser = { ...initialState, user: mockUser };
        const action = { type: logoutUser.fulfilled.type };
        const state = userSlice.reducer(stateWithUser, action);
        expect(state.isLoading).toBe(false);
        expect(state.isAuthChecked).toBe(true);
        expect(state.success).toBe(false);
        expect(state.user).toBeNull();
        expect(state.errorBanner).toBe(false);
      });
    });

    describe('registerUser', () => {
      it('Preparing to send the request', () => {
        const action = { type: registerUser.pending.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(true);
        expect(state.error).toBe('');
      });

      it('Error handling check', () => {
        const action = {
          type: registerUser.rejected.type,
          error: { message: 'User already exists' }
        };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Пользователь уже существует');
      });

      it('Verification of successful request processing', () => {
        const action = {
          type: registerUser.fulfilled.type,
          payload: { user: mockUser, success: true }
        };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.isAuthChecked).toBe(true);
        expect(state.errorBanner).toBe(false);
        expect(state.success).toBe(true);
        expect(state.user).toEqual(mockUser);
      });
    });

    describe('updateUser', () => {
      it('Preparing to send the request', () => {
        const action = { type: updateUser.pending.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(true);
      });

      it('Verification of successful request processing', () => {
        const updatedUser = { ...mockUser, name: 'Updated Name' };
        const action = {
          type: updateUser.fulfilled.type,
          payload: { user: updatedUser, success: true }
        };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.errorBanner).toBe(false);
        expect(state.success).toBe(true);
        expect(state.user).toEqual(updatedUser);
      });
    });

    describe('fetchUserOrders', () => {
      it('Preparing to send the request', () => {
        const action = { type: fetchUserOrders.pending.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(true);
        expect(state.errorBanner).toBe(false);
      });

      it('Error handling check', () => {
        const action = { type: fetchUserOrders.rejected.type };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.errorBanner).toBe(true);
      });

      it('Verification of successful request processing', () => {
        const action = {
          type: fetchUserOrders.fulfilled.type,
          payload: mockOrders
        };
        const state = userSlice.reducer(initialState, action);
        expect(state.isLoading).toBe(false);
        expect(state.userOrders).toEqual(mockOrders);
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      user: {
        user: mockUser,
        error: 'Test error',
        isAuthChecked: true,
        userOrders: mockOrders,
        isLoading: true,
        errorBanner: true,
        success: false
      }
    };

    it('Getting users order data', () => {
      const result = userSlice.selectors.selectUserOrders(testState);
      expect(result).toEqual(mockOrders);
    });

    it('Getting user authentication data', () => {
      const result = userSlice.selectors.selectAuthChecked(testState);
      expect(result).toBe(true);
    });

    it('sGetting data about user authentication errors', () => {
      const result = userSlice.selectors.selectAuthError(testState);
      expect(result).toBe('Test error');
    });

    it('Getting the download status', () => {
      const result = userSlice.selectors.selectAuthLoading(testState);
      expect(result).toBe(true);
    });

    it('Getting the Error banner status', () => {
      const result = userSlice.selectors.selectErrorBanner(testState);
      expect(result).toBe(true);
    });
  });
});
