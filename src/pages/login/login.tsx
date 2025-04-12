import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import {
  clearError,
  loginUser,
  selectAuthError,
  selectAuthLoading
} from '../../components/slices/userProfileSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({
        email: email,
        password: password
      })
    );
  };

  if (loading) return <Preloader />;

  return (
    <LoginUI
      errorText={error}
      clearError={() => dispatch(clearError())}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
