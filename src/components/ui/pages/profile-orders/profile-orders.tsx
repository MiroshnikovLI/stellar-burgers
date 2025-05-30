import { FC } from 'react';

import styles from './profile-orders.module.css';

import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';
import { Preloader } from '../../preloader';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({
  orders,
  loading
}) => (
  <main className={`${styles.main}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={`mt-10 ${styles.orders}`}>
      {loading ? (
        <div className={styles.emptyOrders}>
          <Preloader />
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyOrders}>Пока нет заказов</div>
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  </main>
);
