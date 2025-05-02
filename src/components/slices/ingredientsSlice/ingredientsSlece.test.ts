import { ingredientsSlice, initialState } from './index';

describe('ingredientsSlice', () => {
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

  describe('Initial state', () => {
    it('Getting the initial state', () => {
      const result = ingredientsSlice.reducer(undefined, { type: '' });
      expect(result).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const testState = {
      ingredients: {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      }
    };

    it('Getting all the ingredients', () => {
      const result = ingredientsSlice.selectors.selectAllIngredients(testState);
      expect(result).toEqual(mockIngredients);
    });

    it('Getting the download status', () => {
      const result =
        ingredientsSlice.selectors.selectIngredientsLoading(testState);
      expect(result).toBe(false);
    });

    it('Getting information about an error', () => {
      const result =
        ingredientsSlice.selectors.selectIngredientsError(testState);
      expect(result).toBeNull();
    });

    it('Getting the ingredients of the bun', () => {
      const result = ingredientsSlice.selectors.selectBuns(testState);
      expect(result).toEqual([mockIngredients[0]]);
      expect(result.every((item) => item.type === 'bun')).toBe(true);
    });

    it('Getting the ingredients filling', () => {
      const result = ingredientsSlice.selectors.selectMains(testState);
      expect(result).toEqual([mockIngredients[1]]);
      expect(result.every((item) => item.type === 'main')).toBe(true);
    });

    it('Getting ingredients sauces', () => {
      const result = ingredientsSlice.selectors.selectSauces(testState);
      expect(result).toEqual([mockIngredients[2]]);
      expect(result.every((item) => item.type === 'sauce')).toBe(true);
    });
  });
});
