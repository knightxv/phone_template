import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';

import { Button, InputItem } from '@/helps/antdComponent/index.js';
// import InputItem from '@/helps/antdComponent/InputItem';
import NavBar from '@/helps/antdComponent/NavBar';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './Register.less';

class WechatBindPhone extends BaseComponent {
  constructor(props) {
    super(props);
    const { pCode } = this.router.getQuery();
    this.hasCode = !!pCode;
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
    const res = await this.http.webHttp.get('/spreadApi/wechat/bindPhone',
    { phone, pCode, verifyCode, password, registerProvince, registerCity });
    if (res.isSuccess) {
      const { isNewUser } = res.data;
      if (isNewUser) {
        this.router.go('/setUserInfo');
      } else {
        this.router.go('/homePage');
      }
    } else {
      this.message.info(res.info || '绑定失败');
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
  render() {
    const { pCode, phone, verifyCode, agreenShow, getVerifyCodeElseTime } = this.state;
    // const { companyName } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isShowElseTime = !isCanReGetVerifyCode; // 是否显示剩余时间
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.valid.phone(phone);
    const btnDiabled = !this.valid.phone(phone) || !verifyCode;
    // const hasCode = this.hasCode;
    return (
      <div className={styles.container}>
        <Title>绑定手机</Title>
        <Helmet>
          <script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js" />
        </Helmet>
        <NavBar
          title="绑定手机"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div>
            <div className={styles.inputWrap}>
              <InputItem
                value={phone}
                onChange={value => this.setState({ phone: value })}
                placeholder="请输入手机号"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                type="number"
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
                disabled={this.hasCode}
                value={pCode}
                onChange={value => this.setState({ pCode: value })}
                placeholder="请输入代理的邀请码(已注册账户填写无效)"
              />
            </div>
            <div className={styles.registerWrap}>
              <Button
                disabled={btnDiabled}
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

export default connect()(WechatBindPhone);
