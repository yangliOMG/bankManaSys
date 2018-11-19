import React from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
// import router from 'umi/router';
import Result from '@/components/Result';
import Yuan from '@/utils/Yuan';

import styles from './style.less';

@connect(({ apply }) => ({
  facilityPriceList: apply.facilityPriceList,
}))
class Step3 extends React.PureComponent {
  render() {
    const { facilityPriceList } = this.props;
    // const onFinish = () => {
    //   router.push('/price/step-form/info');
    // };
    const columns = [
      {
        title: "序号",
        dataIndex: 'fid',
        key: 'fid',
        render: (text, record, index)  => index + 1 , 
      },
      {
        title: "塔名",
        dataIndex: 'name',
      },
      {
        title: "1天",
        dataIndex: 'day',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
      {
        title: "1月",
        dataIndex: 'month',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
      {
        title: "1年",
        dataIndex: 'year',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
      {
        title: "长明",
        dataIndex: 'longtime',
        render: d => <Yuan>{d/100}</Yuan> , 
      },
    ];
    const information = (
      <Table
          rowKey={record => record.fid}
          columns={columns}
          dataSource={facilityPriceList}
          pagination={false}
        />
    )
    // const actions = (
    //   <Fragment>
    //     <Button type="primary" onClick={onFinish}>
    //       再转一笔
    //     </Button>
    //     <Button>查看账单</Button>
    //   </Fragment>
    // );
    return (
      <Result
        type="success"
        title="操作成功"
        description="调价申请已提交"
        extra={information}
        // actions={actions}
        className={styles.result}
      />
    );
  }
}
export default Step3