import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect, useState } from 'react';
import {
  selectIngredientsError,
  selectIngredientsLoading
} from '../../components/slices/ingredientsSlice';
import { ErrorBanner } from '../../components/error-banner';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  const [isMounted, setisMounted] = useState(false);

  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    if (error) {
      setisMounted(true);
    }
  }, [error]);

  if (isMounted)
    return (
      <ErrorBanner
        initialMounted
        error={
          'Возникла ошибка соединения с сервером. Пожалуйста, перезагрузите страницу.'
        }
      />
    );

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
