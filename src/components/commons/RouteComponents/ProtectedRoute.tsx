import { Navigate } from 'react-router-dom';
import { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/hook';
import { fetchUserRequest } from '@models/authSlice';
import Loading from '@commons/Loading';

interface ProtectedRouteProps {
  children: ReactElement;
  admin: boolean;
}

const ProtectedRoute = ({ children, admin }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAdmin, loading } = useAppSelector(
    state => state.auth,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchUserRequest());
    }
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (admin && !isAdmin) {
    return <Navigate to={'/tests'} replace />;
  }

  return children;
};

export default ProtectedRoute;
