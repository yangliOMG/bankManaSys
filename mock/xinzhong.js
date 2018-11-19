import { parse } from 'url';


// mock data

const xzListData = []
const arr1 = ['赵','钱','孙','李','周','吴','郑','王']
const arr2 = ['一','二','三','四','五','六','七','八']
for (let i = 0; i < 50; i += 1) {
  xzListData.push({
    index: i + 1,
    nick: arr1[Math.floor(Math.random()*arr1.length)] + arr2[Math.floor(Math.random()*arr2.length)],
    img: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
  })
}

const towerListData = []
const count = {
  yigong:0,
  total:0,
  yigongtotal:Math.floor(Math.random()*2000+1000),
  xinzhong:Math.floor(Math.random()*1000+300),
  gongde:12341,
  gongdetotal:12322141,
}
for (let i = 0; i < 4; i += 1) {
  let yigong = Math.floor(Math.random()*265)
  count.yigong += yigong
  count.total += 1920
  towerListData.push({
    index: i + 1,
    key: i + 1,
    name: `灵隐寺${arr2[i]}号塔` ,
    yigong ,
    total: 1920,
    day:9.9,
    month:99,
    year:999,
    long:3999
  })
}

const xzTypeDataSex = [
  {
    x: '男',
    y: 111,
  },
  {
    x: '女',
    y: 222,
  },
];

const xzTypeDataAddr = [
  {
    x: '浙江',
    y: 244,
  },
  {
    x: '江苏',
    y: 321,
  },
  {
    x: '北京',
    y: 311,
  },
  {
    x: '天津',
    y: 41,
  },
  {
    x: '四川',
    y: 121,
  },
  {
    x: '其他',
    y: 111,
  },
];

let tableListDataSource = [];
for (let i = 0; i < 3; i += 1) {
  tableListDataSource.push({
    key: i,
    applyman: arr1[Math.floor(Math.random()*arr1.length)] + arr2[Math.floor(Math.random()*arr2.length)],
    time: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    desc:towerListData
  });
}
function getRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}


function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        applyman: arr1[Math.floor(Math.random()*arr1.length)] + arr2[Math.floor(Math.random()*arr2.length)],
        time: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
        desc:towerListData
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}


const data = {
  xzListData,
  towerListData,
  count,
  xzTypeDataSex,
  xzTypeDataAddr,
};

export default {
  'GET /api/xinzhong_data': data,
  'GET /api/applyList': getRule,
  'POST /api/applyList': postRule,
};
