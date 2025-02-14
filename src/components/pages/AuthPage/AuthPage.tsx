import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@hooks/hook';
import { loginRequest, registerRequest } from '@models/authSlice';
import s from './AuthPage.module.scss';

interface FormData {
  username: string;
  password: string;
  password_confirmation: string;
  is_admin: boolean;
}

interface Errors {
  username?: string;
  password?: string;
  password_confirmation?: string;
}

const AuthPage = () => {
  const dispatch = useAppDispatch();
  const { registrationSuccess } = useAppSelector(state => state.auth);
  const location = useLocation();
  const isRegisterPage = location.pathname === '/signup';
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    password_confirmation: '',
    is_admin: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'show_pass' || name === 'is_admin' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    const { username, password, password_confirmation } = formData;
    if (!username) newErrors.username = 'Необходимо указать логин';
    if (!password) {
      newErrors.password = 'Необходимо указать пароль';
    } else if (password.length < 8) {
      newErrors.password = 'Пароль должен быть не менее 8 символов';
    }
    if (isRegisterPage && !password_confirmation) {
      newErrors.password_confirmation = 'Необходимо подтвердить пароль';
    } else if (isRegisterPage && password !== password_confirmation) {
      newErrors.password_confirmation = 'Пароли не совпадают';
    }
    return newErrors;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const { password_confirmation, is_admin, ...dataToSend } = formData;

    dispatch(
      isRegisterPage ? registerRequest(formData) : loginRequest(dataToSend),
    );
  };

  const toggleForm = () => navigate(isRegisterPage ? '/' : '/signup');

  useEffect(() => {
    setErrors({});
    setFormData({
      username: '',
      password: '',
      password_confirmation: '',
      is_admin: false,
    });
  }, [isRegisterPage]);

  useEffect(() => {
    if (registrationSuccess) navigate('/registrationSuccess');
  }, [registrationSuccess]);

  return (
    <div className={clsx(s.root, s._container)}>
      <button
        className={clsx(s.authBtn, {
          [s.signIn]: isRegisterPage,
          [s.signUp]: !isRegisterPage,
        })}
        onClick={toggleForm}
      >
        {isRegisterPage ? 'signIn' : 'signUp'}
      </button>
      <form
        className={clsx(s.form, { [s.signUpForm]: isRegisterPage })}
        onSubmit={handleSubmit}
      >
        {['username', 'password'].map(field => (
          <div key={field} className={s.inputWrap}>
            <input
              type={
                field.includes('password') && !showPassword
                  ? 'password'
                  : 'text'
              }
              name={field}
              placeholder={field === 'username' ? 'Логин' : 'Пароль'}
              value={
                field === 'username' ? formData.username : formData.password
              }
              onChange={handleChange}
              className={s.input}
            />
            <div className={s.errorWrap}>
              {errors[field as keyof Errors] && (
                <div className={s.inputError}>
                  {errors[field as keyof Errors]}
                </div>
              )}
            </div>
          </div>
        ))}
        {isRegisterPage && (
          <>
            <div className={s.inputWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password_confirmation"
                placeholder="Подтверждение пароля"
                className={s.input}
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              <div className={s.errorWrap}>
                {errors.password_confirmation && (
                  <div className={s.inputError}>
                    {errors.password_confirmation}
                  </div>
                )}
              </div>
            </div>
            <div className={s.rowWrap}>
              <div className={s.checkboxWrap}>
                <input
                  name="is_admin"
                  id="is_admin"
                  className={s.checkbox}
                  onChange={handleChange}
                  checked={formData.is_admin}
                  type="checkbox"
                />
                <label htmlFor="is_admin" className={s.checkboxCheckMark} />
                <label htmlFor="is_admin" className={s.checkboxFrame} />
              </div>
              <label htmlFor="is_admin" className={s.label}>
                Администратор
              </label>
            </div>
          </>
        )}
        <div className={s.rowWrap}>
          <div className={s.checkboxWrap}>
            <input
              name="show_pass"
              id="show_pass"
              className={s.checkbox}
              onChange={() => setShowPassword(prev => !prev)}
              checked={showPassword}
              type="checkbox"
            />
            <label htmlFor="show_pass" className={s.checkboxCheckMark}></label>
            <label htmlFor="show_pass" className={s.checkboxFrame}></label>
          </div>
          <label htmlFor="show_pass" className={s.label}>
            Показать пароль
          </label>
        </div>
        <button type="submit" className={s.submitButton}>
          {isRegisterPage ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
