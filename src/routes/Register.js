import React from 'react';
import { connect } from 'dva';
import styles from './Register.css';
import BaseComponent from '../helps/BaseComponent';
import { Input, Button } from '../helps/antdComponent';
import { Title, WingBlank, IconImg, WhiteSpace, FlexRow } from '../helps/styleComponent';

const logoSource = require('../assets/adang_logo.png');

class Register extends BaseComponent {
  constructor(props) {
    super(props);
    const search = this.props.location.search.replace('?', '');
    const searchQuery = this.helps.queryString.parse(search);
    this.code = searchQuery.code || ''; // 上级代理的id
    this.hasCode = !!this.code;
    this.state = {
      registerLoading: false, // 是否在登录等待

      verifyCode: '',
      wechat_acc: '',
      phone: '',
    };
  }
  async componentWillMount() {
    if (this.code) {
      const res = await this.helps.webHttp.get('/spreadApi/getinveteCodeById', { id: this.code });
      if (res.isSuccess) {
        const pCode = res.data.pCode;
        this.setState({
          pCode,
        });
      } else {
        this.helps.toast(res.info);
      }
    }
  }
  // 校验上传的数据(只做非空判断)
  validFormDataValid = () => {
    const { wechat_acc: wechatCode, verifyCode, phone } = this.state;
    if (!wechatCode || !verifyCode || !phone) {
      return false;
    }
    return true;
  }
  // 注册
  register = async () => {
    this.setState({
      registerLoading: true,
    });
    const { wechat_acc, verifyCode, phone, pCode } = this.state;
    const params = {
      phone,
      pCode,
      wechatCode: wechat_acc,
      verifyCode,
    };
    // 发送注册请求
    const res = await this.helps.webHttp.get('/spreadApi/register', params);
    this.setState({
      registerLoading: false,
    });
    if (res.isSuccess) {
      alert('初始密码为：123456');
      this.props.dispatch(this.helps.routerRedux.push('/homePage'));
    } else {
      this.helps.toast(res.info);
    }
  }
  // 拿到验证码
  getVerifyCode = async () => {
    const { phone } = this.state;
    const res = await this.helps.webHttp.get('/spreadApi/getVerifyCode', { phone });
    if (res.isSuccess) {
      this.props.dispatch({ type: 'general/getVerifyCode' });
      this.helps.toast('验证码已发送，请查收');
    } else {
      this.helps.toast(res.message || '验证码失败，请重试');
    }
  }
  checkPhoneValid = () => {
    const phone = this.state.phone;
    return /^1[34578]\d{9}$/.test(phone);
  }
  render() {
    const { registerLoading, pCode, wechat_acc: wechatCode } = this.state;
    const { getVerifyCodeElseTime } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isShowElseTime = !isCanReGetVerifyCode; // 是否显示剩余时间
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.checkPhoneValid();
    return (
      <div className="alignCenterContainer">
        <Title>阿当比鸡代理申请</Title>
        <div className="contentContainer">
          <div className={styles.registerWrap}>
            <IconImg className={styles.logo} src={logoSource} />
            <span className={styles.logoTitle}>阿当比鸡代理申请</span>
          </div>
          <div>
            <FlexRow className={styles.registerInput}>
              <span>手机号：　　</span>
              <Input
                onChange={event => this.setState({ phone: event.target.value })}
                placeholder="请输入手机号码(账号)"
              />
            </FlexRow>
            <FlexRow className={styles.registerInput}>
              <span>微信号：　　</span>
              <Input
                placeholder="请输入微信号"
                value={wechatCode}
                onChange={event => this.setState({ wechat_acc: event.target.value })}
              />
            </FlexRow>
            <FlexRow className={styles.registerInput}>
              <span>上级邀请码：</span>
              <Input
                onChange={event => this.setState({ pCode: event.target.value })}
                placeholder="上级邀请码"
                disabled={!!this.hasCode}
                value={pCode}
              />
            </FlexRow>
            <FlexRow className={styles.registerInput}>
              <span>验证码：　　</span>
              <Input
                placeholder="请输入验证码"
                onPressEnter={this.login}
                onChange={event => this.setState({ verifyCode: event.target.value })}
              />
              <Button
                disabled={!isCanGetVerifyCode}
                className={styles.verifyBtn}
                onClick={this.getVerifyCode}
              >
                { !isShowElseTime ? '点击获取' : `剩余${getVerifyCodeElseTime}` }
              </Button>
            </FlexRow>
          </div>
          <WhiteSpace />
          <Button
            className={styles.registerBtn}
            loading={registerLoading}
            onClick={this.register}
            disabled={!this.validFormDataValid()}
          >
          申请代理</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.general,
  };
}

export default connect(mapStateToProps)(Register);
