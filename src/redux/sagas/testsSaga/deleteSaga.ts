import { Answer, Question } from 'src/types/testsTypes';
import { call, put } from 'redux-saga/effects';
import {
  deleteTestSuccess,
  deleteQuestionSuccess,
  deleteAnswerSuccess,
} from '@models/testsSlice';
import api from '@api/index';

export function* deleteCurrentTestSaga(testId: number): Generator {
  try {
    yield call(api.delete, `/tests/${testId}`);
    yield put(deleteTestSuccess(testId));
  } catch (error) {
    console.error(
      `Ошибка удаления теста: ${error instanceof Error ? error.message : error}`,
    );
    throw error;
  }
}

export function* deleteQuestionSaga(question: Question): Generator {
  try {
    yield call(api.delete, `/questions/${question.id}`);
    if (question.id) {
      yield put(deleteQuestionSuccess(question.id));
    }
  } catch (error) {
    console.error(
      `Ошибка удаления вопроса: ${error instanceof Error ? error.message : error}`,
    );
    throw error;
  }
}

export function* deleteAnswerSaga(answer: Answer): Generator {
  try {
    yield call(api.delete, `/answers/${answer.id}`);
    if (answer.id) {
      yield put(deleteAnswerSuccess({ id: answer.id }));
    }
  } catch (error) {
    console.error(
      `Ошибка удаления ответа: ${error instanceof Error ? error.message : error}`,
    );
    throw error;
  }
}
