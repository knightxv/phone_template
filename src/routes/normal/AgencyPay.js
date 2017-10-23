import React from 'react';
import { connect } from 'dva';

import { Button, NavBar, SelectPicker, List } from '@/helps/antdComponent';
import { BaseFont, Title, WhiteSpace } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './AgencyPay.css';

// const goodsIds = [1, 2, 3, 4, 5, 6];
// const goodsSourceArr = goodsIds.map(index => require(`../resource/shop/${index}.png`));

class AgencyPay extends BaseComponent {
  constructor(props) {
    super(props);
    this.payEnum = this.helps.payEnum;
    const { WECHAT, ALI } = this.payEnum;
    this.state = {
      goods: [],
      selectPayTypeVal: [WECHAT],
    };
    this.marsonryPayType = [
      { value: WECHAT, label: '微信支付' },
      { value: ALI, label: '支付宝支付' },
      { value: '余额支付', label: '余额支付' },
    ];
    if (this.helps.isWeixinBrowser()) {
      this.marsonryPayType = [
        { value: WECHAT, label: '微信支付' },
        { value: '余额支付', label: '余额支付' },
      ];
    }
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/getMasonryGoods');
    if (res.isSuccess) {
      this.setState({
        goods: res.data,
      });
    }
  }
  // 跳转到支付页面
  goToPay = async (payType, shopId) => {
    const chargeType = this.helps.payType(payType);
    const res = await this.helps.webHttp.get('/spreadApi/recharge', { goodsId: shopId, chargeType });
    if (!res.isSuccess) {
      this.helps.toast(res.info || '购买失败');
      return false;
    }
    const chargeURL = res.data.chargeURL;
    window.location.href = chargeURL;
  }
  // 余额充值
  readyToExcharge = async (shopId) => {
    if (!window.confirm('确认购买？')) {
      return false;
    }
    const params = {
      goodsId: shopId,
    };
    const res = await this.helps.webHttp.get('/spreadApi/balanceRecharge', params);
    if (res.isSuccess) {
      this.helps.toast(res.info || '充值成功');
      return false;
    }
    this.helps.toast(res.info || '充值失败，请重试');
  }
  buyGood = (shopId) => {
    const { selectPayTypeVal } = this.state;
    const payType = selectPayTypeVal[0];
    const { WECHAT, ALI } = this.payEnum;
    if (payType === WECHAT) {
      this.goToPay(WECHAT, shopId);
    } else if (payType === ALI) {
      this.goToPay(ALI, shopId);
    } else {
      this.readyToExcharge(shopId);
    }
  }
  selectPayType = (val) => {
    this.setState({
      selectPayTypeVal: val,
    });
  }
  goToDetail = () => {
    this.props.dispatch(this.helps.routerRedux.push('/buyMasonryDetail'));
  }
  render() {
    const { selectPayTypeVal, goods } = this.state;
    return (
      <div>
        <Title>购买钻石</Title>
        <NavBar
          title="购买钻石"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={this.goToDetail}>明细</div>}
        />
        <WhiteSpace />
        <div className="background">
          <SelectPicker value={selectPayTypeVal} data={this.marsonryPayType} cols={1} onChange={this.selectPayType}>
            <List.Item arrow="horizontal" style={{ padding: '0 0.2rem' }}>支付方式</List.Item>
          </SelectPicker>
          <div className={styles.payTitle}>充钻石</div>
          <div className={styles.goodsContainer}>
            {
              goods.map(({ goodsMoney, masonryCount, shopId }, i) => (
                <div
                  className={styles.goodsWrap}
                  key={i}
                  style={{ marginRight: (i !== 0 && ((i - 2) % 3) === 0) ? 0 : '5%' }}
                  onClick={() => this.buyGood(shopId)}
                >
                  <p className={styles.goodInfo}>{masonryCount}钻石</p>
                  <p className={styles.goodInfo}>售价：{this.parseFloatMoney(goodsMoney)}元</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(AgencyPay);
