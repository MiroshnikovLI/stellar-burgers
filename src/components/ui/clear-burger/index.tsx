import { Button } from '@zlden/react-developer-burger-ui-components/dist/ui/button';
import { ClearBurgerProps } from './type';
import styles from './clear-burger.module.css';
import { FC } from 'react';

export const ClearBurgerUI: FC<ClearBurgerProps> = ({
  onConfirm,
  onCancel
}) => (
  <div className={styles.container}>
    <Button
      htmlType='button'
      type='primary'
      size='large'
      children='Да '
      onClick={onConfirm}
      extraClass={styles.button}
    />
    <Button
      htmlType='button'
      type='primary'
      size='large'
      children='Нет'
      onClick={onCancel}
      extraClass={styles.button}
    />
  </div>
);
