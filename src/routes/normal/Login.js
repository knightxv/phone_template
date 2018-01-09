import React from 'react';
import { connect } from 'dva';

import { Helmet } from 'react-helmet';
import { InputItem, Button } from '@/helps/antdComponent/index.js';
// import Button from '@/helps/antdComponent/Button';
import BaseComponent from '@/helps/BaseComponent';
import { Title, IconImg } from '@/helps/styleComponent';
import styles from './Login.less';

const wxIcon = require('../../assets/wx.png');

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    const { pCode } = this.router.getQuery();
    this.pCode = pCode; // 上级邀请码
    // const { loginID, password } = this.props;
    const loginID = this.helps.getCookie('userName');
    const password = this.helps.getCookie('password');
    this.state = {
      loginLoading: false,
      loginID,
      password,
    };
  }
  // 登录
  login = async () => {
    const { loginID, password } = this.state;
    const ipInfo = window.remote_ip_info;
    const registerProvince = ipInfo ? `${ipInfo.province}省` : '';
    const registerCity = ipInfo ? `${ipInfo.city}市` : '';
    const res = await this.http.webHttp.get('/spreadApi/login', { loginID, password, registerProvince, registerCity });
    if (!res.isSuccess) {
      this.message.info(res.message || '账号或密码错误');
      return false;
    }
    // 登录成功
    // this.props.dispatch({ type: 'agent/updateAppInfo', payload: { loginID, password } });
    this.helps.saveCookie('userName', loginID);
    this.helps.saveCookie('password', password);
    // 保存账号密码(不存localstorage,微信会自动清除)
    
    this.router.go('/homePage');
  }
  navigateToRegister = () => {
    if (this.pCode) {
      this.router.go('/register', {
        code: this.pCode,
      });
    } else {
      this.router.go('/register');
    }
    // if (this.pid) {
    //   this.props.dispatch(this.helps.routerRedux.push({
    //     pathname: '/register',
    //     query: {
    //       pid: this.pid,
    //     },
    //   }));
    // } else {
    // }
  }
  // 跳转忘记密码
  forgetPwd = () => {
    this.router.go('/forgetPassword');
  }
  // 微信登录
  wechatLogin = () => {
    this.message.info('跳转授权地址');
  }
  render() {
    const { loginLoading, loginID, password } = this.state;
    const { iconLogo } = this.props;
    const { gameName } = this.props;
    const btnDisabled = !loginID || !password;
    return (
      <div className={styles.container}>
        <Title>代理登录</Title>
        <Helmet>
          <script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
        </Helmet>
        <div className={styles.contentContainer}>
          <div className={styles.logoWrap}>
            { iconLogo && <IconImg className={styles.logo} src={iconLogo} />}
            <span className={styles.logoTitle}>{gameName}</span>
          </div>
          <div>
            <div className={styles.inputWrap}>
              <InputItem
                className={styles.loginInput}
                onChange={value => this.setState({ loginID: value })}
                value={loginID}
                clear
                placeholder="代理用户名/手机号"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                className={styles.loginInput}
                type="password"
                placeholder="代理登录密码"
                value={password}
                clear
                onChange={value => this.setState({ password: value })}
              />
            </div>
          </div>
          <div className={styles.forgetPwdWrap}>
            <span onClick={this.forgetPwd}>忘记密码?</span>
          </div>
          <Button
            className={styles.loginBtn}
            loading={loginLoading}
            onClick={this.login}
            disabled={btnDisabled}
          >
            登录
          </Button>
          <div className={styles.registerTip}>
            <span
              className={styles.registerLabel}
              onClick={this.navigateToRegister}
            >注册账号</span>
          </div>
          <div
            className={styles.wechatLoginWrap}
            onClick={this.wechatLogin}
          >
            <IconImg className={styles.wxLoginIcon} src={wxIcon} />
            <div>微信登录</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.app,
    ...state.agent,
  };
}

export default connect(mapStateToProps)(Login);
