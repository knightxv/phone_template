import React from 'react';
import { connect } from 'dva';
import BaseComponent from '@/core/BaseComponent';

import { province as provinceData, city as cityData } from '@/data/position';
import styles from './CashMoeny.css';
import NavBar from '@/components/antdComponent/NavBar';
import Button from '@/components/antdComponent/Button';
import InputItem from '@/components/antdComponent/InputItem';
import { FlexRow, Flex, WhiteSpace, Title } from '@/components/styleComponent';

import { Select } from '@/helps/antdComponent';

import bankData from '../../data/bank';

const Option = Select.Option;

class CashMoeny extends BaseComponent {
  constructor(props) {
    super(props);
    const {
      wechat_acc, // 提现所用的微信号
      positionName, // 位置
      cardNumber, // 银行卡号
      bankCardName, // 银行卡名字
      bankName, // 银行
      bankOfDeposit, // 开户银行
     } = props;
    const defaultPosition = positionName || '北京市 北京市';
    const defaultPositionArr = defaultPosition.split(' ');
    if (defaultPositionArr.length < 2) {
      this.defaultProvince = '北京市';
      this.defaultCity = '北京市';
    } else {
      this.defaultProvince = defaultPositionArr[0];
      this.defaultCity = defaultPositionArr[1];
    }
    const initBankName = bankName || bankData[0];
    this.state = {
      wechat_acc, // 提现所用的微信号
      cardNumber, // 银行卡号
      bankCardName, // 银行卡名字
      bankName: initBankName, // 银行
      bankOfDeposit, // 开户银行
      province: this.defaultProvince,
      city: this.defaultCity,
      cashCount: '',
      selectProId: this.getProIdByProName(this.defaultProvince), // 选择省份的id
    };
  }
  handleBankSelectChange = (val) => {
    this.setState({
      bankName: val,
    });
  }
  handleProvinceSelectChange = (val) => {
    const selectProId = this.getProIdByProName(val);
    const filterCity = cityData.filter((item) => {
      return item.ProID === selectProId;
    });
    this.setState({
      province: val,
      selectProId,
      city: [filterCity[0].name],
    });
  }
  // 通过省级名称得到id
  getProIdByProName = (val) => {
    let proID = 1;
    for (let index = 0; index < provinceData.length; index++) {
      const element = provinceData[index];
      if (element.name === val) {
        proID = element.ProID;
        break;
      }
    }
    return proID;
  }
  handleCitySelectChange = (val) => {
    this.setState({
      city: [val],
    });
  }
  // 提现
  cashMoeny = async () => {
    const { wechat_acc, province, city, cardNumber, bankCardName, bankName, bankOfDeposit, cashCount } = this.state;
    const positionName = `${province} ${city}`;
    const params = {
      bankName,
      userName: bankCardName,
      cardNumber,
      bankOfDeposit,
      positionName,
      wechatNumber: wechat_acc,
      cashCount,
    };
    if (isNaN(cashCount) && !/^\d(\.\d{1,2})?$/.test(cashCount)) {
      this.message.info('输入的提现金额格式错误');
      return false;
    }
    const res = await this.http.webHttp.get('/spreadApi/general/cash', params);
    if (res.isSuccess) {
      this.router.back();
      this.message.info(res.info || '提现成功');
    } else {
      this.message.info(res.info);
    }
    // 更新用户数据
    const updateRes = await this.http.webHttp.get('/spreadApi/general/getUserInfo');
    if (updateRes.isSuccess) {
      this.props.dispatch({ type: 'general/updateInfo', payload: { ...updateRes.data } });
    }
  }
  render() {
    const { wechat_acc: wechatAcc, cardNumber, bankCardName, province, city, bankName, bankOfDeposit, cashCount, selectProId } = this.state;
    const filterCity = cityData.filter((item) => {
      return item.ProID === selectProId;
    });
    const { canCashCount } = this.props;
    const canCashCountFloat = parseFloat(canCashCount / 100).toFixed(2);
    return (
      <div>
        <Title>提现</Title>
        <NavBar
          title="提现"
          onClick={this.router.back}
        />
        <WhiteSpace />
        <FlexRow className={styles.itemWrap}>
          <p className={styles.label}>微信号　</p>
          <InputItem
            placeholder="请输入微信号"
            onChange={value => this.setState({ wechat_acc: value })}
            value={wechatAcc}
          />
        </FlexRow>
        <WhiteSpace />
        <FlexRow className={styles.itemWrap}>
          <p className={styles.label}>银行　　</p>
          <Select
            value={bankName}
            style={{ width: 120 }}
            onChange={this.handleBankSelectChange}
          >
            {
              bankData.map(bankVal => (
                <Option key={bankVal} value={bankVal}>{bankVal}</Option>
              ))
            }
          </Select>
        </FlexRow>
        <FlexRow className={styles.itemWrap}>
          <p className={styles.label}>城市　　</p>
          <Select
            value={province}
            style={{ width: 120 }}
            placeholder="请选择省份"
            onChange={this.handleProvinceSelectChange}
          >
          {
            provinceData.map(item => (
              <Option key={item.ProID} value={item.name}>{item.name}</Option>
            ))
          }
          </Select>
          <Select
            value={city}
            style={{ width: 120 }}
            onChange={this.handleCitySelectChange}
          >
          {
            filterCity.map(item => (
              <Option key={item.CityID} value={item.name}>{item.name}</Option>
            ))
          }
          </Select>
        </FlexRow>
        <FlexRow className={styles.itemWrap}>
          <p className={styles.label}>卡号　　</p>
          <InputItem
            placeholder="请输入银行卡号"
            onChange={value => this.setState({ cardNumber: value })}
            value={cardNumber}
          />
        </FlexRow>
        <FlexRow className={styles.itemWrap}>
          <p className={styles.label}>姓名　　</p>
          <InputItem
            placeholder="请输入姓名"
            onChange={value => this.setState({ bankCardName: value })}
            value={bankCardName}
          />
        </FlexRow>
        <FlexRow className={styles.itemWrap}>
          <p className={styles.label}>开户银行</p>
          <InputItem
            placeholder="请输入开户银行"
            onChange={value => this.setState({ bankOfDeposit: value })}
            value={bankOfDeposit}
          />
        </FlexRow>
        <WhiteSpace />
        <div className={styles.itemWrap}>
          <p className={styles.label}>提现金额</p>
          <FlexRow>
            <p className={styles.label}>￥:</p>
            <InputItem
              placeholder="请输入提现金额"
              onChange={value => this.setState({ cashCount: value})}
              value={cashCount}
            />
          </FlexRow>
          <p className={styles.tip}>账号金额<span className="moneyColor">{canCashCountFloat}元</span>(金额低于100元不可提取)</p>
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
        <p className={styles.countTip}>每天做多可提现一次，48小时内到账</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.general,
  };
}

export default connect(mapStateToProps)(CashMoeny);
