import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Tabs, Card, Table, } from 'antd';
import moment from 'moment';

import { ChartCard, MiniArea, MiniBar, Bar} from '@/components/Charts';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Yuan from '@/utils/Yuan';

import styles from './Gongde.less';

const { TabPane } = Tabs;

@connect(({ gongde, chart }) => ({
  gongde,
  chart,
}))
class Gongde extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'gongde/fetch',
      });
      dispatch({
        type: 'gongde/fetchDetail',
      });
      dispatch({
        type: 'chart/gongdeChart',
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
      type: 'gongde/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  render() {
    const { loading: propsLoding, } = this.state;
    const { gongde, chart, loading: stateLoading } = this.props;
    const { facilityList, allMoney, beliversSum, currentLight, dayMoney, lightSum, successLight, dayList, allList } = gongde;
    const { salesData } = chart;
    const loading = propsLoding || stateLoading;

    const columns = [
      {title: '序号',dataIndex: 'id',key: 'id',render: (text, record, index)  => index + 1 , },
      {title: '塔名',dataIndex: 'name',},
      {title: '已供灯数',dataIndex: 'theCurrentLight',},
      {title: '总灯数',dataIndex: 'theSumLight',},
    ]

    const columns2 = [
      {title: '祈福人',dataIndex: 'prayman',},
      {title: '描述',dataIndex: 'fname',render: (text, record, index)  => `${text}供灯${record.num}盏` , },
      {title: '功德',dataIndex: 'sum',render: d => <Yuan>{d/100}</Yuan> ,},
      {title: '时间',dataIndex: 'payTime',render: d => moment(d).format("HH:mm") , },
    ]

    const columns3 = [
      {title: '祈福人',dataIndex: 'prayman',},
      {title: '描述',dataIndex: 'fname',render: (text, record, index)  => `${text}供灯${record.num}盏` , },
      {title: '功德',dataIndex: 'sum',render: d => <Yuan>{d/100}</Yuan> ,},
      {title: '时间',dataIndex: 'payTime',render: d => moment(d).format("YYYY-MM-DD HH:mm") , },
    ]

    const topColResponsiveProps = { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, }

    return (
      <GridContent>
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col {...topColResponsiveProps} xl={12}>
            <Card bordered={false} bodyStyle={{ paddingTop: 0, paddingBottom: 0,}}>
              <Tabs tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab='总量' key="total">
                  <Row gutter={24}>
                    <Col xl={12} className={styles.pad}>
                      <ChartCard
                        bordered={false}
                        loading={loading}
                        contentHeight={46}
                        footer={<div className={styles.describe}>已供灯数</div>}
                      >
                        <div className={styles.content}>{currentLight}</div>
                      </ChartCard>
                    </Col>
                    <Col xl={12} className={styles.pad}>
                      <ChartCard
                        bordered={false}
                        loading={loading}
                        contentHeight={46}
                        footer={<div className={styles.describe}>总灯数</div>}
                      >
                        <div className={styles.content}>{lightSum}</div>
                      </ChartCard>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab='详情' key="details">
                  <Table
                    rowKey={record => record.id}
                    size="small"
                    columns={columns}
                    dataSource={facilityList}
                    pagination={{
                      style: { marginBottom: 0 },
                      pageSize: 5,
                    }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              contentHeight={46}
              title="累计供灯数"
              total={successLight}
              footer={<div className={styles.describe}>最近10日供灯数</div>}
            >
             <MiniArea color="#975FE4" data={salesData.daylyNum} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              loading={loading}
              contentHeight={46}
              title="信众总数"
              total={beliversSum}
              footer={<div className={styles.describe}>近10日新增信众数</div>}
            >
              <MiniBar data={salesData.daylyMem} />
            </ChartCard>
          </Col>
        </Row>

        <Card
          loading={loading}
          title="收益"
          bordered={false} 
        >
          <Row gutter={24}>
            <Col xl={24}>
              <Tabs tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="图表" key="total">
                  <ChartCard
                    bordered={false}
                    loading={loading}
                    contentHeight={200}
                    title="今日功德"
                    total={<div className={styles.contentred}><Yuan>{dayMoney/100}</Yuan></div>}
                    footer={<div className={styles.describe}>最近10日功德量</div>}
                  >
                    <Bar
                      height={200}
                      data={salesData.dayly}
                    />
                  </ChartCard>
                </TabPane>
                <TabPane tab="今日详情" key="details">
                  <Table
                    rowKey={record => record.id}
                    size="small"
                    columns={columns2}
                    dataSource={dayList}
                    pagination={{
                      pageSize: 5,
                    }}
                  />
                </TabPane>
              </Tabs>
            </Col>
            <Col xl={24}>
            <Tabs tabBarStyle={{ marginBottom: 0 }}>
                <TabPane tab="图表" key="total">
                  <ChartCard
                    bordered={false}
                    loading={loading}
                    contentHeight={200}
                    title="累计功德"
                    total={<div className={styles.contentred}><Yuan>{allMoney/100}</Yuan></div>}
                    footer={<div className={styles.describe}>月功德量</div>}
                  >
                    <Bar
                      height={200}
                      data={salesData.monthly}
                    />
                  </ChartCard>
                </TabPane>
                <TabPane tab="详细数据" key="details">
                  <Table
                    rowKey={record => record.id}
                    size="small"
                    columns={columns3}
                    dataSource={allList}
                    pagination={{
                      pageSize: 5,
                    }}
                  />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Card>
      </GridContent>
    );
  }
}

export default Gongde;
