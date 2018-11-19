import {  queryCCB, queryBill } from '@/services/api';
import { message } from 'antd';

export default {
  namespace: 'bill',

  state: {
    billList:[],
    list:[],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCCB, payload)
      if(response && response.return_code==="000000"){
        yield put({
          type: 'save',
          payload: response.orders,
        })
      }else if(response && response.return_msg){
        message.warning(response.return_msg)
        yield put({
          type: 'clear',
        })
      }
    },
    *get({ payload }, { call, put }) {
      const response = yield call(queryBill, payload)
      if(response && response.return_code==="SUCCESS"){
        yield put({
          type: 'saveBill',
          payload: response.payments,
        })
      }else if(response && response.return_msg){
        message.warning(response.return_msg)
        yield put({
          type: 'clearBill',
        })
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        list: payload,
      }
    },
    clear() {
      return {
        list: [],
      }
    },
    saveBill(state, { payload }) {
      return {
        ...state,
        billList: payload,
      }
    },
    clearBill() {
      return {
        billList: [],
      }
    },
  },
};
