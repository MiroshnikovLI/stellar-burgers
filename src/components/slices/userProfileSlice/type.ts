import { TOrder, TUser } from '@utils-types';

export interface UserState {
  user: TUser | null;
  error: string;
  isAuthChecked: boolean;
  success: boolean;
  isLoading: boolean;
  errorBanner: boolean;
  userOrders: TOrder[];
}
