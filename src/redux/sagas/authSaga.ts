import { User } from 'src/types/authTypes';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from '@models/authSlice';
import { getErrorMessage } from '@utils/errorSagaHandler';
import api from '@api/index';

function* fetchCurrentUserSaga(): Generator<unknown, void, { data: User }> {
  try {
    const response = yield call(api.get, '/users/current');
    yield put(fetchUserSuccess(response.data));
  } catch (error: unknown) {
    yield put(fetchUserFailure(getErrorMessage(error)));
  }
}

function* loginSaga(action: ReturnType<typeof loginRequest>): Generator {
  try {
    const response = yield call(api.post, '/signin', action.payload);
    yield put(loginSuccess(response.data));
  } catch (error) {
    yield put(loginFailure(getErrorMessage(error)));
  }
}

function* logoutSaga(): Generator {
  try {
    yield call(api.delete, '/logout');
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure(getErrorMessage(error)));
  }
}

function* registerSaga(action: ReturnType<typeof registerRequest>): Generator {
  try {
    yield call(api.post, '/signup', action.payload);
    yield put(registerSuccess());
  } catch (error) {
    yield put(registerFailure(getErrorMessage(error)));
  }
}

export default function* authSaga(): Generator {
  yield takeLatest(fetchUserRequest.type, fetchCurrentUserSaga);
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
  yield takeLatest(registerRequest.type, registerSaga);
}
