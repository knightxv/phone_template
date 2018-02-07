import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import BaseComponent from '@/core/BaseComponent';
import { InputItem, Button, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './CashMoney.less';

class AgencyExtractMoney extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      cashTip: '注:每天最多提现1次,工作日24小时内到账,节假日可能会延期,提现异常请咨询客服,微信号:xxxxx',
      cashMoney: '', // 提现金额
      bankCardName: '',
      cardNumber: '',
      userName: '',
      wecahtNumber: '',
    };
  }
  async componentWillMount() {
    const cashInfoRes = await this.http.webHttp.get('/spreadApi/cash/getCashInfo');
    if (cashInfoRes.isSuccess) {
      this.setState({
        ...cashInfoRes.data,
      });
    }
    const { cashTip } = this.Enum.htmlTextType;
    const res = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', {
      type: cashTip,
    });
    if (res.isSuccess) {
      this.setState({
        cashTip: res.data.htmlText,
      });
    }
  }
  // 提现
  cashMoeny = async () => {
    const {
      cashMoney,
      bankCardName,
      cardNumber,
      userName,
      wecahtNumber,
     } = this.state;
    if (!cardNumber || !bankCardName || !userName) {
      this.message.info('卡号和姓名不能为空');
      return;
    }
    if (!cashMoney || isNaN(cashMoney) || !/^\d+(\.\d{1,2})?$/.test(cashMoney)) {
      this.message.info('输入的提现金额格式错误');
      return false;
    }
    const params = {
      cashCount: cashMoney,
      wecahtNumber,
      cardNumber,
      userName,
      bankName: bankCardName,
      bankOfDeposit: bankCardName,
    };
    const res = await this.http.webHttp.get('/spreadApi/cash', params);
    if (res.isSuccess) {
      this.message.info(res.info || '提现成功');
      this.router.back();
    } else {
      this.message.info(res.info);
      // 更新用户数据
      const updateRes = await this.http.webHttp.get('/spreadApi/getUserInfo');
      if (updateRes.isSuccess) {
        this.props.dispatch({ type: 'agent/updateAppInfo', payload: { ...updateRes.data } });
      }
    }
  }
  // 修改银行卡信息
  editBankInfo = () => {
    this.router.go('/cashInfo');
  }
  render() {
    const {
      cashTip,
      cashMoney,
      bankCardName,
      cardNumber,
      userName,
    } = this.state;
    const cashInfoValid = !!bankCardName && !!cardNumber && !!userName;
    const btnDisabled = !cashInfoValid || !cashMoney;
    const { canCashCount } = this.props;
    const canCashCountLabel = this.helps.parseFloatMoney(canCashCount);
    return (
      <div className={styles.container}>
        <Title>提现</Title>
        <NavBar
          title="提现"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div>
            <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
              <div className={styles.bankInfoWrap}>
                <div>到银行卡</div>
                {
                  <div className={styles.cashInfoLabel} onClick={this.editBankInfo}>
                    {
                      cashInfoValid ? `${bankCardName}(${cardNumber.substr(-4, 4)})` : '添加银行卡'
                    }
                  </div>
                }
              </div>
              <div className={styles.inputWrap}>
                <div>￥</div>
                <InputItem
                  clear
                  className={styles.cashInput}
                  value={cashMoney}
                  onChange={value => this.setState({ cashMoney: value })}
                  placeholder="请输入提现金额"
                />
              </div>
              <div className={styles.banlance}>
                账户余额<span className={styles.banlanceCount}>{canCashCountLabel}元</span>(余额数量低于100元不可提取)
              </div>
              <div className={styles.btnWrap}>
                <Button
                  disabled={btnDisabled}
                  onClick={this.cashMoeny}
                >提现</Button>
              </div>
            </div>
            {
              cashTip &&
              <div className={styles.cashTip} dangerouslySetInnerHTML={this.helps.createMarkup(cashTip)} />
            }
          </div>
          <div className={styles.btnWrap}>
            <Button
              type="green"
              onClick={() => this.router.go('cashRecord')}
            >提现记录</Button>
          </div>
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

export default connect(mapStateToProps)(AgencyExtractMoney);


/*
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
*/
