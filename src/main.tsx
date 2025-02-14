import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import IsAuthenticatedRoute from '@commons/RouteComponents/IsAuthenticatedRoute';
import ProtectedRoute from '@commons/RouteComponents/ProtectedRoute';
import AuthPage from '@pages/AuthPage';
import ErrorPage from '@pages/ErrorPage';
import SuccessRegistrationPage from '@pages/SuccessRegistrationPage';
import TestListPage from '@pages/TestListPage';
import EditPage from '@pages/EditPage';
import TestPassingPage from '@pages/TestPassingPage';
import store from '@redux/store';
import './index.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <IsAuthenticatedRoute>
        <AuthPage />
      </IsAuthenticatedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: (
      <IsAuthenticatedRoute>
        <AuthPage />
      </IsAuthenticatedRoute>
    ),
  },
  {
    path: '/registrationSuccess',
    element: <SuccessRegistrationPage />,
  },
  {
    path: '/tests',
    element: (
      <ProtectedRoute admin={false}>
        <TestListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create_test',
    element: (
      <ProtectedRoute admin={true}>
        <EditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/edit_test/:testId',
    element: (
      <ProtectedRoute admin={true}>
        <EditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/passing_test/:testId',
    element: (
      <ProtectedRoute admin={false}>
        <TestPassingPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
