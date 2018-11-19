import { getGongdeInfo, getGongdeDetail} from '@/services/api';

export default {
  namespace: 'gongde',

  state: {
    facilityList: [],
    beliversSum: 0,
    lightSum: 0,
    currentLight: 0,
    successLight: 0,
    dayMoney: 0,
    allMoney: 0,

    dayList:[],
    allList:[],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getGongdeInfo);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchDetail(_, { call, put }) {
      const dayList = yield call(getGongdeDetail,'day');
      const allList = yield call(getGongdeDetail,'all');
      yield put({
        type: 'save',
        payload: {dayList,allList},
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        facilityList: [],
        beliversSum: 0,
        lightSum: 0,
        currentLight: 0,
        successLight: 0,
        dayMoney: 0,
        allMoney: 0,
      };
    },
  },
};
