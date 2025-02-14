import clsx from 'clsx';
import { memo, ReactElement } from 'react';
import { Question } from 'src/types/testsTypes';
import { useTestQuestions } from '@hooks/useTestQuestions';
import Dropdown from '@commons/Dropdown';
import s from './EditQuestionForm.module.scss';

interface EditQuestionFormProps {
  testId?: string;
  question: Question;
  setQuestions: SetState<Question[]>;
  setNewQuestionsOfEdit?: SetState<Question[]>;
  children: ReactElement;
}

const handlePlaceholder = (
  options: { value: string; label: string }[],
  currentValue: string,
) => {
  const foundOption = options.find(opt => opt.value === currentValue);
  return foundOption ? foundOption.label : 'Выберите значение';
};

const questionTypes = [
  { value: 'single', label: 'Один из списка' },
  { value: 'multiple', label: 'Несколько из списка' },
  { value: 'number', label: 'Численный ответ' },
];

const EditQuestionForm = ({
  testId,
  question,
  setQuestions,
  setNewQuestionsOfEdit,
  children,
}: EditQuestionFormProps) => {
  const { questionChange } = useTestQuestions();

  const handleFieldChange = (field: keyof Question, value: string) => {
    if (question.key) {
      if (testId && setNewQuestionsOfEdit) {
        questionChange(setNewQuestionsOfEdit, question.key, field, value);
      } else {
        questionChange(setQuestions, question.key, field, value);
      }
    }
  };

  return (
    <div className={s.root}>
      <div className={s.itemWrap}>
        <h3 className={s.itemTitle}>Вопрос:</h3>
        <textarea
          className={clsx(s.input, s.question)}
          placeholder="Введите текст вопроса"
          value={question.title}
          onChange={e => handleFieldChange('title', e.target.value)}
        />
      </div>
      <div className={s.itemWrap}>
        <h3 className={s.itemTitle}>Тип вопроса:</h3>
        <Dropdown
          options={questionTypes}
          placeholder={handlePlaceholder(questionTypes, question.question_type)}
          onChange={option => handleFieldChange('question_type', option.value)}
        />
      </div>
      <div className={s.itemWrap}>
        <h3 className={s.itemTitle}>
          {question.question_type === 'number' ? 'Ответ:' : 'Ответы:'}
        </h3>
        {children}
      </div>
    </div>
  );
};

export default memo(EditQuestionForm);
