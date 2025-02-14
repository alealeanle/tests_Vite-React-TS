import clsx from 'clsx';
import { Reorder } from 'framer-motion';
import { memo, useCallback, useState } from 'react';
import { Answer, Question } from 'src/types/testsTypes';
import { useTestQuestions } from '@hooks/useTestQuestions';
import Modal from '@commons/Modal';
import s from './EditAnswers.module.scss';

interface EditAnswersProps {
  testId?: string;
  question: Question;
  setQuestions: SetState<Question[]>;
  setNewQuestionsOfEdit?: SetState<Question[]>;
}

const EditAnswers = ({
  testId,
  question,
  setQuestions,
  setNewQuestionsOfEdit,
}: EditAnswersProps) => {
  const {
    removeQuestion,
    questionChange,
    addAnswer,
    removeAnswer,
    answerChange,
  } = useTestQuestions();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletedItem, setDeletedItem] = useState<Question | Answer | null>(
    null,
  );
  const [deleteType, setDeleteType] = useState<'question' | 'answer' | null>(
    null,
  );

  const handleQuestionChange = (field: keyof Question, value: string) => {
    if (question.key) {
      if (testId && setNewQuestionsOfEdit) {
        questionChange(setNewQuestionsOfEdit, question.key, field, value);
      } else {
        questionChange(setQuestions, question.key, field, value);
      }
    }
  };

  const handleRemoveQuestion = () => {
    if (question.key) {
      if (testId && setNewQuestionsOfEdit) {
        removeQuestion(setNewQuestionsOfEdit, question.key);
      } else {
        removeQuestion(setQuestions, question.key);
      }
    }

    setShowDeleteModal(false);
    resetDeleteStates();
  };

  const handleAnswerChange = (
    answer: Answer,
    field: keyof Answer,
    value: string | boolean,
  ) => {
    if (question.key && answer.key) {
      if (testId && setNewQuestionsOfEdit) {
        answerChange(
          setNewQuestionsOfEdit,
          question.key,
          answer.key,
          field,
          value,
        );
      } else {
        answerChange(setQuestions, question.key, answer.key, field, value);
      }
    }
  };

  const handleAddAnswer = () => {
    if (question.key) {
      if (testId && setNewQuestionsOfEdit) {
        addAnswer(setNewQuestionsOfEdit, question.key);
      } else {
        addAnswer(setQuestions, question.key);
      }
    }
  };

  const handleRemoveAnswer = () => {
    if (question.key && deletedItem && deletedItem.key) {
      if (testId && setNewQuestionsOfEdit) {
        removeAnswer(setNewQuestionsOfEdit, question.key, deletedItem.key);
      } else {
        removeAnswer(setQuestions, question.key, deletedItem.key);
      }
    }
    setShowDeleteModal(false);
    resetDeleteStates();
  };

  const resetDeleteStates = useCallback(() => {
    setTimeout(() => {
      setDeleteType(null);
      setDeletedItem(null);
    }, 300);
  }, []);

  if (question.question_type === 'number') {
    return (
      <div className={s.footer}>
        <input
          type="text"
          className={s.input}
          placeholder="Введите числовой ответ"
          value={question.answer ?? ''}
          onChange={e =>
            handleQuestionChange(
              'answer',
              e.target.value.replace(/[^0-9.-]/g, ''),
            )
          }
        />
        <button
          type="button"
          className={clsx(s.footerBtn, s.deleteQuestionBtn)}
          onClick={() => {
            setDeletedItem(question);
            setDeleteType('question');
            setShowDeleteModal(true);
          }}
        >
          Удалить вопрос
        </button>

        <Modal
          title="Подтверждение действия"
          isOpen={showDeleteModal}
          setIsModalOpen={setShowDeleteModal}
          onCloseCallback={resetDeleteStates}
        >
          <div className={s.modalDeleteText}>
            Удалить вопрос{' '}
            {`${deletedItem && 'title' in deletedItem && `'${deletedItem.title}'`}`}{' '}
            ?
          </div>
          <div className={s.modalBtnsWrap}>
            <button
              type="button"
              className={clsx(s.btn, s.modalDeleteBtn)}
              onClick={handleRemoveQuestion}
            >
              Удалить
            </button>
            <button
              type="button"
              className={s.btn}
              onClick={() => {
                setShowDeleteModal(false);
                resetDeleteStates();
              }}
            >
              Отмена
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  const setReorderAnswers = (newOrder: Answer[]) => {
    const setFunc =
      testId && setNewQuestionsOfEdit ? setNewQuestionsOfEdit : setQuestions;
    setFunc(prevQuestions =>
      prevQuestions.map(q =>
        q.key === question.key ? { ...q, answers: newOrder } : q,
      ),
    );
  };

  return (
    <>
      <Reorder.Group
        axys="y"
        values={question.answers}
        onReorder={setReorderAnswers}
        className={s.root}
      >
        {question.answers.map(answer => (
          <Reorder.Item
            value={answer}
            key={answer.key}
            className={s.answer}
            layout
            dragConstraints={{ top: 0, bottom: 0 }}
          >
            <button
              type="button"
              className={clsx('icon-delete', s.deleteBtn)}
              onClick={() => {
                setDeletedItem(answer);
                setDeleteType('answer');
                setShowDeleteModal(true);
              }}
            />
            <input
              type="text"
              className={s.input}
              placeholder="Введите текст ответа"
              value={answer.text}
              onChange={e => handleAnswerChange(answer, 'text', e.target.value)}
            />
            <div className={s.isRightWrap}>
              <input
                type={
                  question.question_type === 'single' ? 'radio' : 'checkbox'
                }
                className={clsx({
                  [s.radiobutton]: question.question_type === 'single',
                  [s.checkbox]: question.question_type === 'multiple',
                })}
                checked={answer.is_right}
                onChange={e =>
                  handleAnswerChange(answer, 'is_right', e.target.checked)
                }
              />
              <label
                className={clsx({
                  [s.isRight]: question.question_type === 'single',
                  [s.checkboxCheckMark]: question.question_type === 'multiple',
                })}
              />
              {question.question_type === 'multiple' && (
                <label className={s.checkboxFrame} />
              )}
            </div>
          </Reorder.Item>
        ))}

        <Modal
          title="Подтверждение действия"
          isOpen={showDeleteModal}
          setIsModalOpen={setShowDeleteModal}
          onCloseCallback={resetDeleteStates}
        >
          <div className={s.modalDeleteText}>
            {deleteType === 'question'
              ? `Удалить вопрос ${deletedItem && 'title' in deletedItem && `'${deletedItem.title}'`}?`
              : `Удалить ответ ${deletedItem && 'text' in deletedItem && `'${deletedItem.text}'`}?`}
          </div>
          <div className={s.modalBtnsWrap}>
            <button
              type="button"
              className={clsx(s.btn, s.modalDeleteBtn)}
              onClick={
                deleteType === 'question'
                  ? handleRemoveQuestion
                  : deleteType === 'answer'
                    ? handleRemoveAnswer
                    : undefined
              }
            >
              Удалить
            </button>
            <button
              type="button"
              className={s.btn}
              onClick={() => {
                setShowDeleteModal(false);
                resetDeleteStates();
              }}
            >
              Отмена
            </button>
          </div>
        </Modal>
      </Reorder.Group>
      <div className={s.footer}>
        <button
          type="button"
          className={clsx(s.footerBtn, s.addAnswerBtn)}
          onClick={handleAddAnswer}
        >
          Добавить ответ
        </button>
        <button
          type="button"
          className={clsx(s.footerBtn, s.deleteQuestionBtn)}
          onClick={() => {
            setDeletedItem(question);
            setDeleteType('question');
            setShowDeleteModal(true);
          }}
        >
          Удалить вопрос
        </button>
      </div>
    </>
  );
};

export default memo(EditAnswers);
