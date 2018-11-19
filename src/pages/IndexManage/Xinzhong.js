import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { Row,Col,Card,Table,Radio, Avatar } from 'antd';
import { Pie, } from '@/components/Charts';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './Xinzhong.less';


@connect(({ xinzhong, loading }) => ({
  xinzhong,
  loading: loading.effects['xinzhong/fetch'],
}))
class Xinzhong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xzType: 'sex',
      loading: true,
    };
  }

  state = {
    xzType: 'sex',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'xinzhong/fetch',
      });
      this.timeoutId = setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 600);
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'xinzhong/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeXzType = e => {
    this.setState({
      xzType: e.target.value,
    });
  }

  render() {
    const {  xzType, loading: propsLoding, } = this.state;
    const { xinzhong, loading: stateLoading } = this.props;
    const { list, dataSex, dataAddr, } = xinzhong;
    const loading = propsLoding || stateLoading;
    let xzPieData = xzType === 'sex' ? dataSex : dataAddr;

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index)  => index + 1 , 
      },
      {
        title: '昵称',
        dataIndex: 'nick',
        key: 'nick',
      },
      {
        title: '头像',
        dataIndex: 'headImgURL',
        key: 'headImgURL',
        render: src => <Avatar size="large" src={src} /> , 
      },
    ];

    return (
      <GridContent>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title='信众管理列表'
            >
              <Table
                rowKey="id"
                size="middle"
                columns={columns}
                dataSource={list}
                pagination={{
                  style: { marginBottom: 0 },
                  pageSize: 5,
                  size:"large"
                }}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              className={styles.xzCard}
              bordered={false}
              title='信众类型占比'
              bodyStyle={{ padding: 24 }}
              style={{ minHeight: 509 }}
              extra={
                <div className={styles.xzCardExtra}>
                  <div className={styles.xzTypeRadio}>
                    <Radio.Group value={xzType} onChange={this.handleChangeXzType}>
                      <Radio.Button value="sex">性别</Radio.Button>
                      <Radio.Button value="addr">地区</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              }
            >
              <Pie
                hasLegend
                subTitle='信众管理'
                total={() => <span>{xzPieData.reduce((pre, now) => now.y + pre, 0)}人</span>}
                data={xzPieData}
                valueFormat={value => <span>{value}人</span>}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Xinzhong;
