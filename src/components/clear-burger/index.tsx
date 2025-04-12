import { FC } from 'react';
import { useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { ClearBurgerUI } from '../ui/clear-burger';
import { clearConstructor } from '../slices/burgerConstructorSlice/tindex';

export const ClearBurger: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleConfirm = () => {
    dispatch(clearConstructor(true));
    navigate(-1);
  };

  return <ClearBurgerUI onConfirm={handleConfirm} onCancel={handleCancel} />;
};
