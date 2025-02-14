import { ReactElement, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/hook';
import { fetchUserRequest } from '@models/authSlice';
import Loading from '@commons/Loading';

interface IsAuthenticatedRouteProps {
  children: ReactElement;
}

const IsAuthenticatedRoute = ({ children }: IsAuthenticatedRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchUserRequest());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/tests" replace />;
  }

  return children;
};

export default IsAuthenticatedRoute;
