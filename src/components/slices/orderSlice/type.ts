import { TOrder } from '@utils-types';

export interface IInitialState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
  isLoading: boolean;
  error?: string;
}
