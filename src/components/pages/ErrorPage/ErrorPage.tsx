import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import s from './ErrorPage.module.scss';

const ErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.error(error.statusText || 'Unknown error');

    return (
      <div className={s.root}>
        <h1 className={s.title}>Oops!</h1>
        <p className={s.text}>Sorry, an unexpected error has occurred.</p>
        <p className={s.text}>
          <i className={s.error}>{error.statusText || 'Unknown error'}</i>
        </p>
      </div>
    );
  }
};

export default ErrorPage;
