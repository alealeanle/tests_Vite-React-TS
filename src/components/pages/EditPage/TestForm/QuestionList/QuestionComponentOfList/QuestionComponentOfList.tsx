import clsx from 'clsx';
import { memo, useCallback, useState } from 'react';
import { Question } from 'src/types/testsTypes';
import EditQuestionForm from '@TestForm/EditQuestions/EditQuestionForm';
import EditAnswers from '@TestForm/EditAnswers';
import s from './QuestionComponentOfList.module.scss';

interface QustionProps {
  question: Question;
  setQuestions: SetState<Question[]>;
  setShowDeleteModal: SetState<boolean>;
  setSelectedQuestion: SetState<Question | null>;
}

const QuestionComponentOfList = ({
  question,
  setQuestions,
  setShowDeleteModal,
  setSelectedQuestion,
}: QustionProps) => {
  const [editingQuestionKey, setEditingQuestionKey] = useState<string[]>([]);
  const [showAnswersForQuestion, setShowAnswersForQuestion] = useState<
    string[]
  >([]);

  const toggleAnswersVisibility = useCallback((key: string) => {
    setShowAnswersForQuestion(prevState =>
      prevState.includes(key)
        ? prevState.filter(k => k !== key)
        : [...prevState, key],
    );
  }, []);

  const handleEditQuestion = useCallback((question: Question) => {
    setEditingQuestionKey(prevState => [...prevState, question.key ?? '']);
    setShowAnswersForQuestion(prevState => [...prevState, question.key ?? '']);
  }, []);

  const handleDeleteQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  return (
    <li className={s.question}>
      {question.key && !editingQuestionKey.includes(question.key) ? (
        <>
          <div className={s.questionHeader}>
            <button
              type="button"
              className={clsx(s.itemBtn, 'icon-edit')}
              onClick={() => handleEditQuestion(question)}
            />
            <button
              type="button"
              className={clsx(s.itemBtn, 'icon-delete')}
              onClick={() => handleDeleteQuestion(question)}
            />

            <div
              id="questionText"
              className={s.questionTextWrap}
              onClick={() =>
                question.key && toggleAnswersVisibility(question.key)
              }
            >
              <span className={s.questionText}>{question.title}</span>
              <span className={s.showArrow}>
                {showAnswersForQuestion.includes(question.key) ? '▲' : '▼'}
              </span>
            </div>
          </div>
          {showAnswersForQuestion.includes(question.key) && (
            <ol className={s.answers}>
              {question.question_type === 'number' ? (
                <span className={s.answer}>{question.answer}</span>
              ) : (
                question.answers.map(answer => (
                  <li
                    key={answer.key}
                    id={String(answer.id)}
                    className={s.answer}
                  >
                    {answer.text}{' '}
                    {answer.is_right && <span className={s.is_right}>✔</span>}
                  </li>
                ))
              )}
            </ol>
          )}
        </>
      ) : (
        <>
          <EditQuestionForm setQuestions={setQuestions} question={question}>
            <EditAnswers setQuestions={setQuestions} question={question} />
          </EditQuestionForm>
        </>
      )}
    </li>
  );
};

export default memo(QuestionComponentOfList);
