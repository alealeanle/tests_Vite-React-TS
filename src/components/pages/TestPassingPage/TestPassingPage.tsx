import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Question } from 'src/types/testsTypes';
import { useAppDispatch, useAppSelector } from '@hooks/hook';
import { getTestRequest } from '@models/testsSlice';
import QuestionComponent from './QuestionComponent';
import Header from '@commons/Header';
import Footer from '@commons/Footer';
import Modal from '@commons/Modal';
import Loading from '@commons/Loading';
import s from './TestPassingPage.module.scss';

type AnswersState = Record<number, number | number[] | string>;

const TestPassingPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { test, loading } = useAppSelector(state => state.tests);

  const [answers, setAnswers] = useState<AnswersState>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    if (testId) {
      dispatch(getTestRequest(testId));
    }
  }, [dispatch, testId]);

  const handleAnswerChange = (
    questionId: number,
    value: number | number[] | string,
  ) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleNextQuestion = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    if (!test) return;
    let rightAnswers = 0;

    test.questions.forEach((question: Question) => {
      switch (question.question_type) {
        case 'single': {
          const rightOption = question.answers.find(answer => answer.is_right);
          if (rightOption && rightOption.id === answers[question.id!]) {
            rightAnswers++;
          }
          break;
        }

        case 'multiple': {
          const rightOptions = question.answers
            .filter(answer => answer.is_right)
            .map(answer => answer.id);
          const userAnswer = answers[question.id!];
          if (
            Array.isArray(userAnswer) &&
            rightOptions.length === userAnswer.length &&
            rightOptions.every(id => id && userAnswer.includes(id))
          ) {
            rightAnswers++;
          }
          break;
        }

        case 'number': {
          if (question.answer === Number(answers[question.id!])) {
            rightAnswers++;
          }
          break;
        }
      }
    });

    setResult(rightAnswers);
    setShowModal(true);
  };

  const handleReturnToTests = () => {
    navigate('/tests');
  };

  const currentQuestion = test?.questions?.[currentQuestionIndex];

  return loading ? (
    <Loading />
  ) : (
    <div className={clsx(s.root, s._container)}>
      <Header />
      {test?.questions ? (
        <div className={s.body}>
          <h1 className={s.title}>{test.title}</h1>
          {currentQuestion ? (
            <>
              <QuestionComponent
                question={currentQuestion}
                answers={answers[currentQuestion.id!] || []}
                onAnswerChange={value =>
                  handleAnswerChange(currentQuestion.id!, value)
                }
              />
              <div className={s.btnWrap}>
                <button onClick={handleNextQuestion} className={s.btn}>
                  {currentQuestionIndex < test.questions.length - 1
                    ? 'Следующий вопрос'
                    : 'Закончить тест'}
                </button>
              </div>
            </>
          ) : (
            <div>Вопросы отсутствуют.</div>
          )}
          <Modal
            title="Результат"
            isOpen={showModal}
            setIsModalOpen={setShowModal}
          >
            <p className={s.resultText}>
              Количество правильных ответов:{' '}
              <span className={s.quantity}>
                {result} из {test.questions.length}
              </span>
            </p>
            <button
              type="button"
              className={clsx(s.btn, s.returnBtn)}
              onClick={handleReturnToTests}
            >
              Вернуться к списку тестов
            </button>
          </Modal>
        </div>
      ) : (
        <div>Загрузка теста...</div>
      )}
      <Footer />
    </div>
  );
};

export default TestPassingPage;
