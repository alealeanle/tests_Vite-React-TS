import { memo } from 'react';
import { Question } from 'src/types/testsTypes';
import EditQuestionForm from './EditQuestionForm';
import EditAnswers from '../EditAnswers';
import s from './EditQuestions.module.scss';

interface EditQuestionsProps {
  testId?: string;
  setQuestions: SetState<Question[]>;
  setNewQuestionsOfEdit: SetState<Question[]>;
  currentQuestions: Question[];
}

const EditQuestions = ({
  testId,
  setQuestions,
  setNewQuestionsOfEdit,
  currentQuestions,
}: EditQuestionsProps) => {
  return currentQuestions.map(question => (
    <div key={question.key} className={s.questionBlock}>
      <EditQuestionForm
        testId={testId}
        question={question}
        setQuestions={setQuestions}
        setNewQuestionsOfEdit={setNewQuestionsOfEdit}
      >
        <EditAnswers
          testId={testId}
          question={question}
          setQuestions={setQuestions}
          setNewQuestionsOfEdit={setNewQuestionsOfEdit}
        />
      </EditQuestionForm>
    </div>
  ));
};

export default memo(EditQuestions);
