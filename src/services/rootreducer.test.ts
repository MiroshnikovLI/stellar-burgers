import { burgerConstructorSlice } from '../components/slices/burgerConstructorSlice';
import { feedSlice } from '../components/slices/feedSlice';
import { ingredientsSlice } from '../components/slices/ingredientsSlice';
import { userSlice } from '../components/slices/userProfileSlice';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import store, { AppDispatch, rootReducer, RootState } from './store';

describe('Redux Store Configuration', () => {
  describe('rootReducer', () => {
    it('should combine all slices correctly', () => {
      // Проверяем структуру корневого редьюсера
      expect(rootReducer).toBeDefined();

      const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

      // Проверяем наличие всех слайсов
      expect(state).toHaveProperty('burgerConstructor');
      expect(state).toHaveProperty('feed');
      expect(state).toHaveProperty('ingredients');
      expect(state).toHaveProperty('user');
    });

    it('should handle initial state of all slices', () => {
      const state = rootReducer(undefined, { type: '' });

      // Проверяем начальное состояние каждого слайса
      expect(state.burgerConstructor).toEqual(
        burgerConstructorSlice.getInitialState()
      );
      expect(state.feed).toEqual(feedSlice.getInitialState());
      expect(state.ingredients).toEqual(ingredientsSlice.getInitialState());
      expect(state.user).toEqual(userSlice.getInitialState());
    });
  });

  describe('store', () => {
    it('should be created with correct configuration', () => {
      // Проверяем экземпляр store
      expect(store).toBeDefined();
      expect(store.getState()).toBeDefined();

      // Проверяем наличие всех редьюсеров в store
      const state = store.getState();
      expect(state).toHaveProperty('burgerConstructor');
      expect(state).toHaveProperty('feed');
      expect(state).toHaveProperty('ingredients');
      expect(state).toHaveProperty('user');
    });

    it('should have devTools enabled in development', () => {
      const originalEnv = process.env.NODE_ENV;

      // Тест для development
      process.env.NODE_ENV = 'development';
      const devStore = configureStore({
        reducer: rootReducer,
        devTools: process.env.NODE_ENV !== 'production'
      });
      expect(devStore).toBeDefined();

      // Тест для production
      process.env.NODE_ENV = 'production';
      const prodStore = configureStore({
        reducer: rootReducer,
        devTools: process.env.NODE_ENV !== 'production'
      });
      expect(prodStore).toBeDefined();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Type Definitions', () => {
    it('should have correct RootState type', () => {
      const state: RootState = store.getState();

      // Проверяем типы для каждого слайса
      expect(state.burgerConstructor).toBeDefined();
      expect(state.feed).toBeDefined();
      expect(state.ingredients).toBeDefined();
      expect(state.user).toBeDefined();

      // Пример проверки структуры
      expect(state.user).toEqual(
        expect.objectContaining({
          user: null,
          error: '',
          isAuthChecked: false
        })
      );
    });

    it('should have correct AppDispatch type', () => {
      const dispatch: AppDispatch = store.dispatch;
      expect(typeof dispatch).toBe('function');

      // Можно проверить типизацию на конкретном действии
      const action = burgerConstructorSlice.actions.addIngredient({
        _id: 'string',
        name: 'string',
        type: 'string',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 0,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      });

      // Если TypeScript не ругается - тип правильный
      dispatch(action);
    });

    it('should provide typed hooks', () => {
      // Эти тесты в основном проверяют, что TypeScript не выдаёт ошибок
      const { useDispatch, useSelector } = require('./store');

      // Мокируем react-redux хуки
      jest.mock('react-redux', () => ({
        useDispatch: jest.fn(),
        useSelector: jest.fn()
      }));

      expect(typeof useDispatch).toBe('function');
      expect(typeof useSelector).toBe('function');
    });
  });

  describe('Integration', () => {
    it('should handle actions from different slices', () => {
      const stateBefore = store.getState();

      // Диспатчим действие из burgerConstructorSlice
      store.dispatch(
        burgerConstructorSlice.actions.addIngredient({
          _id: 'string',
          name: 'string',
          type: 'string',
          proteins: 0,
          fat: 0,
          carbohydrates: 0,
          calories: 0,
          price: 0,
          image: 'string',
          image_large: 'string',
          image_mobile: 'string'
        })
      );

      // Диспатчим действие из userSlice
      store.dispatch(
        userSlice.actions.setUser({
          email: 'test@example.com',
          name: 'Test User'
        })
      );

      const stateAfter = store.getState();

      // Проверяем изменения в соответствующих слайсах
      expect(stateAfter.burgerConstructor).not.toEqual(
        stateBefore.burgerConstructor
      );
      expect(stateAfter.user).not.toEqual(stateBefore.user);

      // Проверяем, что другие слайсы не изменились
      expect(stateAfter.feed).toEqual(stateBefore.feed);
      expect(stateAfter.ingredients).toEqual(stateBefore.ingredients);
    });
  });
});
