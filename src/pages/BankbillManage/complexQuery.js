import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, Badge, Table, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';
import { formatBankbillDate } from '@/utils/utils';

import styles from './style.less'; 

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const statusMap = { "成功":'success', "失败":'error'};

@connect(({ bill, loading }) => ({
  list: bill.list, 
  loading: loading.models.bill,
}))
@Form.create()
class ComplexQuery extends PureComponent {
  state = {
    formValues: {},
    expandForm: false,
  };

  columns = [
    { title: '序号', render: (td,row,idx) => idx + 1},
    { title: '订单号', dataIndex: 'orderid'},
    { title: '交易时间', dataIndex: 'orderdate',
      render: val => <span>{moment(formatBankbillDate(val)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    { title: '记账日期', dataIndex: 'accdate',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    { title: '支付金额', dataIndex: 'amount',  render: v => v === "0.00"? '-':<Yuan>{v}</Yuan> },
    { title: '退款金额', dataIndex: 'refund',  render: v => v === "0.00"? '-':<Yuan>{v}</Yuan> },
    { title: '流水状态', dataIndex: 'status',  
      render: status =>  <Badge text={status} status={statusMap[status]||"warning"}  />,
    },
  ];

  componentDidMount() {
    // this.dispatchFetchList()
  }

  dispatchFetchList = (obj) => {
    const { dispatch } = this.props;
    let { formValues } = this.state
    const params = {
      ...formValues,
      ...obj.formValues,
    }
    dispatch({
      type: 'bill/fetch',
      payload: params,
    })
  }

  handleFormReset = () => {
    const { form,dispatch } = this.props;
    form.resetFields();
    this.setState({ formValues: {}, });
    dispatch({
      type: 'bill/clear',
    })
  };
  
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        orderdate: moment(fieldsValue.orderdate).format('YYYYMMDD')
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      }
      if(values.rangedate){
        values.begordertime = moment(values.rangedate[0]).format('YYYYMMDD')
        values.endordertime = moment(values.rangedate[1]).format('YYYYMMDD')
        delete values.rangedate
      }
      this.setState({ formValues: values })
      this.dispatchFetchList({ formValues: values })
    });
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm, });
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator }, } = this.props;
    const { expandForm } = this.state;
    const layoutValue = {sm:24, md:12, xl: 6 }
    const rowValue = {  md: 8, lg: 24, xl: 48  }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={rowValue}>
          <Col {...layoutValue}>
            <FormItem label="商户代码">
              {getFieldDecorator('merchantid', {rules: [{required: true,message: '必填项',},],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col {...layoutValue}>
            <FormItem label="分行代码">
              {getFieldDecorator('branchid', {rules: [{required: true,message: '必填项',},],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col {...layoutValue}>
            <FormItem label="柜台编号">
              {getFieldDecorator('posid', {rules: [{required: true,message: '必填项',},],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col {...layoutValue}>
            <FormItem label="查询密码">
              {getFieldDecorator('qupwd', {rules: [{required: true,message: '必填项',},],
              })(<Input placeholder="请输入" type="password" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowValue}>
          <Col {...layoutValue}>
            <FormItem label="交易状态">
              {getFieldDecorator('status', {rules: [{required: true,message: '必选项',},],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">失败</Option>
                  <Option value="1">成功</Option>
                  <Option value="2">不确定</Option>
                  <Option value="3">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...layoutValue}>
            <FormItem label="流水类型">
              {getFieldDecorator('type', {rules: [{required: true,message: '必选项',},],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">支付流水</Option>
                  <Option value="1">退款流水</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...layoutValue}>
            <FormItem label="流水状态">
              {getFieldDecorator('kind', {rules: [{required: true,message: '必选项',},],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未结算流水</Option>
                  <Option value="1">已结算流水</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...layoutValue}>
            <FormItem label="订单日期">
              {getFieldDecorator('orderdate', {rules: [{required: true,message: '必选项',},],
              })(<DatePicker style={{ width: '100%' }} placeholder="请选择日期" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowValue}>
          <Col {...layoutValue}>
            <FormItem label="页码">
              {getFieldDecorator('page', {rules: [{required: true,message: '必填项',},],
              })(<Input placeholder="请输入" /> )}
            </FormItem>
          </Col>
          {expandForm && <Col {...layoutValue}>
              <FormItem label="订单号">
                {getFieldDecorator('orderid')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>}
          {expandForm && <Col {...{sm:24, md:24, xl: 12}}>
              <FormItem label="订单起止日期">
                {getFieldDecorator('rangedate')(<RangePicker style={{ width: '100%' }} placeholder={['开始日期', '截止日期']} />)}
              </FormItem>
            </Col>}
        </Row>
        {expandForm && <Row gutter={rowValue}>
          <Col {...layoutValue}>
            <FormItem label="操作员">
              {getFieldDecorator('operator')(<Input placeholder="请输入" /> )}
            </FormItem>
          </Col>
        </Row>}
        <div style={{ overflow: 'hidden' }}>
          <div className={styles.submitButtons2}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>{expandForm?"收起":"展开"} <Icon type={expandForm?"up":"down"} /></a>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const { list, loading, } = this.props;
    return (
      <PageHeaderWrapper title="银行账单查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <Table
              loading={loading}
              rowKey='orderid'
              pagination={false}
              dataSource={list}
              columns={this.columns}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ComplexQuery
