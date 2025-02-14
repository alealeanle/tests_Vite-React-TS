import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { Question } from 'src/types/testsTypes';
import { useTestQuestions } from '@hooks/useTestQuestions';
import QuestionComponentOfList from './QuestionComponentOfList';
import Modal from '@commons/Modal';
import s from './QuestionList.module.scss';

interface QuestionListProps {
  questions: Question[];
  setQuestions: SetState<Question[]>;
}

const QuestionList = ({ questions, setQuestions }: QuestionListProps) => {
  const { removeQuestion } = useTestQuestions();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  const resetSelected = useCallback(() => {
    setTimeout(() => {
      setSelectedQuestion(null);
    }, 200);
  }, []);

  const handleRemoveQuestion = () => {
    if (!selectedQuestion) return;
    if (selectedQuestion.key) {
      removeQuestion(setQuestions, selectedQuestion.key);
    }
    setShowDeleteModal(false);
    resetSelected();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    resetSelected();
  };

  return (
    <ul className={s.questionList}>
      {questions.map(question => (
        <QuestionComponentOfList
          key={question.key}
          question={question}
          setQuestions={setQuestions}
          setShowDeleteModal={setShowDeleteModal}
          setSelectedQuestion={setSelectedQuestion}
        />
      ))}

      <Modal
        title="Подтверждение действия"
        isOpen={showDeleteModal}
        setIsModalOpen={setShowDeleteModal}
        onCloseCallback={resetSelected}
      >
        <div className={s.modalDeleteText}>
          Удалить тест "{selectedQuestion?.title}" ?
        </div>
        <div className={s.modalBtnsWrap}>
          <button
            type="button"
            className={clsx(s.btn, s.modalDeleteBtn)}
            onClick={handleRemoveQuestion}
          >
            Удалить
          </button>
          <button type="button" className={s.btn} onClick={handleCancelDelete}>
            Отмена
          </button>
        </div>
      </Modal>
    </ul>
  );
};

export default QuestionList;
