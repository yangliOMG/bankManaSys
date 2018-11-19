import { getBelieverList } from '@/services/api';

function countProportion(list){
  let dataSex = [
    {x: '未知', y: 0, },
    {x: '男', y: 0, },
    {x: '女', y: 0, },
  ],
  dataAddr = []
  list.forEach(v=>{
    dataSex[v.sex].y += 1
    let addr = (v.area||"") + (v.province||"") + (v.city||"")
    if(addr === ""){
      addr = "未知"
    }
    let flag = false
    dataAddr.forEach((w,idx)=>{
      if(w.x === addr){
        w.y += 1
        flag = true
      }
    })
    if(!flag){
      dataAddr.push({x:addr, y:1})
    }
  })
  return {dataSex, dataAddr}
}


export default {
  namespace: 'xinzhong',

  state: {
    list: [],
    dataSex: [],
    dataAddr: [],
    towerListDataManage: [],
    applyList:{
      list: [],
      pagination: {},
    },
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getBelieverList);
      const {dataSex, dataAddr} = countProportion(response)
      yield put({
        type: 'save',
        payload: {list: response, dataSex, dataAddr},
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
        list: [],
        dataSex: [],
        dataAddr: [],
      };
    },
  },
};
