import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@hooks/hook';
import { logoutRequest } from '@models/authSlice';
import s from './Header.module.scss';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <header className={s.header}>
      {isAuthenticated && (
        <button className={clsx(s.btn, s.logout)} onClick={handleLogout}>
          Выйти
        </button>
      )}
    </header>
  );
};

export default Header;
