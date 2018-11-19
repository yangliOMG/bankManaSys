import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}





export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?phone=${mobile}`);
}
export async function changeTemple(id) {
  return request(`/api/changeTid?tid=${id}`);
}
export async function msgList() {
  return request('/api/msgList');
}
export async function msgClear(idList) {
  return request('/api/msgClear', {
    method: 'POST',
    body: [
      ...idList,
    ],
  });
}

export async function getBelieverList() {
  return request('/api/believers');
}
export async function getGongdeInfo() {
  return request('/api/Gongde');
}
export async function getGongdeDetail(params) {
  return request(`/api/Data?time=${params}`);
}
export async function getGongdeChart() {
  return request('/api/gongdeChart');
}


export async function accountLogin(params) {
  return request(`/api/login`, {
    method: 'POST',            
    body: params,
  });
}
export async function queryBill(params) {
  return request('/api/query/pay/batch', {
    method: 'POST',            
    body: params,
  });
}
export async function queryCCB(params) {
  return request('/api/query/ccbquery', {
    method: 'POST',            
    body: params,
  });
}
export async function changeApply(params) {
  const url =  params.type === 'pass'? '/api/applyPass': '/api/applyFail'
  return request(`${url}?id=${params.id}`);
}
