import React from 'react';
import { connect } from 'dva';
import BaseComponent from '@/helps/BaseComponent';
import Button from '@/helps/antdComponent/Button';
import InputItem from '@/helps/antdComponent/InputItem';
import { Title, NetImg, WhiteSpace, FlexRow } from '@/helps/styleComponent';
import styles from './login.css';

// const logoSource = require('../../assets/adang_logo.png');

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
    const params = {
      loginID,
      password,
    };
    this.setState({
      loginLoading: true,
    });
    const res = await this.http.webHttp.get('/spreadApi/general/login', params);
    this.setState({
      loginLoading: false,
    });
    if (res.isSuccess) {
      this.router.go('/general/homePage');
    } else {
      this.message.info(res.info);
    }
  }
  render() {
    const { loginLoading } = this.state;
    const { gameName, iconLogo } = this.props;
    return (
      <div>
        <Title>合伙人登陆</Title>
        <div className="contentContainer">
          <div className={styles.logoWrap}>
            { iconLogo && <NetImg className={styles.logo} src={iconLogo} /> }
            <span className={styles.logoTitle}>{gameName}合伙人</span>
          </div>
          <div>
            <FlexRow className={styles.loginInput}>
              <p className={styles.inputLable}>账号:</p>
              <InputItem
                onChange={(value) => this.setState({ loginID: value })}
                placeholder="请输入账号名/姓名"
                style={{ flex: 1 }}
              />
            </FlexRow>
            <FlexRow className={styles.loginInput}>
              <p className={styles.inputLable}>密码:</p>
              <InputItem
                type="password"
                placeholder="请输入密码"
                style={{ flex: 1 }}
                onChange={value => this.setState({ password: value })}
              />
            </FlexRow>
          </div>
          <WhiteSpace />
          <Button className={styles.loginBtn} loading={loginLoading} onClick={this.login}>登录</Button>
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
