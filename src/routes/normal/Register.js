import React from 'react';
import { connect } from 'dva';
import { WingBlank, WhiteSpace } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import styles from './Register.css';

import http from '../utils/http';
import { Toast, Title } from '../utils/help';

import { NavTitle, BackgroundContainer, TextInput, Button, BaseFont, FlexRow } from '../utils/styleComponent';


//  /*
//         获取验证码
//         @query : phone[string]电话号码
//     */
//     'POST /phone/getVerifyCode': {
//       status: 'success',
//       Msg: '',
//       data: null,
//   },

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.code = this.props.location.query.code; // 上级代理的id
    this.hasCode = !!this.code;
    this.state = {
      phone: '',
      pCode: '', // 上级代理邀请码
      wechatCode: '', // 微信号
      verifyCode: '', // 验证码
      isAgreen: true,
    };
  }
  async componentWillMount() {
    if (this.code) {
      const res = await http.get('/spreadApi/getinveteCodeById', { id: this.code });
      if (res.isSuccess) {
        const pCode = res.data.pCode;
        this.setState({
          pCode,
        });
      } else {
        Toast.info(res.info);
      }
    }
    document.addEventListener('keydown', this.enterKey, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.enterKey, false);
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
    const res = await http.get('/spreadApi/getVerifyCode', { phone });
    if (res.isSuccess) {
      this.props.dispatch({ type: 'app/getVerifyCode' });
      Toast.info('验证码已发送，请查收');
    } else {
      Toast.info(res.message || '验证码失败，请重试');
    }
  }
  enterKey = (ev) => {
    if (ev.key === 'Enter') {
      this.register();
    }
  }
  // 检查手机是否合法
  checkPhoneValid = () => {
    const phone = this.state.phone;
    return /^1[34578]\d{9}$/.test(phone);
  }
  // 注册
  register = async () => {
    const { phone, wechatCode, verifyCode, isAgreen, pCode } = this.state;
    const pid = this.code;
    if (!isAgreen) {
      Toast.info('请同意阿当科技推广协议');
      return false;
    }
    if (!phone || !verifyCode) {
      Toast.info('请完善信息填写');
      return false;
    }
    const password = 123456; // 默认密码
    let res;
    if (pid) {
      res = await http.get('/spreadApi/register', { phone, pid, pCode, wechatCode, verifyCode, password });
    } else {
      res = await http.get('/spreadApi/register', { phone, pCode, wechatCode, verifyCode, password });
    }
    if (res.isSuccess) {
      // Toast.info('注册成功');
      const resLogin = await http.get('/spreadApi/login', { loginID: phone, password });
      if (resLogin.isSuccess) {
        alert('初始密码默认为：123456');
        this.props.dispatch(routerRedux.push('/homePage'));
      } else {
        Toast.info(resLogin.message || '登录失败');
      }
    } else {
      Toast.info(res.message);
    }
  }
  navigateToAgreen = () => {
    this.props.dispatch(routerRedux.push('/AgreenDetail'));
  }
  toggleAgreen = () => {
    this.setState({
      isAgreen: !this.state.isAgreen,
    });
  }
  render() {
    const { pCode, isAgreen } = this.state;
    const { getVerifyCodeElseTime } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isShowElseTime = !isCanReGetVerifyCode; // 是否显示剩余时间
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.checkPhoneValid();
    const hasCode = this.hasCode;
    return (
      <BackgroundContainer>
        <Title>申请代理</Title>
        <div className={styles.container}>
          <NavTitle>申请代理</NavTitle>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>联系电话：　</BaseFont>
            <TextInput
              onChange={val => this.setState({ phone: val })}
              placeholder="将作为登录账号"
            />
          </FlexRow>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>上级邀请码：</BaseFont>
            <TextInput
              disabled={hasCode}
              value={pCode}
              onChange={val => this.setState({ pCode: val })}
              placeholder="介绍人代理邀请码"
            />
          </FlexRow>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>微信号：　　</BaseFont>
            <TextInput
              onChange={val => this.setState({ wechatCode: val })}
              placeholder="便于充值提现等疑问解答"
            />
          </FlexRow>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>验证码：　　</BaseFont>
            <TextInput
              onChange={val => this.setState({ verifyCode: val })}
              placeholder="请输入验证码"
            />
            <Button
              disabled={!isCanGetVerifyCode}
              className={styles.verifyCodeBtn}
              onClick={this.getVerifyCode}
            >
              { !isShowElseTime ? '点击获取' : `剩余${getVerifyCodeElseTime}` }
            </Button>
          </FlexRow>
          <WhiteSpace size="md" />
          <div className={styles.agreenWrap}>
            <input className={styles.checkbox} type="checkbox" onClick={this.toggleAgreen} checked={isAgreen} />
            <BaseFont onClick={this.navigateToAgreen} className={styles.ageenBtn}>&lt;当当猫科技推广协议&gt;</BaseFont>
          </div>
          <WhiteSpace size="md" />
          <Button
            onClick={this.register}
          >申请代理</Button>
          <BaseFont style={{ textAlign: 'center', fontSize: '0.25rem', paddingTop: 16 }}>厦门当当猫网络科技有限公司</BaseFont>
        </div>
      </BackgroundContainer>
    );
  }
}


function mapStateToProps(state) {
  return {
    ...state.app,
  };
}

export default connect(mapStateToProps)(Register);
