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
  async componentWillMount() {
    const type = this.Enum.htmlTextType.agreen_page;
    const res = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', { type });
    const htmlText = res.isSuccess ? res.data.htmlText : '';
    this.setState({
      agreenShow: !!htmlText,
    });
  }
  render() {
    const { verifyCode, phone, agreenShow } = this.state;
    const { getVerifyCodeElseTime, companyName } = this.props;
    const isCanReGetVerifyCode = getVerifyCodeElseTime === 0; // 倒计时是否结束
    const isShowElseTime = !isCanReGetVerifyCode; // 是否显示剩余时间
    const isCanGetVerifyCode = isCanReGetVerifyCode && this.checkPhoneValid();
    // const hasCode = this.hasCode;
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
          <div className={styles.inputWrap}>
            <InputItem
              value={verifyCode}
              onChange={value => this.setState({ verifyCode: value })}
              placeholder="请输入短信验证码"
            />
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
  };
}

export default connect(mapStateToProps)(ForgetPassword);
