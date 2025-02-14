import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';
import { Answer, Question, Test } from 'src/types/testsTypes';

export const useTestQuestions = () => {
  const questionStructure: Question = {
    key: uuidv4(),
    title: '',
    question_type: 'single',
    answer: null,
    answers: [
      { key: uuidv4(), text: '', is_right: false },
      { key: uuidv4(), text: '', is_right: false },
    ],
  };

  const addQuestion = (setQuestions: SetState<Question[]>) => {
    setQuestions(prevQuestions => [...prevQuestions, questionStructure]);
  };

  const removeQuestion = (setQuestions: SetState<Question[]>, key: string) => {
    setQuestions(prevQuestions =>
      prevQuestions.filter(question => question.key !== key),
    );
  };

  const questionChange = (
    setQuestions: SetState<Question[]>,
    key: string,
    field: keyof Question,
    value: string,
  ) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.key === key
          ? {
              ...question,
              [field]: value,
              ...(field === 'question_type'
                ? question.answers.length !== 0
                  ? {
                      answers: question.answers.map(answer => ({
                        ...answer,
                        is_right: false,
                      })),
                    }
                  : {
                      answers: [
                        { key: uuidv4(), text: '', is_right: false },
                        { key: uuidv4(), text: '', is_right: false },
                      ],
                    }
                : {}),
            }
          : question,
      ),
    );
  };

  const addAnswer = (
    setQuestions: SetState<Question[]>,
    questionKey: string,
  ) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.key === questionKey
          ? {
              ...question,
              answers: [
                ...question.answers,
                { key: uuidv4(), text: '', is_right: false },
              ],
            }
          : question,
      ),
    );
  };

  const removeAnswer = (
    setQuestions: SetState<Question[]>,
    questionKey: string,
    answerKey: string,
  ) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.key === questionKey
          ? {
              ...question,
              answers: question.answers.filter(
                answer => answer.key !== answerKey,
              ),
            }
          : question,
      ),
    );
  };

  const answerChange = (
    setQuestions: SetState<Question[]>,
    questionKey: string,
    answerKey: string,
    field: keyof Answer,
    value: string | boolean,
  ) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(question =>
        question.key === questionKey
          ? {
              ...question,
              ...(question.question_type === 'number'
                ? { answer: Number(value) }
                : {
                    answers: question.answers.map(answer => {
                      if (
                        field === 'is_right' &&
                        question.question_type === 'single'
                      ) {
                        return {
                          ...answer,
                          is_right: answer.key === answerKey ? true : false,
                        };
                      }
                      return answer.key === answerKey
                        ? { ...answer, [field]: value }
                        : answer;
                    }),
                  }),
            }
          : question,
      ),
    );
  };

  const validateTest = (
    errorsOfValidate: Set<string>,
    setErrorsOfValidate: SetState<Set<string>>,
    newTestTitle: string,
    questions: Question[],
    newQuestionsOfEdit: Question[],
  ) => {
    if (!newTestTitle.trim()) {
      setErrorsOfValidate(errorsOfValidate.add('Введите название теста'));
    }

    const allQuestions = [...questions, ...newQuestionsOfEdit];

    if (!allQuestions.length) {
      setErrorsOfValidate(
        errorsOfValidate.add(
          'Для создания теста необходим хотя бы один вопрос',
        ),
      );
    }

    for (const question of allQuestions) {
      if (!question.title.trim()) {
        setErrorsOfValidate(
          errorsOfValidate.add(
            'Каждое поле для текста вопроса должно быть заполнено',
          ),
        );
      }

      if (question.question_type !== 'number') {
        const filledAnswers = question.answers.filter(answer =>
          answer.text.trim(),
        );

        if (filledAnswers.length < 2) {
          setErrorsOfValidate(
            errorsOfValidate.add(
              'Для текстовых вопросов требуется минимум 2 ответа у каждого вопроса',
            ),
          );
        }

        for (const answer of question.answers) {
          if (!answer.text.trim()) {
            setErrorsOfValidate(
              errorsOfValidate.add('Все ответы должны быть заполнены'),
            );
          }
        }

        const correctAnswers = filledAnswers.filter(answer => answer.is_right);
        if (
          question.question_type === 'single' &&
          correctAnswers.length !== 1
        ) {
          setErrorsOfValidate(
            errorsOfValidate.add(
              'Для вопросов с одним правильным ответом требуется указать ровно 1 правильный ответ',
            ),
          );
        }

        if (
          question.question_type === 'multiple' &&
          correctAnswers.length === 0
        ) {
          setErrorsOfValidate(
            errorsOfValidate.add(
              'Для вопросов с несколькими правильными ответами нужно указать хотя бы 1 правильный ответ',
            ),
          );
        }
      } else if (
        question.answer === undefined ||
        question.answer === null ||
        isNaN(Number(question.answer))
      ) {
        setErrorsOfValidate(
          errorsOfValidate.add(
            'Для вопросов с числовым ответом должен быть указан числовой ответ',
          ),
        );
      }
    }
  };

  const addKeysForQuestionsAndAnswers = useCallback((test: Test) => {
    return test.questions.map(question => ({
      ...question,
      key: uuidv4(),
      answers:
        question.question_type !== 'number'
          ? question.answers.map(answer => ({ ...answer, key: uuidv4() }))
          : [],
    }));
  }, []);

  return {
    addQuestion,
    removeQuestion,
    questionChange,
    addAnswer,
    removeAnswer,
    answerChange,
    validateTest,
    addKeysForQuestionsAndAnswers,
    questionStructure,
  };
};
