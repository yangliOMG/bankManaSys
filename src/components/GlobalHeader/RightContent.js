import React, { PureComponent } from 'react';
import { FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip, Button } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {

  render() {
    const { currentUser, onMenuClick, theme, } = this.props;
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
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.account ? (
          <div>
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.headImg}
                  alt="avatar"
                />
                <span className={styles.name}>{currentUser.account}</span>
              </span>
            </Dropdown>
          </div>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
