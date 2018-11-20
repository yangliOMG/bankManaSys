import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, DatePicker, Radio, Badge,Table,  } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';

import styles from './style.less';
import upacp from './svg/upacp.svg';
import wx from './svg/wx.svg';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const statusMap = {  "UNPAID":{text:'未支付',status:'error'}, 
                      "PAID":{text:'已支付',status:'success'}, 
                      "CLOSED":{text:'支付超时订单关闭',status:'default'}, 
                      "REFUNDS":{text:'已退款',status:'warning'},  };
const channelMap = {  "CCB_UPACP":{text:'建行支付',svg: upacp}, 
                      "CCB_WX":{text:'微信支付',svg: wx},  };


@connect(({ bill, loading }) => ({
  billList: bill.billList, 
  loading: loading.models.bill,
}))
class SimpleQuery extends PureComponent {
  state = {
    paytimeArr: [],
    radioDefault:"2",
  };

  columns = [
    { title: '序号', render: (td,row,idx) => idx + 1},
    { title: '订单号', dataIndex: 'order_no'},
    { title: '支付渠道', dataIndex: 'channel', 
      render: v => <span><img alt="logo" className={styles.logo} src={channelMap[v].svg} />{ channelMap[v].text}</span> 
    },
    { title: '支付金额', dataIndex: 'amount',  render: v => <Yuan>{v/100}</Yuan> },
    { title: '支付时间', dataIndex: 'success_time',
      render: val => val?<span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>:'-',
    },
    { title: '附加数据', dataIndex: 'attach',},
    { title: '订单状态', dataIndex: 'payment_status',  
      render: v =>  <Badge text={statusMap[v].text} status={statusMap[v].status}  />,
    },
  ];

  componentDidMount() {
    // this.dispatchFetchList()
  }

  dispatchFetchList = (obj) => {
    const { dispatch } = this.props;
    const { paytimeArr, radioDefault } = this.state
    const params = {
      status: radioDefault,
      begin_time: paytimeArr[0],
      end_time: paytimeArr[1],
      ...obj
    }
    dispatch({
      type: 'bill/get',
      payload: params,
    });
  }

  handleRangePickerChange = (date, dateString) => {
    let begintime = moment(dateString[0]).format('YYYYMMDD'),
        endtime = moment(dateString[1]).format('YYYYMMDD')
    this.setState({paytimeArr:[begintime,endtime]})
    this.dispatchFetchList({begin_time:begintime,end_time:endtime})
  }

  handleRadioChange = (e) => {
    const status = e.target.value
    this.setState({ radioDefault: status })
    
    this.dispatchFetchList({status})
  }

  render() {
    const { billList, loading, } = this.props;
    const { radioDefault } = this.state;
    
    return (
      <PageHeaderWrapper title="账单查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <div className={styles.timeBlock}>
                交易时间：
                <RangePicker placeholder={['起始日期', '截止日期']} onChange={(date, dateString) => this.handleRangePickerChange(date, dateString)} />
              </div>
              <div className={styles.radiogroup}>
                订单状态：
                <RadioGroup defaultValue={radioDefault} onChange={v => this.handleRadioChange(v)}>
                  <RadioButton value="2">已支付</RadioButton>
                  <RadioButton value="1">未支付</RadioButton>
                  <RadioButton value="3">交易关闭</RadioButton>
                  <RadioButton value="4">已退款</RadioButton>
                </RadioGroup>
              </div>
            </div>
            <Table
              loading={loading}
              rowKey='order_no'
              pagination={false}
              dataSource={billList}
              columns={this.columns}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SimpleQuery
