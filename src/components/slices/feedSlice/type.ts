import { TOrder } from '@utils-types';

export interface IInitialState {
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  connected: boolean;
  error: boolean;
  isLoading: boolean;
}
