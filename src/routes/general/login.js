import React from 'react';
import { connect } from 'dva';
import styles from './login.css';
import BaseComponent from '../../helps/BaseComponent';
import { Input, Button } from '../../helps/antdComponent';
import { Title, NetImg, WhiteSpace, FlexRow } from '../../helps/styleComponent';

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
    const res = await this.helps.webHttp.get('/spreadApi/general/login', params);
    this.setState({
      loginLoading: false,
    });
    if (res.isSuccess) {
      this.props.dispatch(this.helps.routerRedux.push('/general/homePage'));
    } else {
      this.helps.toast(res.info);
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
            <NetImg className={styles.logo} src={iconLogo} />
            <span className={styles.logoTitle}>{gameName}合伙人</span>
          </div>
          <div>
            <FlexRow className={styles.loginInput}>
              <p className={styles.inputLable}>账号:</p>
              <Input
                onChange={(event) => this.setState({ loginID: event.target.value })}
                placeholder="请输入账号名/姓名"
              />
            </FlexRow>
            <FlexRow className={styles.loginInput}>
              <p className={styles.inputLable}>密码:</p>
              <Input
                type="password"
                placeholder="请输入密码"
                onPressEnter={this.login}
                onChange={event => this.setState({ password: event.target.value })}
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
