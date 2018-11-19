import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip, Button } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return [];
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.createTime) {
        newNotice.datetime = moment(notice.createTime).fromNow();
      }
      if (newNotice.type>100 && newNotice.type<200) {
        newNotice.typeName = "通知" 
      }
      // if (newNotice.title && newNotice.status) {
      //   const color = {
      //     todo: '',
      //     processing: 'blue',
      //     urgent: 'red',
      //     doing: 'gold',
      //   }[newNotice.status];
      //   newNotice.extra = (
      //     <Tag color={color} style={{ marginRight: 0 }}>
      //       {newNotice.title}
      //     </Tag>
      //   );
      // }
      return newNotice;
    });
    return groupBy(newNotices.filter(i=>i.status===2), 'typeName');
  }

  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const {
      currentUser,
      templeList,
      tid,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onTempleClick,
      onNoticeClear,
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        {/* <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage id="menu.account.trigger" defaultMessage="Trigger Error" />
        </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const templeMenu = (
      <Menu selectedKeys={[]} onClick={onTempleClick}>
        {
          templeList.map(v=>
            <Menu.Item key={v.id} disabled={v.id===tid}>
                {v.name}
            </Menu.Item>
          )
        }
      </Menu>
    );
    const templeContext = (templeList.find(v=>v.id===tid)||"").name || "选择寺院"
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {/* <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder="站内搜索"
          dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
          onSearch={value => {
            console.log('input', value); // eslint-disable-line
          }}
          onPressEnter={value => {
            console.log('enter', value); // eslint-disable-line
          }}
        />
        <Tooltip title="使用文档">
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
            title="使用文档"
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
         */}
        {currentUser.nick ? (
          <div>
            <NoticeIcon
              className={styles.action}
              count={currentUser.notifyCount}
              onItemClick={(item, tabProps) => {
                console.log(item, tabProps); 
              }}
              onClear={onNoticeClear}
              onPopupVisibleChange={onNoticeVisibleChange}
              loading={fetchingNotices}
              popupAlign={{ offset: [20, -16] }}
            >
              <NoticeIcon.Tab
                list={noticeData['通知']}
                title="通知"
                emptyText="您已读完所有通知"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
              />
            </NoticeIcon>
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.headimgurl}
                  alt="avatar"
                />
                <span className={styles.name}>{currentUser.nick}</span>
              </span>
            </Dropdown>
          </div>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {/* <Button
          size="small"
          ghost={theme === 'dark'}
          style={{
            margin: '0 8px',
          }}
          onClick={() => {
            this.changLang();
          }}
        >
          <FormattedMessage id="navbar.lang" />
        </Button> */}
      </div>
    );
  }
}
