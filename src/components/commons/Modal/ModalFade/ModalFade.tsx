import { memo, ReactElement, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import s from './ModalFade.module.scss';

interface ModalFadeProps {
  children: ReactElement;
  isOpen: boolean;
}

const ModalFade = ({ children, isOpen }: ModalFadeProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={isOpen}
      timeout={400}
      classNames={{
        enter: s['fade-enter'],
        enterActive: s['fade-enter-active'],
        exit: s['fade-exit'],
        exitActive: s['fade-exit-active'],
      }}
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div className={s.wrap} ref={nodeRef}>
        {children}
      </div>
    </CSSTransition>
  );
};

export default memo(ModalFade);
