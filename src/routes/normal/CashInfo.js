import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { List } from 'antd-mobile';

import bankData from '@/data/bank';
import BaseComponent from '@/core/BaseComponent';
import { InputItem, Button, NavBar, SelectPicker } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './CashInfo.less';

class CashInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.bankDataSelect = bankData.map(val => ({
      label: val,
      value: val,
    }));
    this.state = {
      bankCardName: '',
      cardNumber: '',
      userName: '',
      wechatNumber: '',
    };
  }
  async componentWillMount() {
    const cashInfoRes = await this.http.webHttp.get('/spreadApi/cash/getCashInfo');
    if (cashInfoRes.isSuccess) {
      const cashInfo = cashInfoRes.data;
      const { bankCardName } = cashInfo;
      // 查看所填的银行是否在所填的范围内，否则就选择默认的
      let defaultBankName = this.bankDataSelect[0].value;
      this.bankDataSelect.some((bank) => {
        if (bank.value === bankCardName) {
          defaultBankName = bankCardName;
          return true;
        } else {
          return false;
        }
      });
      this.setState({
        ...cashInfo,
        bankCardName: defaultBankName,
      });
    }
  }
  saveCashInfo = async () => {
    const {
      bankCardName,
      cardNumber,
      userName,
      wechatNumber,
    } = this.state;
    const cashInfoRes = await this.http.webHttp.get('/spreadApi/cash/editCashInfo', {
      bankCardName,
      cardNumber,
      userName,
      wechatNumber,
    });
    if (cashInfoRes.isSuccess) {
      this.message.info(cashInfoRes.info || '保存成功');
      this.router.back();
    } else {
      this.message.info(cashInfoRes.info || '保存失败');
    }
  }
  selectBankChange = (val) => {
    this.setState({
      bankCardName: val[0],
    });
  }
  render() {
    const {
      bankCardName,
      cardNumber,
      userName,
      wechatNumber,
    } = this.state;
    const btnDisabled = !bankCardName || !cardNumber || !userName;
    return (
      <div>
        <Title>填写银行卡信息</Title>
        <NavBar
          title="填写银行卡信息"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
            <div className={styles.inputWrap}>
              <SelectPicker
                value={[bankCardName]}
                data={this.bankDataSelect}
                title="选择银行类型"
                onChange={this.selectBankChange}
                cols={1}
              >
                <List.Item arrow="horizontal" className={styles.itemWrap}>请选择银行</List.Item>
              </SelectPicker>
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                value={cardNumber}
                onChange={value => this.setState({ cardNumber: value })}
                placeholder="请输入银行卡号"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                value={userName}
                onChange={value => this.setState({ userName: value })}
                placeholder="请输入开户姓名"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                value={wechatNumber}
                onChange={value => this.setState({ wechatNumber: value })}
                placeholder="请输入您的微信号"
              />
            </div>
            <div className={styles.cashInfoTip}>若因信息错误无法提现，客服将主动联系您</div>
            <Button
              disabled={btnDisabled}
              onClick={this.saveCashInfo}
            >保存</Button>
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

export default connect(mapStateToProps)(CashInfo);
