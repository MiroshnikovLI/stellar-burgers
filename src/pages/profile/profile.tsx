import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  updateUser,
  selectErrorBanner,
  selectAuthLoading,
  selectUser
} from '../../components/slices/userProfileSlice';
import { Preloader } from '@ui';
import { ErrorBanner } from '../../components/error-banner';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const dispatch = useDispatch();

  const error = useSelector(selectErrorBanner);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    const data = formValue;
    dispatch(updateUser(data));
    e.preventDefault();
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) return <Preloader />;

  return (
    <>
      {error && (
        <ErrorBanner
          initialMounted
          error={
            'Возникла ошибка соединения с сервером. Пожалуйста, перезагрузите страницу.'
          }
        />
      )}
      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </>
  );
};
