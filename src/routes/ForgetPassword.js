import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';

import { Button, InputItem } from '@/helps/antdComponent/index.js';
// import InputItem from '@/helps/antdComponent/InputItem';
import NavBar from '@/helps/antdComponent/NavBar';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './ForgetPassword.less';

class ForgetPassword extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      verifyCode: '',
      newPwd: '',
      rePwd: '',
    };
  }
  async componentWillMount() {
    
  }
  render() {
    const { verifyCode, phone, newPwd, rePwd } = this.state;
    return (
      <div className={styles.container}>
        <Title>忘记密码</Title>
        <Helmet>
          <script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
        </Helmet>
        <NavBar
          title="忘记密码"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div className={styles.inputWrap}>
            <InputItem
              value={phone}
              onChange={value => this.setState({ phone: value })}
              placeholder="请输入手机号码"
            />
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              value={verifyCode}
              onChange={value => this.setState({ verifyCode: value })}
              placeholder="请输入短信验证码"
            />
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              value={newPwd}
              onChange={value => this.setState({ newPwd: value })}
              placeholder="请输入新的密码"
            />
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              value={rePwd}
              onChange={value => this.setState({ rePwd: value })}
              placeholder="请确认密码"
            />
          </div>
        </div>
        <div className={styles.confimBtnWrap}>
          <Button>确认</Button>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(ForgetPassword);
