import { call, take, takeEvery, takeLatest } from 'redux-saga/effects'
// import Api from '...'
import apiCall  from '@/utils/axiosApiCallWrapper'
import { baseURL } from "@/utils/request";

function* getData(action) {
    try {
      // const {url, method, params} = action;
        let response = yield call(apiCall, baseURL );
        console.log('loginGenobject', response)
        return response;
    } catch (error) {
        console.log(error);
    }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
function* mySaga() {
  yield take('*');
}

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
// function* mySaga() {
//   yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
// }

export default mySaga;