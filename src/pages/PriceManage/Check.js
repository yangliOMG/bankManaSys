import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Icon, Button, Dropdown, Menu, Modal, message, Divider, Table, Radio, Badge } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Yuan from '@/utils/Yuan';

import styles from './style.less';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ apply, }) => ({
  applyList: apply.applyList, 
}))
@Form.create()
class Check extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    radioDefault:"2",
  };

  columns = [
    {
      title: '申请人',
      dataIndex: 'applyer',
      sorter: true,
      render: (td,row) => row.sysName,
    },
    {
      title: '申请时间',
      dataIndex: 'applytime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '相关塔名',
      dataIndex: 'priceModifyList',
      render: arr => <span>{arr.map(v=>v.name).join("，")}</span>,
    },
    {
      title: '操作',
      render: (row) => (
        row.status !== 1 ? row.status !== 3 ? 
        <Fragment>
          <a onClick={() =>this.passAndFail(row.id,'fail')}>不通过</a>
          <Divider type="vertical" />
          <a onClick={() =>this.passAndFail(row.id,'pass')}>通过</a>
        </Fragment>
        :
        <Badge status="default" text="未通过" />
        :
        <Badge status="success" text="已通过" />
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { radioDefault } = this.state;
    const params = {
      currentPage: 1,
      pageSize: 10,
      status: radioDefault
    }
    dispatch({
      type: 'apply/fetch',
      payload: params,
    });
  }
  
  expandedRowRender = (record) => {
    const col = [
      { title: '塔名', dataIndex: 'name', key: 'name' },
      { title: '天', dataIndex: 'day', render: v => <Yuan>{v/100}</Yuan> },
      { title: '月', dataIndex: 'month',  render: v => <Yuan>{v/100}</Yuan> },
      { title: '年', dataIndex: 'year',  render: v => <Yuan>{v/100}</Yuan> },
      { title: '长明', dataIndex: 'longtime',  render: v => <Yuan>{v/100}</Yuan> },
    ];
    return (
      <Table
        rowKey='id'
        size='small'
        columns={col}
        dataSource={record.priceModifyList}
        pagination={false}
      />
    );
  }

  passAndFail = (id, type) => {
    const text = type === 'pass' ? '通过':'不通过'
    Modal.confirm({
      title: `审核${text}`,
      content: `确定${text}该调价申请吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleChangeStatus(id,type),
    });
  }

  handleChangeStatus = (id,type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'apply/change',
      payload: {id,type},
    });
    message.success('操作成功');
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, radioDefault } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      status: radioDefault,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'apply/fetch',
      payload: params,
    });
  }

  handleRadioChange = (e) => {
    const { dispatch } = this.props;
    const params = {
      currentPage: 1,
      pageSize: 10,
      status: e.target.value
    }
    dispatch({
      type: 'apply/fetch',
      payload: params,
      callback: () => {
        this.setState({
          radioDefault: e.target.value
        });
      },
    });
  }

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleCreate = () => {
    router.push('/price/step-form/info');
  }

  render() {
    const { applyList, loading, } = this.props;
    const { selectedRows,radioDefault } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="审核表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreate(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button disabled='true'>批量操作</Button>
                  <Dropdown overlay={menu} disabled='true'>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
              <RadioGroup defaultValue={radioDefault} className={styles.radiogroup} onChange={v => this.handleRadioChange(v)}>
                <RadioButton value="2">待审核</RadioButton>
                <RadioButton value="1,3">已审核</RadioButton>
                <RadioButton value="1,2,3">全部</RadioButton>
              </RadioGroup>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={applyList}
              columns={this.columns}
              expandedRowRender={record => this.expandedRowRender(record)}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Check
