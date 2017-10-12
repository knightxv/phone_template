import React from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'antd-mobile';
import { Helmet } from 'react-helmet';

import { Button, Input } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { BaseFont, FlexRow, NavTitle, Title } from '@/helps/styleComponent';
import styles from './Register.css';


//  /*
//         获取验证码
//         @query : phone[string]电话号码
//     */
//     'POST /phone/getVerifyCode': {
//       status: 'success',
//       Msg: '',
//       data: null,
//   },

class Register extends BaseComponent {
  constructor(props) {
    super(props);
    const { code } = this.helps.querystring.parse(this.props.location.search.substr(1));
    this.code = code; // 上级代理的id
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
    const res = await this.helps.webHttp.get('/spreadApi/getVerifyCode', { phone });
    if (res.isSuccess) {
      this.props.dispatch({ type: 'agent/getVerifyCode' });
      this.helps.toast('验证码已发送，请查收');
    } else {
      this.helps.toast(res.info || '验证码失败，请重试');
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
      this.helps.toast('请同意阿当科技推广协议');
      return false;
    }
    if (!phone || !verifyCode) {
      this.helps.toast('请完善信息填写');
      return false;
    }
    if (!window.remote_ip_info) {
      this.helps.toast('申请失败，请重试');
      return false;
    }
    const { province, city } = window.remote_ip_info;
    const registerProvince = `${province}省`;
    const registerCity = `${city}市`;
    const password = 123456; // 默认密码
    let res;
    if (pid) {
      res = await this.helps.webHttp.get('/spreadApi/register',
      { phone, pid, pCode, wechatCode, verifyCode, password, registerProvince, registerCity });
    } else {
      res = await this.helps.webHttp.get('/spreadApi/register',
      { phone, pCode, wechatCode, verifyCode, password, registerProvince, registerCity });
    }
    if (res.isSuccess) {
      // Toast.info('注册成功');
      const resLogin = await this.helps.webHttp.get('/spreadApi/login', { loginID: phone, password });
      if (resLogin.isSuccess) {
        window.alert('初始密码默认为：123456');
        this.props.dispatch(this.helps.routerRedux.push('/homePage'));
      } else {
        this.helps.toast(resLogin.info || '登录失败');
      }
    } else {
      this.helps.toast(res.info);
    }
  }
  navigateToAgreen = () => {
    this.props.dispatch(this.helps.routerRedux.push('/AgreenDetail'));
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
      <div className="alignCenterContainer">
        <Title>申请代理</Title>
        <Helmet>
          <script src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>
        </Helmet>
        <div className={styles.container}>
          <NavTitle>申请代理</NavTitle>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>联系电话：　</BaseFont>
            <Input
              onChange={ev => this.setState({ phone: ev.target.value })}
              placeholder="将作为登录账号"
            />
          </FlexRow>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>上级邀请码：</BaseFont>
            <Input
              disabled={hasCode}
              value={pCode}
              onChange={ev => this.setState({ pCode: ev.target.value })}
              placeholder="介绍人代理邀请码"
            />
          </FlexRow>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>微信号：　　</BaseFont>
            <Input
              onChange={ev => this.setState({ wechatCode: ev.target.value })}
              placeholder="便于充值提现等疑问解答"
            />
          </FlexRow>
          <WhiteSpace size="md" />
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>验证码：　　</BaseFont>
            <Input
              onChange={ev => this.setState({ verifyCode: ev.target.value })}
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
            style={{ width: '100%' }}
            onClick={this.register}
          >申请代理</Button>
          <BaseFont style={{ textAlign: 'center', fontSize: '0.25rem', paddingTop: 16 }}>厦门当当猫网络科技有限公司</BaseFont>
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
