import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import testsSaga from './testsSaga';

export default function* rootSaga(): Generator {
  yield all([fork(authSaga), fork(testsSaga)]);
}
