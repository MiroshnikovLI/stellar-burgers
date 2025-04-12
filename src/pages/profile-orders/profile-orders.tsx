import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchUserOrders,
  selectWsConnected,
  selectUserOrders
} from '../../components/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { ErrorBanner } from '../../components/error-banner';
import {
  selectAuthError,
  selectAuthLoading
} from '../../components/slices/userProfileSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const loadingOrder = useSelector(selectWsConnected);

  const error = useSelector(selectAuthError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  const orders: TOrder[] = useSelector(selectUserOrders);

  if (loading) return <Preloader />;

  return (
    <>
      {error && (
        <ErrorBanner
          initialMounted
          error={
            'Возникла ошибка соединения с сервером. Пожалуйста, перезагрузите страницу.'
          }
        />
      )}
      <ProfileOrdersUI orders={orders} loading={loadingOrder} />
    </>
  );
};
