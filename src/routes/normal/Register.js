import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';

import BaseComponent from '@/core/BaseComponent';
import { Button, InputItem, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './Register.less';

class Register extends BaseComponent {
  constructor(props) {
    super(props);
    const { pCode } = this.router.getQuery();
    // this.hasPcode = !!pCode; // 上级代理的邀请码
    this.state = {
      phone: '',
      pCode, // 上级代理邀请码
      verifyCode: '', // 验证码
      agreenShow: false,
      getVerifyCodeElseTime: 0,
    };
  }
  // 注册
  register = async () => {
    const { phone, verifyCode, pCode } = this.state;
    if (!verifyCode) {
      this.message.info('请输入验证码');
      return false;
    }
    const ipInfo = window.remote_ip_info;
    const registerProvince = ipInfo ? `${ipInfo.province}省` : '';
    const registerCity = ipInfo ? `${ipInfo.city}市` : '';
    const password = 123456; // 默认密码
    const res = await this.http.webHttp.get('/spreadApi/register',
    { phone, pCode, verifyCode, password, registerProvince, registerCity });
    if (res.isSuccess) {
      // Toast.info('注册成功');
      const resLogin = await this.http.webHttp.get('/spreadApi/login', { loginID: phone, password });
      if (resLogin.isSuccess) {
        this.router.go('/setUserInfo');
      } else {
        this.message.info(resLogin.info || '网络繁忙,请重试');
      }
    } else {
      this.message.info(res.info);
    }
  }
  navigateToAgreen = () => {
    this.router.go('/AgreenDetail');
  }
  async componentWillMount() {
    const type = this.Enum.htmlTextType.agreen_page;
    const res = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', { type });
    const htmlText = res.isSuccess ? res.data.htmlText : '';
    this.setState({
      agreenShow: !!htmlText,
    });
  }
  getVerifyCode = async () => {
    const { getVerifyCodeElseTime, phone } = this.state;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.valid.phone(phone);
    if (!isCanGetVerifyCode) {
      return;
    }
    // 获取验证码
    const verifyRes = await this.http.webHttp.get('/spreadApi/getVerifyCode', { phone });
    if (!verifyRes.isSuccess) {
      this.message.info(verifyRes.info || '获取验证码失败');
      return;
    }
    this.message.info('验证码已发送');
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
  render() {
    const { pCode, phone, verifyCode, agreenShow, getVerifyCodeElseTime } = this.state;
    // const { companyName } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isShowElseTime = !isCanReGetVerifyCode; // 是否显示剩余时间
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.valid.phone(phone);
    // const hasCode = this.hasCode;
    const btnDisabled = !this.valid.phone(phone) || !verifyCode;
    return (
      <div className={styles.container}>
        <Title>申请代理</Title>
        <Helmet>
          <script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
        </Helmet>
        <NavBar
          title="申请代理"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                value={phone}
                onChange={value => this.setState({ phone: value })}
                placeholder="请输入手机号"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                type="number"
                clear
                maxLength={4}
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
                value={pCode}
                onChange={value => this.setState({ pCode: value })}
                placeholder="请输入代理的邀请码(邀请码绑定后无法更改)"
              />
            </div>
            <div className={styles.btnWrap}>
              <Button
                disabled={btnDisabled}
                style={{ width: '100%' }}
                onClick={this.register}
              >确认</Button>
            </div>
          </div>
          {
            agreenShow &&
            <div className={styles.agreenLabel}>
                注册代表您已阅读并且同意
                <span className={styles.agreenLink} onClick={this.navigateToAgreen}>
                  推广协议
                </span>
            </div>
          }
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

export default connect(mapStateToProps)(Register);
