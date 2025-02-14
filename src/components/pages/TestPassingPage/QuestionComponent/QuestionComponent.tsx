import { Question } from 'src/types/testsTypes';
import s from './QuestionComponent.module.scss';

interface QuestionComponentProps {
  question: Question;
  answers: number | number[] | string;
  onAnswerChange: (value: number | number[] | string) => void;
}

const QuestionComponent = ({
  question,
  answers,
  onAnswerChange,
}: QuestionComponentProps) => {
  switch (question.question_type) {
    case 'single':
      return (
        <div className={s.root}>
          <p className={s.questionTitle}>{question.title}</p>
          <div className={s.answersWrap}>
            {question.answers.map(answer => (
              <div key={answer.id} className={s.answer}>
                <div className={s.isRightWrap}>
                  <input
                    type="radio"
                    id={`answer-${answer.id}`}
                    className={s.radio}
                    value={answer.id}
                    checked={answers === answer.id}
                    onChange={() => answer.id && onAnswerChange(answer.id)}
                  />
                  <label className={s.radioLabel} />
                </div>
                <label htmlFor={`answer-${answer.id}`} className={s.answerText}>
                  {answer.text}
                </label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'multiple':
      return (
        <div className={s.root}>
          <p className={s.questionTitle}>{question.title}</p>
          <div className={s.answersWrap}>
            {question.answers.map(answer => (
              <div key={answer.id} className={s.answer}>
                <div className={s.isRightWrap}>
                  <input
                    type="checkbox"
                    id={`answer-${answer.id}`}
                    className={s.checkbox}
                    value={answer.id}
                    checked={
                      Array.isArray(answers) &&
                      answer.id !== undefined &&
                      answers.includes(answer.id)
                    }
                    onChange={e => {
                      if (e.target.checked && answer.id) {
                        onAnswerChange([
                          ...((answers as number[]) || []),
                          answer.id,
                        ]);
                      } else {
                        onAnswerChange(
                          ((answers as number[]) || []).filter(
                            id => id !== answer.id,
                          ),
                        );
                      }
                    }}
                  />
                  <label className={s.checkboxLabel} />
                  <label className={s.checkboxLabel2} />
                </div>
                <label htmlFor={`answer-${answer.id}`} className={s.answerText}>
                  {answer.text}
                </label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'number':
      return (
        <div className={s.root}>
          <p className={s.questionTitle}>{question.title}</p>
          <div className={s.answersWrap}>
            <input
              type="text"
              className={s.input}
              value={
                typeof answers === 'string' || typeof answers === 'number'
                  ? answers
                  : ''
              }
              onChange={e =>
                onAnswerChange(e.target.value.replace(/[^0-9.-]/g, ''))
              }
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default QuestionComponent;
