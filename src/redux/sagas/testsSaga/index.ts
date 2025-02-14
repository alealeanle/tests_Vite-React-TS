import { call, put, takeLatest } from 'redux-saga/effects';
import { addNewTestSaga, addQuestionSaga, addAnswerSaga } from './addSaga';
import {
  editCurrentTestSaga,
  editQuestionSaga,
  editAnswerSaga,
  changePositionAnswerSaga,
} from './editSaga';
import {
  deleteAnswerSaga,
  deleteCurrentTestSaga,
  deleteQuestionSaga,
} from './deleteSaga';
import {
  fetchTestsRequest,
  fetchTestsSuccess,
  fetchTestsFailure,
  addTestRequest,
  addTestFailure,
  getTestRequest,
  getTestSuccess,
  getTestFailure,
  editTestRequest,
  editTestFailure,
  deleteTestRequest,
  deleteTestFailure,
} from '@models/testsSlice';
import { getErrorMessage } from '@utils/errorSagaHandler';
import api from '@api/index';

function* fetchTestsSaga(
  action: ReturnType<typeof fetchTestsRequest>,
): Generator {
  try {
    const response = yield call(api.get, '/tests', { params: action.payload });
    yield put(fetchTestsSuccess(response.data));
  } catch (error) {
    yield put(fetchTestsFailure(getErrorMessage(error)));
  }
}

function* getTestSaga(action: ReturnType<typeof getTestRequest>): Generator {
  try {
    const response = yield call(api.get, `/tests/${action.payload}`);
    yield put(getTestSuccess(response.data));
  } catch (error) {
    yield put(getTestFailure(getErrorMessage(error)));
  }
}

function* addTestSaga(action: ReturnType<typeof addTestRequest>): Generator {
  try {
    const testId = yield call(addNewTestSaga, action);

    for (const question of action.payload.questions) {
      yield call(addQuestionSaga, testId, question);
    }
  } catch (error) {
    yield put(addTestFailure(getErrorMessage(error)));
  }
}

function* editTestSaga(action: ReturnType<typeof editTestRequest>): Generator {
  try {
    const {
      testId,
      initialTestTitle,
      initialQuestions,
      newTestTitle,
      questions,
    } = action.payload;

    if (initialTestTitle !== newTestTitle) {
      yield call(editCurrentTestSaga, action, testId);
    }

    for (const question of questions) {
      const { answers } = question;
      const initialQuestion = initialQuestions.find(q => q.id === question.id);

      if (initialQuestion) {
        yield call(editQuestionSaga, initialQuestion, question);

        if (initialQuestion && question.question_type !== 'number') {
          const maxLength = Math.max(
            answers.length,
            initialQuestion.answers.length,
          );

          for (let i = 0; i < maxLength; i++) {
            const currentAnswer = answers[i];
            const initialAnswer = initialQuestion.answers[i];

            if (currentAnswer && initialAnswer) {
              if (currentAnswer.key !== initialAnswer.key) {
                yield call(
                  changePositionAnswerSaga,
                  initialAnswer,
                  currentAnswer,
                );
              } else if (initialAnswer) {
                yield call(editAnswerSaga, initialAnswer, currentAnswer);
              }
            } else if (currentAnswer && !initialAnswer) {
              if (question.id) {
                yield call(addAnswerSaga, question.id, currentAnswer);
              }
            } else if (!currentAnswer && initialAnswer) {
              yield call(deleteAnswerSaga, initialAnswer);
            }
          }
        } else if (initialQuestion.answers.length && answers) {
          for (const answer of answers) {
            yield call(deleteAnswerSaga, answer);
          }
        }
      } else {
        yield call(addQuestionSaga, testId, question);
      }
    }

    for (const initQuestion of initialQuestions) {
      if (!questions.find(q => q.id === initQuestion.id)) {
        yield call(deleteQuestionSaga, initQuestion);
      }
    }
  } catch (error) {
    yield put(editTestFailure(getErrorMessage(error)));
  }
}

function* deleteTestSaga(
  action: ReturnType<typeof deleteTestRequest>,
): Generator {
  try {
    yield call(deleteCurrentTestSaga, action.payload.testId);
    yield put(fetchTestsRequest(action.payload.params));
  } catch (error) {
    yield put(deleteTestFailure(getErrorMessage(error)));
  }
}

export default function* testsSaga() {
  yield takeLatest(fetchTestsRequest.type, fetchTestsSaga);
  yield takeLatest(addTestRequest.type, addTestSaga);
  yield takeLatest(getTestRequest.type, getTestSaga);
  yield takeLatest(editTestRequest.type, editTestSaga);
  yield takeLatest(deleteTestRequest.type, deleteTestSaga);
}
