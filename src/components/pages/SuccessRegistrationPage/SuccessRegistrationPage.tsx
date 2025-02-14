import { Link } from 'react-router-dom';
import { useAppDispatch } from '@hooks/hook';
import { registerEnd } from '@models/authSlice';
import s from './SuccessRegistrationPage.module.scss';

const SuccessRegistrationPage = () => {
  const dispatch = useAppDispatch();
  const handleBtn = () => dispatch(registerEnd());

  return (
    <div className={s.root}>
      <h2 className={s.title}>Успешная регистрация!</h2>
      <Link to={'/'} onClick={handleBtn}>
        <button className={s.signIn}>Войти</button>
      </Link>
    </div>
  );
};

export default SuccessRegistrationPage;
