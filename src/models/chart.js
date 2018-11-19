import { fakeChartData,getGongdeChart } from '@/services/api';
import { formatDateData } from '../utils/utils';

export default {
  namespace: 'chart',

  state: {
    salesData:{
      monthly:[],
      dayly:[],
      daylyNum:[],
      daylyMem:[],
    } ,
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *gongdeChart(_, { call, put }) {
      const response = yield call(getGongdeChart);
      yield put({
        type: 'save',
        payload: {
          salesData: {
            monthly: response.monthly.map(v=>({...v,y:v.y/100})),
            dayly: formatDateData(response.dayly.map(v=>({...v,y:v.y/100}))),
            daylyNum: formatDateData(response.daylyNum),
            daylyMem: formatDateData(response.daylyMem),
          },
        },
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
        visitData: [],
        salesData: {monthly:[],dayly:[],daylyNum:[],},
      };
    },
  },
};
