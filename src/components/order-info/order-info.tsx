import { FC, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectAllIngredients } from '../slices/ingredientsSlice';
import { fetchOrderNumber, selectAllOrders } from '../slices/feedSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '../slices/userProfileSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderAll = useSelector(selectAllOrders);
  const orderUser = useSelector(selectUserOrders);
  const dispatch = useDispatch();
  const orderNumber = useParams();
  const [orderData, setOrderData] = useState({
    createdAt: '',
    ingredients: [''],
    _id: '',
    status: '',
    name: '',
    updatedAt: '',
    number: 0
  });

  if (!orderData?.number) {
    orderAll.forEach((ele) => {
      if (ele.number === Number(orderNumber.number)) {
        return setOrderData(ele);
      }
    });

    orderUser.forEach((ele) => {
      if (ele.number === Number(orderNumber.number)) {
        return setOrderData(ele);
      }
    });

    dispatch(fetchOrderNumber(Number(orderNumber.number)))
      .unwrap()
      .then((data) => {
        if (data) {
          setOrderData(data.orders[0]);
        }
      });
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
