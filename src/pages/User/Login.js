import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, } from 'antd';
import Login from '@/components/Login';
import md5 from 'blueimp-md5';
import styles from './Login.less';

const {  UserName, Password, Submit } = Login;


@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          pwd: md5(values.pwd)
        },
      })
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
            {login.return_code !== 'SUCCESS' &&
              submitting === false &&
              this.renderMessage(login.msg)}
            <UserName name="account" placeholder="账户" />
            <Password
              name="pwd"
              placeholder="密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
export default LoginPage
