import React from 'react';
import { connect } from 'dva';
import { window } from 'global';

import { Helmet } from 'react-helmet';
import BaseComponent from '@/core/BaseComponent';
import { InputItem, Button } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import styles from './Login.less';

const wxIcon = require('../../assets/wx_login.png');

class Login extends BaseComponent {
  constructor(props) {
    super(props);
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
    const { pCode } = this.router.getQuery();
    if (pCode) {
      this.router.go('/register', {
        pCode,
      });
    } else {
      this.router.go('/register');
    }
  }
  // 跳转忘记密码
  forgetPwd = () => {
    this.router.go('/forgetPassword');
  }
  // 微信登录
  wechatLogin = async () => {
    if (!this.helps.isWeixinBrowser() && this.helps.system() === 'PC') {
      this.router.go('/pcWechatLogin');
      return;
    }
    let serverInfo = this.props.serverInfo;
    if (!serverInfo || serverInfo.length < 1) {
      const res = await this.http.webHttp.get('/spreadApi/getPlatformInfo');
      if (res.isSuccess) {
        serverInfo = res.data.serverInfo;
      } else {
        this.message.info('网络异常,请重试');
      }
      if (!serverInfo || serverInfo.length < 1) {
        this.message.info('没有可选的游戏');
        return;
      }
    }
    const gameInfo = serverInfo[0];
    const { accountServerIP, accountServerPort, weChatMPID } = gameInfo;
    const origin = window.location.origin;
    const inviteLink = `http://${accountServerIP}:${accountServerPort}/WeChatAuthorize?ddmmp=${weChatMPID}&redirect=${origin}/generalManage/wechat.html&actionType=login`;
    window.location.href = inviteLink;
  }
  render() {
    const { loginLoading, loginID, password } = this.state;
    const { iconLogo, gameName } = this.props;
    const btnDisabled = !loginID || !password;
    return (
      <div className={styles.container}>
        <Title>代理登录</Title>
        <Helmet>
          <script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
        </Helmet>
        <div className={styles.contentContainer}>
          <div>
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
              >申请账号</span>
            </div>
          </div>
          {
            (this.helps.system() === 'PC' || this.helps.isWeixinBrowser()) &&
            <div
              className={styles.wechatLoginWrap}
              onClick={this.wechatLogin}
            >
              <div className={styles.wechatLogin}>
                <IconImg className={styles.wxLoginIcon} src={wxIcon} />
                <span className={styles.wechatLoginLabel}>微信登录</span>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.app,
  };
}

export default connect(mapStateToProps)(Login);
