import React, { Fragment } from 'react';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018  
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>账单管理系统</span>
            </div>
            <div className={styles.desc}>账单后台管理系统</div>
          </div>
          {children}
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
