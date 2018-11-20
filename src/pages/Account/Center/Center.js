import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './Center.less';

const authMap = ["用户","管理员"]

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class Center extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const {  inputVisible, inputValue } = this.state;
    const { listLoading, currentUser, match, location, children, } = this.props;

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.headImg} />
                    <div className={styles.name}>
                      {currentUser.account}
                      {/* { currentUser.sex !== "女"? currentUser.sex !== "男"?
                           null
                           : <Icon type="man" theme="outlined" className={styles.iconMan} />
                           : <Icon type="woman" theme="outlined" className={styles.iconWoman} />} */}
                    </div>
                      {/* <div>{currentUser.phone}</div> */}
                  </div>
                  <div className={styles.detail}>
                    <p><i className={styles.title} />{authMap[currentUser.manage]}</p>
                    {/* <p>
                      <i className={styles.group} />
                      {currentUser.dept}
                    </p>
                    <p>
                      <i className={styles.address} />
                      注册日期：{moment(currentUser.createtime).format('YYYY-MM-DD')}
                    </p> */}
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>团队</div>
                  </div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              // tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              // onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}
export default Center
