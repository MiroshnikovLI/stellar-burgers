import {
  ConstructorPage,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Feed } from '../../pages/feed/feed';
import { IngredientDetails } from '../ingredient-details';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { OnlyAuth, OnlyUnAuth } from './protected-route';
import { ClearBurger } from '../clear-burger';

export const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const backgroundLocation = location.state?.background;

  const orderNumber = location.state?.orderNumber;

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={closeModal}
                children={<IngredientDetails />}
              />
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                onClose={closeModal}
                title={`Информация о заказе ${orderNumber}`}
                children={<OrderInfo />}
              />
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`Информация о заказе ${orderNumber}`}
                onClose={closeModal}
                children={<OrderInfo />}
              />
            }
          />
          <Route
            path='/clear-burger'
            element={
              <Modal
                title='Очистить бургер'
                onClose={closeModal}
                children={<ClearBurger />}
                close
              />
            }
          />
        </Routes>
      )}
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/forgot-password'
          element={
            <OnlyUnAuth>
              <ForgotPassword />
            </OnlyUnAuth>
          }
        />
        <Route
          path='/reset-password'
          element={
            <OnlyUnAuth>
              <ResetPassword />
            </OnlyUnAuth>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <OnlyAuth>
              <OrderInfo />
            </OnlyAuth>
          }
        />
        <Route
          path='/login'
          element={
            <OnlyUnAuth>
              <Login />
            </OnlyUnAuth>
          }
        />
        <Route
          path='/register'
          element={
            <OnlyUnAuth>
              <Register />
            </OnlyUnAuth>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <OnlyAuth>
              <ResetPassword />
            </OnlyAuth>
          }
        />
        <Route
          path='/profile'
          element={
            <OnlyAuth>
              <Profile />
            </OnlyAuth>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <OnlyAuth>
              <ProfileOrders />
            </OnlyAuth>
          }
        />
      </Routes>
    </>
  );
};
