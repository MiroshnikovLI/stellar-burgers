import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  selectConstructorItems
} from '../slices/burgerConstructorSlice/tindex';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../slices/userProfileSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createOrder,
  selectOrderModalData,
  selectOrderRequest,
  openOrderModal,
  clearOrder
} from '../slices/feedSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);
  const location = useLocation();

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!user) {
      navigator('/login');
    } else {
      if (!constructorItems.bun || orderRequest) return;

      dispatch(openOrderModal());
      const burger: string[] = [];

      constructorItems.ingredients.forEach((ele) => {
        burger.push(ele._id);
      });

      burger.push(constructorItems.bun._id);
      burger.push(constructorItems.bun._id);

      dispatch(createOrder(burger));
    }
  };

  const closeOrderModals = () => {
    dispatch(clearConstructor(orderModalData));
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      locationState={location}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModals}
    />
  );
};
