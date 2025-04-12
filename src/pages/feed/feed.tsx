import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  selectWsConnected,
  selectFeedError,
  selectAllOrders
} from '../../components/slices/feedSlice';
import { ErrorBanner } from '../../components/error-banner';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectAllOrders);

  const connected = useSelector(selectWsConnected);

  const [isMounted, setisMounted] = useState(false);

  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(fetchFeed());
    if (error) {
      setisMounted(true);
    }
  }, [error]);

  if (isMounted)
    return (
      <ErrorBanner
        initialMounted={isMounted}
        error={
          'Возникла ошибка соединения с сервером. Пожалуйста, перезагрузите страницу.'
        }
      />
    );

  if (!connected) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
