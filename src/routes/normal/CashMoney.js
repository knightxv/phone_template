import React from 'react';
import { connect } from 'dva';

import { region } from '@/data/region';
import { InputItem, Button, NavBar, SelectPicker, List } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { FlexRow, Flex, WhiteSpace, Title } from '@/helps/styleComponent';
import bankData from '@/data/bank';

import styles from './CashMoney.css';


class AgencyExtractMoney extends BaseComponent {
  constructor(props) {
    super(props);
    const {
      wechat_acc, // 提现所用的微信号
      positionName, // 位置
      cardNumber, // 银行卡号
      bankCardName, // 名字
      bankName, // 银行
      bankOfDeposit, // 开户银行

     } = props;
    //  const positionName = 'df';
    this.bankDataSelect = bankData.map(val => ({
      label: val,
      value: val,
    }));
    this.positionDataSelect = region;
    // 查看所填的城市是否在列表里，否则就选择默认的
    let defaultPosition = [this.positionDataSelect[0].value, this.positionDataSelect[0].children[0].value];
    if (positionName) {
      const positionArr = positionName.split(' ');
      if (positionArr.length === 2) {
        const pro = positionArr[0];
        const city = positionArr[1];
        this.positionDataSelect.some((position) => {
          if (position.value === pro) {
            position.children.some((cityPos) => {
              if (cityPos.value === city) {
                defaultPosition = [pro, city];
                return true;
              }
              return false;
            });
            return true;
          }
          return false;
        });
      }
      // defaultPosition = positionArr;
    }
    // 查看所填的银行是否在所填的范围内，否则就选择默认的
    let defaultBankName = this.bankDataSelect[0].value;
    this.bankDataSelect.some((bank) => {
      if (bank.value === bankName) {
        defaultBankName = bankName;
        return true;
      } else {
        return false;
      }
    });
    this.state = {
      wechat_acc: wechat_acc || '', // 提现所用的微信号
      cardNumber, // 银行卡号
      bankCardName, // 名字
      bankName: [defaultBankName], // 银行
      bankOfDeposit, // 开户银行
      cashCount: '',
      positionSelect: defaultPosition,
    };
  }
  // 提现
  cashMoeny = async () => {
    const { wechat_acc, positionSelect, cardNumber, bankCardName, bankName, bankOfDeposit, cashCount } = this.state;
    const positionName = positionSelect.join(' ');
    const params = {
      bankName: bankName[0],
      userName: bankCardName,
      cardNumber,
      bankOfDeposit,
      positionName,
      wechatNumber: wechat_acc,
      cashCount,
    };
    if (!cashCount || isNaN(cashCount) || !/^\d+(\.\d{1,2})?$/.test(cashCount)) {
      this.helps.toast('输入的提现金额格式错误');
      return false;
    }
    const res = await this.helps.webHttp.get('/spreadApi/cash', params);
    if (res.isSuccess) {
      this.helps.toast(res.info || '提现成功');
      this.props.dispatch(this.helps.routerRedux.goBack());
    } else {
      this.helps.toast(res.info);
    }
    // 更新用户数据
    const updateRes = await this.helps.webHttp.get('/spreadApi/getUserInfo');
    if (updateRes.isSuccess) {
      this.props.dispatch({ type: 'agent/updateAppInfo', payload: { ...updateRes.data } });
    }
  }
  // 选择银行
  selectBankChange = (val) => {
    this.setState({
      bankName: val,
    });
  }
  // 选择城市
  selectCityChange = (val) => {
    this.setState({
      positionSelect: val,
    });
  }
  render() {
    const { wechat_acc: wechatAcc, cardNumber, bankCardName, positionSelect, bankName, bankOfDeposit, cashCount } = this.state;
    const { canCashCount } = this.props;
    const canCashCountFloat = parseFloat(canCashCount / 100).toFixed(2);
    return (
      <div>
        <Title>提现</Title>
        <NavBar
          title="提现"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <WhiteSpace />
        <SelectPicker
          value={bankName}
          data={this.bankDataSelect}
          title="选择交易类型"
          onChange={this.selectBankChange}
          cols={1}
        >
          <List.Item arrow="horizontal" className={styles.itemWrap}>银行</List.Item>
        </SelectPicker>
        <WhiteSpace />
        <SelectPicker
          value={positionSelect}
          data={this.positionDataSelect}
          title="选择城市"
          onChange={this.selectCityChange}
          cols={2}
        >
          <List.Item arrow="horizontal" className={styles.itemWrap}>城市</List.Item>
        </SelectPicker>
        <WhiteSpace />
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入银行卡号"
            onChange={val => this.setState({ cardNumber: val })}
            value={cardNumber}
          >
            <div>卡号</div>
          </InputItem>
        </div>
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入微信号"
            onChange={value => this.setState({ wechat_acc: value })}
            value={wechatAcc}
          >
            <div>微信号</div>
          </InputItem>
        </div>
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入姓名"
            onChange={val => this.setState({ bankCardName: val })}
            value={bankCardName}
          >
            <div>姓名</div>
          </InputItem>
        </div>
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入开户银行"
            onChange={val => this.setState({ bankOfDeposit: val })}
            value={bankOfDeposit}
          >
            <div>开户银行</div>
          </InputItem>
        </div>
        <WhiteSpace />
        <div className={styles.itemCashWrap}>
          <p className={styles.label}>提现金额</p>
          <FlexRow>
            <p className={styles.moenyPreLabel}>￥:</p>
            <InputItem
              placeholder="请输入提现金额"
              onChange={val => this.setState({ cashCount: val })}
              value={cashCount}
            />
          </FlexRow>
          <p className={styles.tip}>
            账号金额<span className={styles.moneyCount}>{canCashCountFloat}元</span>(金额低于100元不可提取)
          </p>
        </div>
        <Flex>
          <Button
            className={styles.cashBtn}
            onClick={this.cashMoeny}
            size="large"
          >
          确认提取
          </Button>
        </Flex>
        <p className={styles.countTip}>每天最多提现一次,工作日24小时内到账,节假日可能会延期</p>
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
