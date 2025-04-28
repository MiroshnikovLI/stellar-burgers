import { ingredientsSlice, fetchIngredients } from './index';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
      __v: 0
    }
  ];

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(ingredientsSlice.reducer(undefined, { type: '' })).toEqual(
        initialState
      );
    });
  });

  describe('async thunks', () => {
    it('should handle fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('should handle fetchIngredients.rejected with payload', () => {
      const errorMessage = 'Network Error';
      const action = {
        type: fetchIngredients.rejected.type,
        payload: errorMessage
      };
      const state = ingredientsSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle fetchIngredients.rejected without payload', () => {
      const action = { type: fetchIngredients.rejected.type };
      const state = ingredientsSlice.reducer(initialState, action);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch ingredients');
    });
  });

  describe('selectors', () => {
    const testState = {
      ingredients: {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      }
    };

    it('selectAllIngredients should return all ingredients', () => {
      const result = ingredientsSlice.selectors.selectAllIngredients(testState);
      expect(result).toEqual(mockIngredients);
    });

    it('selectIngredientsLoading should return loading status', () => {
      const result =
        ingredientsSlice.selectors.selectIngredientsLoading(testState);
      expect(result).toBe(false);
    });

    it('selectIngredientsError should return error', () => {
      const result =
        ingredientsSlice.selectors.selectIngredientsError(testState);
      expect(result).toBeNull();
    });

    it('selectBuns should return only buns', () => {
      const result = ingredientsSlice.selectors.selectBuns(testState);
      expect(result).toEqual([mockIngredients[0]]);
      expect(result.every((item) => item.type === 'bun')).toBe(true);
    });

    it('selectMains should return only mains', () => {
      const result = ingredientsSlice.selectors.selectMains(testState);
      expect(result).toEqual([mockIngredients[1]]);
      expect(result.every((item) => item.type === 'main')).toBe(true);
    });

    it('selectSauces should return only sauces', () => {
      const result = ingredientsSlice.selectors.selectSauces(testState);
      expect(result).toEqual([mockIngredients[2]]);
      expect(result.every((item) => item.type === 'sauce')).toBe(true);
    });
  });
});
