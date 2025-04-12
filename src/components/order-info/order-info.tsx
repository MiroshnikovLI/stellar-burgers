import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { selectAllIngredients } from '../slices/ingredientsSlice';
import { selectAllOrders, selectUserOrders } from '../slices/feedSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchOrderNumber } from '../slices/orderSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderAll = useSelector(selectAllOrders);

  const orderUser = useSelector(selectUserOrders);

  const dispatch = useDispatch();

  const orderNumber = useParams();

  let orderData = {
    createdAt: '',
    ingredients: [''],
    _id: '',
    status: '',
    name: '',
    updatedAt: '',
    number: 0
  };

  if (orderNumber) {
    orderAll.forEach((ele) => {
      if (ele.number === Number(orderNumber.number)) {
        console.log('click');

        return (orderData = ele);
      }
    });

    orderUser.forEach((ele) => {
      if (ele.number === Number(orderNumber.number)) {
        return (orderData = ele);
      }
    });

    dispatch(fetchOrderNumber(Number(orderNumber.number)));
  }

  const ingredients: TIngredient[] = useSelector(selectAllIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
