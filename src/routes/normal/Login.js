import React from 'react';
import { connect } from 'dva';

import { Input, Button } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { WhiteSpace, Title, IconImg } from '@/helps/styleComponent';
import styles from './Login.css';

const logoSource = require('@/assets/adang_logo.png');

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loginLoading: false,
      loginID: '',
      password: '',
    };
  }
  // 登录
  login = async () => {
    const { loginID, password } = this.state;
    const res = await this.helps.webHttp.get('/spreadApi/login', { loginID, password });
    if (!res.isSuccess) {
      this.helps.toast(res.message || '账号或密码错误');
      return false;
    }
    this.helps.toast('登录成功');
    // 登录成功
    this.props.dispatch(this.helps.routerRedux.push('/homePage'));
  }
  render() {
    const { loginLoading } = this.state;
    return (
      <div className="alignCenterContainer">
        <Title>代理登录</Title>
        <div className="contentContainer">
          <div className={styles.logoWrap}>
            <IconImg className={styles.logo} src={logoSource} />
            <span className={styles.logoTitle}>阿当比鸡</span>
          </div>
          <div>
            <Input
              className={styles.loginInput}
              onChange={(event) => this.setState({ loginID: event.target.value })}
              placeholder="请输入账号名/姓名"
            />
            <Input
              className={styles.loginInput}
              type="password"
              placeholder="请输入密码"
              onPressEnter={this.login}
              onChange={(event) => this.setState({ password: event.target.value })}
            />
          </div>
          <WhiteSpace />
          <Button className={styles.loginBtn} loading={loginLoading} onClick={this.login}>登录</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Login);
