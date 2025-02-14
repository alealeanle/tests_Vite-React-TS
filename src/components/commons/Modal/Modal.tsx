import { memo, ReactNode, useEffect } from 'react';
import useEscapeKey from '@hooks/useEscapeKey';
import ModalFade from './ModalFade';
import s from './Modal.module.scss';

interface ModalProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  setIsModalOpen: SetState<boolean>;
  onCloseCallback?: () => void;
}

const Modal = ({
  title,
  children,
  isOpen,
  setIsModalOpen,
  onCloseCallback,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modalOpen');
    } else {
      document.body.classList.remove('modalOpen');
    }

    return () => {
      document.body.classList.remove('modalOpen');
    };
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onCloseCallback) {
      onCloseCallback();
    }
  };

  useEscapeKey(handleCloseModal);

  const contentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <ModalFade isOpen={isOpen}>
      <div className={s.modal} onClick={handleCloseModal}>
        <div className={s.paddingForScrollBar}>
          <div className={s.modalContent} onClick={contentClick}>
            <div className={s.header}>
              <h2 className={s.title}>{title}</h2>
              <button
                type="button"
                className={s.close}
                onClick={handleCloseModal}
              >
                ⨉
              </button>
            </div>
            <div className={s.children}>{children}</div>
          </div>
        </div>
      </div>
    </ModalFade>
  );
};

export default memo(Modal);
