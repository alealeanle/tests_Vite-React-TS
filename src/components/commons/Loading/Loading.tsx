import s from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={s.loaderOverlay}>
      <div className={s.spinner}></div>
    </div>
  );
};

export default Loading;
