import { burgerConstructorSlice } from './index';
import { nanoid } from '@reduxjs/toolkit';

describe('burgerConstructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun = {
    _id: '643d69a5c3f7b9001cfa093c',
    id: '0',
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
  };

  const mockIngredient = {
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
  };

  const id1 = nanoid();
  const id2 = nanoid();
  const id3 = nanoid();

  it('Получить начальное состояние', () => {
    expect(burgerConstructorSlice.reducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  describe('Добавления', () => {
    it('Добавление булки', () => {
      const action = {
        type: burgerConstructorSlice.actions.addIngredient.type,
        payload: mockBun
      };

      const result = burgerConstructorSlice.reducer(initialState, action);
      expect(result.bun).toEqual(action.payload);
      expect(result.ingredients).toHaveLength(0);
    });

    it('Добавление ингредиентов', () => {
      const action = {
        type: burgerConstructorSlice.actions.addIngredient.type,
        payload: { ...mockIngredient, id: nanoid() }
      };

      const result = burgerConstructorSlice.reducer(initialState, action);
      expect(result.bun).toBeNull();
      expect(result.ingredients).toContainEqual(action.payload);
    });

    it('Добавление ингредиентов и булки', () => {
      const bunWithId = mockBun;
      const actionAddBun = {
        type: burgerConstructorSlice.actions.addIngredient.type,
        payload: bunWithId
      };

      let state = burgerConstructorSlice.reducer(initialState, actionAddBun);

      expect(state.bun).toEqual(bunWithId);
      expect(state.ingredients).toHaveLength(0);

      const ingredientWithId = {
        ...mockIngredient,
        id: nanoid()
      };

      const actionAddIngredient = {
        type: burgerConstructorSlice.actions.addIngredient.type,
        payload: ingredientWithId
      };

      state = burgerConstructorSlice.reducer(state, actionAddIngredient);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toContainEqual(ingredientWithId);
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('Удаление ингридиентов', () => {
    it('Удаление одного ингредиента', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [{ ...mockIngredient, id: id1 }]
      };

      const action = {
        type: burgerConstructorSlice.actions.removeIngredient.type,
        payload: { ...mockIngredient, id: id1 }
      };

      const result = burgerConstructorSlice.reducer(
        stateWithIngredients,
        action
      );
      expect(result.ingredients).toHaveLength(0);
    });

    it('Удаление второго ингредиента из трёх', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: id1 },
          { ...mockIngredient, id: id2 },
          { ...mockIngredient, id: id3 }
        ]
      };

      const action = {
        type: burgerConstructorSlice.actions.removeIngredient.type,
        payload: { ...mockIngredient, id: id2 }
      };

      const result = burgerConstructorSlice.reducer(
        stateWithIngredients,
        action
      );
      expect(result.ingredients[0].id).toBe(id1);
      expect(result.ingredients[1].id).toBe(id3);
    });

    it('Удаление третьего ингредиента из трёх', () => {
      const stateWithIngredients = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: id1 },
          { ...mockIngredient, id: id2 },
          { ...mockIngredient, id: id3 }
        ]
      };

      const action = {
        type: burgerConstructorSlice.actions.removeIngredient.type,
        payload: { ...mockIngredient, id: id3 }
      };

      const result = burgerConstructorSlice.reducer(
        stateWithIngredients,
        action
      );
      expect(result.ingredients[0].id).toBe(id1);
      expect(result.ingredients[1].id).toBe(id2);
    });
  });

  describe('Переместить ингредиент', () => {
    it('Переместить ингредиент вниз', () => {
      const state = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: id1 },
          { ...mockIngredient, id: id2 }
        ]
      };

      const action = {
        type: burgerConstructorSlice.actions.ingredientMoveDown.type,
        payload: 0
      };

      const result = burgerConstructorSlice.reducer(state, action);
      expect(result.ingredients[0].id).toBe(id2);
      expect(result.ingredients[1].id).toBe(id1);
    });

    it('Переместить ингредиент вверх', () => {
      const state = {
        bun: null,
        ingredients: [
          { ...mockIngredient, id: id1 },
          { ...mockIngredient, id: id2 }
        ]
      };

      const action = {
        type: burgerConstructorSlice.actions.ingredientMoveUp.type,
        payload: 1
      };

      const result = burgerConstructorSlice.reducer(state, action);
      expect(result.ingredients[0].id).toBe(id2);
      expect(result.ingredients[1].id).toBe(id1);
    });

    it('Только один элемент', () => {
      const state = {
        bun: null,
        ingredients: [{ ...mockIngredient, id: id1 }]
      };

      const action = {
        type: burgerConstructorSlice.actions.ingredientMoveUp.type,
        payload: 1
      };

      const result = burgerConstructorSlice.reducer(state, action);
      expect(result.ingredients[1].id).toBe(id1);
    });
  });

  describe('Очистить конструктор', () => {
    it('Очистить конструктор при завершение оформление заказа заказа ', () => {
      const state = {
        bun: mockBun,
        ingredients: [{ ...mockIngredient, id: nanoid() }]
      };

      const action = {
        type: burgerConstructorSlice.actions.clearConstructor.type,
        payload: true
      };

      const result = burgerConstructorSlice.reducer(state, action);
      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });

    it('Очистка конструктора во время ожидания оформления заказа', () => {
      const state = {
        bun: mockBun,
        ingredients: [{ ...mockIngredient, id: id1 }]
      };

      const action = {
        type: burgerConstructorSlice.actions.clearConstructor.type,
        payload: false
      };

      const result = burgerConstructorSlice.reducer(state, action);
      expect(result.bun).toEqual(state.bun);
      expect(result.ingredients).toEqual(state.ingredients);
    });

    it('Очистка конструктора при добавление только булки', () => {
      const state = {
        bun: mockBun,
        ingredients: []
      };

      const action = {
        type: burgerConstructorSlice.actions.clearConstructor.type,
        payload: true
      };

      const result = burgerConstructorSlice.reducer(state, action);
      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });

    it('Очистка конструктора при добавление только ингредиентов', () => {
      const state = {
        bun: null,
        ingredients: [{ ...mockIngredient, id: id1 }]
      };

      const action = {
        type: burgerConstructorSlice.actions.clearConstructor.type,
        payload: true
      };

      const result = burgerConstructorSlice.reducer(state, action);
      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });

  describe('Элементы', () => {
    it('Показать все элементы', () => {
      const state = {
        burgerConstructor: {
          bun: mockBun,
          ingredients: [{ ...mockIngredient, id: id1 }]
        }
      };

      const selected =
        burgerConstructorSlice.selectors.selectConstructorItems(state);
      expect(selected).toEqual(state.burgerConstructor);
    });
  });
});
