import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';

import { Button, InputItem } from '@/helps/antdComponent/index.js';
// import InputItem from '@/helps/antdComponent/InputItem';
import NavBar from '@/helps/antdComponent/NavBar';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './Register.css';

class Register extends BaseComponent {
  constructor(props) {
    super(props);
    const { code } = this.router.getQuery();
    this.code = code; // 上级代理的邀请码
    this.pid = ''; // 上级代理的id(pid)(暂时没什么用)
    this.hasCode = !!this.code;
    this.state = {
      phone: '',
      pCode: code, // 上级代理邀请码
      verifyCode: '', // 验证码
      agreenShow: false,
    };
  }
  // 得到验证码
  getVerifyCode = async () => {
    const { getVerifyCodeElseTime } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0;
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.checkPhoneValid();
    if (!isCanGetVerifyCode) {
      return false;
    }
    // this.props.dispatch({ type: 'app/getVerifyCode' });
    const { phone } = this.state;
    const res = await this.http.webHttp.get('/spreadApi/getVerifyCode', { phone });
    if (res.isSuccess) {
      this.props.dispatch({ type: 'agent/getVerifyCode' });
      this.message.info('验证码已发送，请查收');
    } else {
      this.message.info(res.info || '验证码失败，请重试');
    }
  }
  // 检查手机是否合法
  checkPhoneValid = () => {
    const phone = this.state.phone;
    return /^1[34578]\d{9}$/.test(phone);
  }
  // 注册
  register = async () => {
    const { phone, verifyCode, pCode } = this.state;
    const pid = this.pid;
    if (!verifyCode) {
      this.message.info('请输入验证码');
      return false;
    }
    const ipInfo = window.remote_ip_info;
    const registerProvince = ipInfo ? `${ipInfo.province}省` : '';
    const registerCity = ipInfo ? `${ipInfo.city}市` : '';
    const password = 123456; // 默认密码
    let res;
    if (pid) {
      res = await this.http.webHttp.get('/spreadApi/register',
      { phone, pid, pCode, verifyCode, password, registerProvince, registerCity });
    } else {
      res = await this.http.webHttp.get('/spreadApi/register',
      { phone, pCode, verifyCode, password, registerProvince, registerCity });
    }
    if (res.isSuccess) {
      // Toast.info('注册成功');
      const resLogin = await this.http.webHttp.get('/spreadApi/login', { loginID: phone, password });
      if (resLogin.isSuccess) {
        window.alert('初始密码默认为：123456');
        this.router.go('/homePage')
      } else {
        this.message.toast(resLogin.info || '登录失败');
      }
    } else {
      this.message.toast(res.info);
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
  render() {
    const { pCode, phone, verifyCode, agreenShow } = this.state;
    const { getVerifyCodeElseTime, companyName } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isShowElseTime = !isCanReGetVerifyCode; // 是否显示剩余时间
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.checkPhoneValid();
    // const hasCode = this.hasCode;
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
          <div className={styles.inputWrap}>
            <InputItem
              value={phone}
              onChange={value => this.setState({ phone: value })}
              placeholder="将作为登录账号"
            >手机号:</InputItem>
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              value={pCode}
              onChange={value => this.setState({ pCode: value })}
              placeholder="请输入推荐人邀请码"
            >邀请码:</InputItem>
          </div>
          <div className={styles.inputWrap}>
            <InputItem
              type="number"
              maxLength={4}
              value={verifyCode}
              onChange={value => this.setState({ verifyCode: value })}
              placeholder="请输入验证码"
              extra={<div
                 className={classnames({ [styles.verifyCodeBtn]: true, [styles.verifyCodeDisable]: !isCanGetVerifyCode })}
                onClick={this.getVerifyCode}
              >
                { !isShowElseTime ? '获取验证码' : `剩余${getVerifyCodeElseTime}` }
              </div>}
            >验证码:</InputItem>
          </div>
          <div className={styles.registerWrap}>
            {
              agreenShow &&
              <div className={styles.agreenLabel}>
                点击注册,即表明同意<span className={styles.agreenLink} onClick={this.navigateToAgreen}>代理推广协议</span>
              </div>
            }
            <Button
              style={{ width: '100%' }}
              onClick={this.register}
            >申请代理</Button>
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.25rem', paddingTop: 16 }}>{companyName}</div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    ...state.agent,
    ...state.app,
  };
}

export default connect(mapStateToProps)(Register);
