import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { AppRoutes } from '../routes';
import { FC, useEffect } from 'react';
import { fetchIngredients } from '../slices/ingredientsSlice';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../slices/userProfileSlice';

const App: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppRoutes />
    </div>
  );
};

export default App;
