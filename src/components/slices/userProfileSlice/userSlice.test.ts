import {
  userSlice,
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  fetchUserOrders
} from './index';

describe('userSlice', () => {
  const initialState = {
    user: null,
    error: '',
    isAuthChecked: false,
    success: false,
    isLoading: false,
    errorBanner: false,
    userOrders: []
  };

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const mockOrders = [
    {
      _id: '680f6caee8e61d001cec4f5e',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-04-28T11:55:26.427Z',
      updatedAt: '2025-04-28T11:55:27.246Z',
      number: 75776
    },
    {
      _id: '680f6caee8e61d001cec4f5e',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e'
      ],
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2025-04-28T11:55:26.427Z',
      updatedAt: '2025-04-28T11:55:27.246Z',
      number: 75776
    }
  ];

  describe('Селекторы', () => {
    const testState = {
      user: {
        user: mockUser,
        error: 'Test error',
        isAuthChecked: true,
        success: true,
        isLoading: true,
        errorBanner: true,
        userOrders: mockOrders
      }
    };

    it('получение информации о пользователе', () => {
      const result = userSlice.selectors.selectUser(testState);
      expect(result).toEqual(mockUser);
    });

    it('Получение информации о заказах пользователя', () => {
      expect(userSlice.selectors.selectUserOrders(testState)).toEqual(
        mockOrders
      );
    });

    it('Получение статуса афторизации', () => {
      expect(userSlice.selectors.selectAuthChecked(testState)).toBe(true);
    });

    it('Получение информации об ошибки', () => {
      expect(userSlice.selectors.selectAuthError(testState)).toBe('Test error');
    });

    it('Получение статуса загрузки', () => {
      expect(userSlice.selectors.selectAuthLoading(testState)).toBe(true);
    });

    it('Получение статуса ошибки', () => {
      expect(userSlice.selectors.selectErrorBanner(testState)).toBe(true);
    });
  });
});
