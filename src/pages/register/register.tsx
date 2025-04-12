import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearError,
  registerUser,
  selectAuthError,
  selectAuthLoading
} from '../../components/slices/userProfileSlice';
import { Preloader } from '@ui';
import { TRegisterData } from '@api';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    const data: TRegisterData = {
      email: email,
      name: userName,
      password: password
    };
    dispatch(registerUser(data));
    e.preventDefault();
  };

  if (loading) return <Preloader />;

  return (
    <RegisterUI
      errorText={error}
      clearError={() => dispatch(clearError())}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
