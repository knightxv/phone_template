import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { WhiteSpace } from 'antd-mobile';

import { province, city } from '../config/position';
import http from '../utils/http';
import { Toast, Title } from '../utils/help';
import { FlexRow, BaseFont, TextInput, BackgroundContainer, Button } from '../utils/styleComponent';
import styles from './AgencyExtractMoney.css';


const options = [
  '中国工商银行', '招商银行', '中国农业银行', '中国银行', '中国建设银行', '中国民生银行', '中国光大银行',
  '中信银行', '交通银行', '兴业银行', '上海浦东发展银行', '中国人民银行', '华夏银行', '深圳发展银行', '广东发展银行',
  '国家开发银行', '中国邮政储蓄银行', '中国进出口银行', '中国农业发展银行', '其他',
];

class AgencyExtractMoney extends React.Component {
  constructor(props) {
    super(props);
    const { bankName, bankOfDeposit, bankCardName, cardNumber, positionName, wechatacc = '' } = props;
    const validPositionName = positionName || ''; // 非空判断防止报错
    if (bankName) {
      // 如果有开户姓名说明已经有改过了
      this.hasCashed = true;
    }
    const defaultSelectProvin = province.filter((item) => {
      return validPositionName.indexOf(item.name) !== -1;
    });
    let defaultProId = 1;
    if (defaultSelectProvin.length > 0) {
      const defaultSelectProvinInfo = defaultSelectProvin[0];
      defaultProId = defaultSelectProvinInfo.ProID;
      this.defaultSelectProvinValue = defaultSelectProvinInfo.name; // 默认选择的省份
      this.defaultSelectCityValue = validPositionName.replace(defaultSelectProvinInfo.name, ''); // 默认选择的市
    }
    this.state = {
      cashCount: '', // 提现金额
      userName: bankCardName, // 开户姓名
      cardNumber, // 卡号
      bankName: '', // 提现银行
      bankOfDeposit, //  银行开户行
      positionName: validPositionName, // 地区
      wechatNumber: wechatacc, // 微信号

      selectProId: defaultProId, // 默认选择的市
    };
    this.bankSelect = { selectedIndex: 0 }; // 银行选择
    this.provinceSelect = null;
    this.citySelect = null;
  }
  cashMoney = async () => {
    const { selectProId } = this.state;
    const bankName = options[this.bankSelect.selectedIndex];
    const provinceName = province[this.provinceSelect.selectedIndex].name;
    const filterCity = city.filter(item => item.ProID === selectProId);
    const cityName = filterCity[this.citySelect.selectedIndex].name;
    const positionName = `${provinceName}${cityName}`;
    const { cashCount, userName, cardNumber, bankOfDeposit, wechatNumber } = this.state;
    if (!cashCount || !userName || !cardNumber || !bankOfDeposit || !wechatNumber) {
      Toast.info('信息填写不完整');
      return false;
    }
    if (cashCount < 100) {
      Toast.info('账户余额未超过100元不允许提现');
      return false;
    }
    const params = {
      cashCount,
      userName,
      cardNumber,
      bankName,
      bankOfDeposit,
      positionName,
      wechatNumber,
      cashType: 2,
    };
    const res = await http.get('/spreadApi/cash', params);
    this.props.dispatch({ type: 'app/updateUserInfo' });
    if (res.isSuccess) {
      Toast.info('提现成功');
      this.setState({
        cashCount: '',
      });
      return false;
    }
    Toast.info(res.message || '提现失败');
  }
  provinceSelectChange = (ev) => {
    const selectProvince = province[ev.target.selectedIndex];
    const selectProId = selectProvince.ProID;
    this.setState({
      selectProId,
    });
  }
  render() {
    const { canCashCount } = this.props;
    const { selectProId, cashCount, userName, cardNumber, bankOfDeposit, bankName, wechatNumber } = this.state;
    const defaultProvin = this.defaultSelectProvinValue; // 默认选择的省份
    const defaultCity = this.defaultSelectCityValue; // 默认选择的市
    const filterCity = city.filter(item => item.ProID === selectProId);
    const unitCanCashCount = parseFloat(canCashCount / 100);
    const isDisabled = !!this.hasCashed;

    return (
      <BackgroundContainer className={styles.container}>
        <Title>余额提现</Title>
        <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div>
        <div className="alignCenterContainer">
          <BaseFont className={styles.canCashTip}>可提现金额：<span className="redColor">{unitCanCashCount}</span></BaseFont>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>提现金额　</BaseFont>
            <TextInput
              onChange={val => this.setState({ cashCount: val })}
              value={cashCount}
              placeholder="请输入提现金额"
            />
          </FlexRow>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>开户姓名　</BaseFont>
            <TextInput
              onChange={val => this.setState({ userName: val })}
              value={userName}
              placeholder="请输入开户姓名"
              maxLength={6}
              disabled={isDisabled}
            />
          </FlexRow>
          <BaseFont className={styles.cashTip}>第一次提现申请成功后，开户姓名将无法更改，请仔细确认！</BaseFont>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>卡号　　　</BaseFont>
            <TextInput
              onChange={val => this.setState({ cardNumber: val })}
              placeholder="请输入卡号"
              value={cardNumber}
            />
          </FlexRow>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>选择银行</BaseFont>
            <select
              className={styles.bankSelect}
              defaultValue={bankName}
              ref={(node) => { this.bankSelect = node; }}
            >
              {
                options.map(value => (
                  <option key={value} value={value}>{value}</option>
                ))
              }
            </select>
          </FlexRow>
          <div className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>选择地区</BaseFont>
            <div>
              <select
                className={styles.select}
                ref={(node) => { this.provinceSelect = node; }}
                onChange={this.provinceSelectChange}
                defaultValue={defaultProvin}
              >
                {
                  province.map(provinceItem => (
                    <option
                      key={provinceItem.ProID}
                      value={provinceItem.name}
                    >
                      {provinceItem.name}
                    </option>
                  ))
                }
              </select>
            </div>
            <div>
              <select
                className={styles.select}
                ref={(node) => { this.citySelect = node; }}
                defaultValue={defaultCity}
              >
                {
                  filterCity.map(cityItem => (
                    <option
                      key={cityItem.CityID}
                      value={cityItem.name}
                    >
                      {cityItem.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>银行开户行</BaseFont>
            <TextInput
              onChange={val => this.setState({ bankOfDeposit: val })}
              placeholder="请输入银行开户行"
              value={bankOfDeposit}
            />
          </FlexRow>
          <FlexRow className={`${styles.inputContainer} G_borderBottom`}>
            <BaseFont className={styles.inputLabel}>微信号　　</BaseFont>
            <TextInput
              onChange={val => this.setState({ wechatNumber: val })}
              placeholder="请输入微信号"
              value={wechatNumber}
            />
          </FlexRow>
          <div className={styles.tip}>工作日：9:00-18:00可提现1次 金额不得低于100元</div>
          <WhiteSpace size="lg" />
          <Button onClick={this.cashMoney}>确认</Button>
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

export default connect(mapStateToProps)(AgencyExtractMoney);
