import React, { PureComponent } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Card, DatePicker, Radio, Badge,Table } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';

import styles from './style.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const statusMap = {  "UNPAID":{text:'未支付',status:'error'}, 
                      "PAID":{text:'已支付',status:'success'}, 
                      "CLOSED":{text:'支付超时订单关闭',status:'default'}, 
                      "REFUNDS":{text:'已退款',status:'warning'}, 
                  };
const channelMap = {  "CCB_UPACP":'建行支付', 
                      "CCB_WX":'微信支付', 
                    };


@connect(({ bill, }) => ({
  billList: bill.billList, 
}))
class SimpleQuery extends PureComponent {
  state = {
    selectedRows: [],
    paytimeArr: [],
    radioDefault:"2",
  };

  columns = [
    { title: '序号', dataIndex: 'order_no', render: (td,row,idx) => idx + 1},
    { title: '支付渠道', dataIndex: 'channel', render: v => channelMap[v] },
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
  

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.dispatchFetchList(params)
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  }

  render() {
    const { billList, loading, } = this.props;
    const { selectedRows,radioDefault } = this.state;
    
    return (
      <PageHeaderWrapper title="账单查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <div className={styles.timeBlock}>
                交易时间：
                <RangePicker placeholder={['年/月/日', '年/月/日']} onChange={(date, dateString) => this.handleRangePickerChange(date, dateString)} />
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
            {/* <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={billList}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /> */}
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
