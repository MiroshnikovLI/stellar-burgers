import { Navigate, useLocation } from 'react-router';
import {
  selectUser,
  selectAuthChecked
} from '../../../components/slices/userProfileSlice';
import { Preloader } from '@ui';
import { useSelector } from '../../../services/store';

type IProtectedRouteProfile = {
  onlyUnAuth?: boolean;
  component: React.ReactElement;
};

const ProtectedRouteProfile = ({
  onlyUnAuth = false,
  component
}: IProtectedRouteProfile): React.ReactElement => {
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

  return <>{component}</>;
};

export const OnlyAuth: React.FC<{ children: React.ReactElement }> = ({
  children
}) => <ProtectedRouteProfile component={children} />;
export const OnlyUnAuth: React.FC<{ children: React.ReactElement }> = ({
  children
}) => <ProtectedRouteProfile onlyUnAuth component={children} />;
