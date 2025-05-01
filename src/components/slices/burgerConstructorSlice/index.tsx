import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { IInitialState } from './type';

export const initialState: IInitialState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: Omit<TIngredient, 'id'>) => ({
        payload: {
          ...ingredient,
          id: nanoid() // Генерация уникального ID
        }
      })
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (b) => b.id !== action.payload.id
      );
    },
    ingredientMoveUp: (state, action) => {
      // Создаем новый массив
      const newArray = [...state.ingredients];

      // Меняем местами текущий элемент с предыдущим
      [newArray[action.payload - 1], newArray[action.payload]] = [
        newArray[action.payload],
        newArray[action.payload - 1]
      ];

      state.ingredients = newArray;
    },
    ingredientMoveDown: (state, action) => {
      // Создаем новый массив
      const newArray = [...state.ingredients];

      // Меняем местами текущий элемент с предыдущим
      [newArray[action.payload + 1], newArray[action.payload]] = [
        newArray[action.payload],
        newArray[action.payload + 1]
      ];

      state.ingredients = newArray;
    },
    clearConstructor: (state, action) => {
      if (action.payload) {
        state.bun = null;
        state.ingredients = [];
      }
    }
  },
  selectors: {
    selectConstructorItems: (state) => state
  }
});

export const {
  addIngredient,
  removeIngredient,
  ingredientMoveUp,
  ingredientMoveDown,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { selectConstructorItems } = burgerConstructorSlice.selectors;
