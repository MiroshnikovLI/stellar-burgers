import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';
import {
  selectUser,
  selectAuthChecked
} from '../../../components/slices/userProfileSlice';
import { Preloader } from '@ui';

type IProtectedRouteProfile = {
  onlyUnAuth?: boolean;
  component: JSX.Element;
};

const ProtectedRouteProfile = ({
  onlyUnAuth = false,
  component
}: IProtectedRouteProfile): JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return component;
};

export const OnlyAuth = ProtectedRouteProfile;
export const OnlyUnAuth = ({ component }: { component: JSX.Element }) => (
  <ProtectedRouteProfile onlyUnAuth component={component} />
);
