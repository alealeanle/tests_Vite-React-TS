import { Answer, Question } from 'src/types/testsTypes';
import { call, put } from 'redux-saga/effects';
import {
  addTestSuccess,
  addQuestionSuccess,
  addAnswerSuccess,
  addTestRequest,
} from '@models/testsSlice';
import { getErrorMessage } from '@utils/errorSagaHandler';
import api from '@api/index';

export function* addNewTestSaga(
  action: ReturnType<typeof addTestRequest>,
): Generator {
  try {
    const testResponse = yield call(api.post, '/tests', {
      title: action.payload.newTestTitle,
    });
    const testId = testResponse.data.id;
    yield put(addTestSuccess(testResponse.data));
    return testId;
  } catch (error) {
    console.error(`Ошибка добавления теста: ${getErrorMessage(error)}`);
    throw error;
  }
}

export function* addQuestionSaga(
  testId: string,
  question: Question,
): Generator {
  try {
    const { answers, ...questionData } = question;
    const questionResponse = yield call(
      api.post,
      `/tests/${testId}/questions`,
      questionData,
    );
    const questionId = questionResponse.data.id;
    yield put(addQuestionSuccess({ ...questionResponse.data, testId }));

    if (question.question_type !== 'number') {
      for (const answer of answers) {
        yield call(addAnswerSaga, questionId, answer);
      }
    }
  } catch (error) {
    console.error(`Ошибка добавления вопроса: ${getErrorMessage(error)}`);
    throw error;
  }
}

export function* addAnswerSaga(questionId: number, answer: Answer): Generator {
  try {
    const answerResponse = yield call(
      api.post,
      `/questions/${questionId}/answers`,
      answer,
    );
    yield put(
      addAnswerSuccess({
        createdQuestionId: questionId,
        addAnswerResponseData: answerResponse.data,
      }),
    );
  } catch (error) {
    console.error(`Ошибка добавления ответа: ${getErrorMessage(error)}`);
    throw error;
  }
}
