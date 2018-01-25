import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';

import BaseComponent from '@/core/BaseComponent';
import { Button, InputItem, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './ForgetPassword.less';

class ForgetPassword extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      verifyCode: '',
      newPwd: '',
      rePwd: '',
      getVerifyCodeElseTime: 0,
    };
  }
  async componentWillMount() {

  }
  checkPhoneValid = () => {
    const { phone } = this.state;
    const isPhoneValid = this.valid.phone(phone);
    return isPhoneValid;
  }
  getVerifyCode = async () => {
    const { getVerifyCodeElseTime, phone } = this.state;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.checkPhoneValid();
    if (!isCanGetVerifyCode) {
      return;
    }
    // 获取验证码
    const verifyRes = await this.http.webHttp.get('/spreadApi/getVerifyCode', { phone });
    if (!verifyRes.isSuccess) {
      this.message.info(verifyRes.info || '获取验证码失败');
      return;
    }
    this.message.info('获取验证码');
    await this.setStateAsync({
      getVerifyCodeElseTime: 60,
    });
    await this.count();
  }
  setStateAsync = (state) => {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
  // 计时
  count = async () => {
    if (this.state.getVerifyCodeElseTime > 0) {
      await this.setStateAsync({
        getVerifyCodeElseTime: this.state.getVerifyCodeElseTime - 1,
      });
      await this.helps.delay(1000);
      await this.count();
    }
  }
  reSetPwd = async () => {
    const { phone, newPwd, rePwd, verifyCode } = this.state;
    if (!newPwd || !rePwd) {
      this.message.info('密码不能为空');
      return;
    }
    if (newPwd !== rePwd) {
      this.message.info('两次密码不一致');
      return;
    }
    const res = await this.http.webHttp.get('/spreadApi/resetPsd', {
      phone, newPsd: newPwd, verifyCode,
    });
    if (res.isSuccess) {
      this.message.info('修改成功');
      this.router.back();
    } else {
      this.message.info(res.info || '修改失败');
    }
  }
  render() {
    const { verifyCode, phone, newPwd, rePwd, getVerifyCodeElseTime } = this.state;
    // const { getVerifyCodeElseTime } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isShowElseTime = !isCanReGetVerifyCode; // 是否显示剩余时间
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.checkPhoneValid();
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
        <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
          <div className={styles.inputWrap}>
            <InputItem
              clear
              value={phone}
              onChange={value => this.setState({ phone: value })}
              placeholder="请输入手机号码"
            />
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              clear
              value={verifyCode}
              onChange={value => this.setState({ verifyCode: value })}
              placeholder="请输入短信验证码"
              extra={<div
                className={classnames({ [styles.verifyCodeBtn]: true, [styles.verifyCodeDisable]: !isCanGetVerifyCode })}
                onClick={this.getVerifyCode}
              >
                { !isShowElseTime ? '获取验证码' : `重新发送(${getVerifyCodeElseTime}s)` }
             </div>}
            />
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              clear
              value={newPwd}
              type="password"
              onChange={value => this.setState({ newPwd: value })}
              placeholder="请输入新的密码"
            />
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              value={rePwd}
              type="password"
              onChange={value => this.setState({ rePwd: value })}
              placeholder="请确认密码"
            />
          </div>
          <div className={styles.confimBtnWrap}>
            <Button onClick={this.reSetPwd}>确定</Button>
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

export default connect(mapStateToProps)(ForgetPassword);
