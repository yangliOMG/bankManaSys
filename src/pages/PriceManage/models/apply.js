import { addApply, queryApply, changeApply} from '@/services/api';

export default {
  namespace: 'apply',

  state: {
    facilityPriceList: [],
    applyList:{
      lists:[],
      pagination: {},
    },
    loading: false,
  },

  effects: {
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addApply, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      if (callback) callback();
    },
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryApply, payload);
      yield put({
        type: 'saveApply',
        payload: response,
      });
      if (callback) callback();
    },
    *change({ payload, callback }, { call, put }) {
      const response = yield call(changeApply, payload);
      yield put({
        type: 'changeApply',
        payload,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        facilityPriceList: payload,
      };
    },
    saveApply(state, { payload }) {
      return {
        ...state,
        applyList: payload,
      };
    },
    changeApply(state, { payload }) {
      return {
        ...state,
        applyList: { 
          lists: state.applyList.lists.filter(v=>v.id !== payload.id), 
          pagination: state.applyList.pagination
        },
      };
    },
    clear() {
      return {
        facilityList: [],
      };
    },
  },
};
