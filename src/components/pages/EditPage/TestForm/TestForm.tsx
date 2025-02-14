import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question } from 'src/types/testsTypes';
import { useAppDispatch, useAppSelector } from '@hooks/hook';
import { useTestQuestions } from '@hooks/useTestQuestions';
import {
  getTestRequest,
  addTestRequest,
  editTestRequest,
} from '@models/testsSlice';
import QuestionList from './QuestionList';
import EditQuestions from './EditQuestions';
import Modal from '@commons/Modal';
import Loading from '@commons/Loading';
import s from './TestForm.module.scss';

interface TestFormProps {
  testId?: string;
  initialTestTitle?: string;
  setInitialTestTitle?: SetState<string>;
}

const TestForm = ({
  testId,
  initialTestTitle,
  setInitialTestTitle,
}: TestFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    addQuestion,
    validateTest,
    addKeysForQuestionsAndAnswers,
    questionStructure,
  } = useTestQuestions();

  const { test, loading } = useAppSelector(state => state.tests);
  const [newTestTitle, setNewTestTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      key: uuidv4(),
      title: '',
      question_type: 'single',
      answer: null,
      answers: [
        { key: uuidv4(), text: '', is_right: false },
        { key: uuidv4(), text: '', is_right: false },
      ],
    },
  ]);
  const [newQuestionsOfEdit, setNewQuestionsOfEdit] = useState<Question[]>([]);
  const currentQuestions = !testId ? questions : newQuestionsOfEdit;
  const [initialQuestions, setInitialQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'error' | 'confirm' | null>(null);
  const [errorsOfValidate, setErrorsOfValidate] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (testId) {
      dispatch(getTestRequest(testId));
    }
  }, [dispatch, testId]);

  useEffect(() => {
    if (testId && test && setInitialTestTitle) {
      setNewTestTitle(test.title || '');
      setInitialTestTitle(test.title);

      if (test.questions) {
        const updatedQuestions = addKeysForQuestionsAndAnswers(test);
        setQuestions(updatedQuestions);
        setInitialQuestions(updatedQuestions || []);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, testId]);

  const handleAddQuestion = () => {
    if (!testId) {
      addQuestion(setQuestions);
    } else {
      addQuestion(setNewQuestionsOfEdit);
    }
  };

  const validateForm = () => {
    validateTest(
      errorsOfValidate,
      setErrorsOfValidate,
      newTestTitle,
      questions,
      newQuestionsOfEdit,
    );

    if (errorsOfValidate.size) {
      handleShowModal();
      return false;
    }

    return true;
  };

  const handleResetErrors = useCallback(() => {
    setTimeout(() => {
      setErrorsOfValidate(new Set());
    }, 250);
  }, []);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const action =
      testId && initialTestTitle
        ? editTestRequest({
            initialTestTitle,
            initialQuestions,
            newTestTitle,
            testId,
            questions: [...questions, ...newQuestionsOfEdit],
          })
        : addTestRequest({
            newTestTitle,
            questions: questions.map(({ key, ...question }) => ({
              ...question,
              ...(question.question_type !== 'number' && {
                answers: question.answers.map(({ key, ...answer }) => answer),
              }),
            })),
          });

    dispatch(action);

    if (!testId) {
      setNewTestTitle('');
      setQuestions([questionStructure]);
    } else {
      setNewQuestionsOfEdit([]);
    }

    navigate('/tests');
  };

  const handleShowModal = () => {
    setModalType('error');
    setShowModal(true);
  };

  const handleConfirmSave = () => {
    if (!validateForm()) {
      return;
    }
    setModalType('confirm');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalType(null);
    }, 300);
  };

  const handleConfirmOrCloseModal = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (modalType === 'error') {
      handleCloseModal();
      handleResetErrors();
    } else if (modalType === 'confirm') {
      handleCloseModal();
      handleSave(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <form className={s.addQuestion}>
      <label htmlFor="test_title" className={s.label}>
        Название теста:
      </label>
      <input
        id="test_title"
        type="text"
        className={s.input}
        placeholder="Введите название теста"
        value={newTestTitle}
        onChange={e => setNewTestTitle(e.target.value)}
      />

      {testId && (
        <QuestionList questions={questions} setQuestions={setQuestions} />
      )}

      <EditQuestions
        testId={testId}
        setQuestions={setQuestions}
        setNewQuestionsOfEdit={setNewQuestionsOfEdit}
        currentQuestions={currentQuestions}
      />

      <Modal
        title={modalType === 'error' ? 'Ошибка!' : 'Подтверждение'}
        isOpen={showModal}
        setIsModalOpen={setShowModal}
        onCloseCallback={handleResetErrors}
      >
        {modalType === 'error' ? (
          <ul className={s.errors}>
            {[...errorsOfValidate].map((error, index) => (
              <li key={index} className={s.error}>
                *{error}
              </li>
            ))}
          </ul>
        ) : (
          <div className={s.confirmation}>
            <p className={s.saveText}>
              Вы уверены, что хотите сохранить изменения?
            </p>
          </div>
        )}
        <div className={s.btnsWrap}>
          <button
            type="button"
            onClick={handleConfirmOrCloseModal}
            className={clsx(s.saveTest, s.btn)}
          >
            {modalType === 'error' ? 'OK' : 'Сохранить'}
          </button>
          {modalType === 'confirm' && (
            <button
              type="button"
              onClick={handleCloseModal}
              className={clsx(s.saveTest, s.btn)}
            >
              Отмена
            </button>
          )}
        </div>
      </Modal>

      <button
        type="button"
        className={s.addQuestionBtn}
        onClick={handleAddQuestion}
      >
        +
      </button>
      <button type="button" className={s.saveTest} onClick={handleConfirmSave}>
        Сохранить тест
      </button>
    </form>
  );
};

export default memo(TestForm);
