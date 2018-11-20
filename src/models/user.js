import {  queryCurrent } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if( response && response.return_code === "SUCCESS"){
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        })
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const payload = action.payload || {}
      return {
        ...state,
        currentUser: { ...payload},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
