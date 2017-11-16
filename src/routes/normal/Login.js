import React from 'react';
import { connect } from 'dva';

import { Helmet } from 'react-helmet';
import { InputItem, Button } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { WhiteSpace, Title, IconImg } from '@/helps/styleComponent';
import styles from './Login.css';

const logoSource = require('@/assets/adang_logo.png');

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    const { pid } = this.helps.querystring.parse(this.props.location.search.substr(1));
    this.pid = pid; // 上级id
    this.state = {
      loginLoading: false,
      loginID: '',
      password: '',
    };
  }
  // 登录
  login = async () => {
    const { loginID, password } = this.state;
    const ipInfo = window.remote_ip_info;
    const registerProvince = ipInfo ? `${ipInfo.province}省` : '';
    const registerCity = ipInfo ? `${ipInfo.city}市` : '';
    const res = await this.helps.webHttp.get('/spreadApi/login', { loginID, password, registerProvince, registerCity });
    if (!res.isSuccess) {
      this.helps.toast(res.message || '账号或密码错误');
      return false;
    }
    // 登录成功
    this.props.dispatch(this.helps.routerRedux.push('/homePage'));
  }
  navigateToRegister = () => {
    if (this.pid) {
      this.props.dispatch(this.helps.routerRedux.push({
        pathname: '/register',
        query: {
          pid: this.pid,
        },
      }));
    } else {
      this.props.dispatch(this.helps.routerRedux.push('/register'));
    }
  }
  render() {
    const { loginLoading, loginID, password } = this.state;
    const { gameName } = this.props;
    return (
      <div className={styles.container}>
        <Title>代理登录</Title>
        <Helmet>
          <script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
        </Helmet>
        <div className={styles.contentContainer}>
          <div className={styles.logoWrap}>
            <IconImg className={styles.logo} src={logoSource} />
            <span className={styles.logoTitle}>{gameName}</span>
          </div>
          <div>
            <div className={styles.inputWrap}>
              <InputItem
                className={styles.loginInput}
                onChange={value => this.setState({ loginID: value })}
                value={loginID}
                placeholder="请输入账号名/姓名"
              >账号名:</InputItem>
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                className={styles.loginInput}
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={value => this.setState({ password: value })}
              >　密码:</InputItem>
            </div>
          </div>
          <WhiteSpace />
          <Button className={styles.loginBtn} loading={loginLoading} onClick={this.login}>登录</Button>
          <div className={styles.registerTip}>
            还没创建账号?点击<span className={styles.registerLabel} onClick={this.navigateToRegister}>创建账号</span>
          </div>
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
