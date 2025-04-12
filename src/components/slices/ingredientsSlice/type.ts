import { TIngredient } from '@utils-types';

export interface IInitialState {
  ingredient: TIngredient[];
  isLoading: boolean;
  error: boolean;
}
