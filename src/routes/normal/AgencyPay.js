import React from 'react';
import { connect } from 'dva';

import { NavBar, Icon } from '@/helps/antdComponent';
import { Title, WhiteSpace, FlexRowBetweenWingSpace, FlexRow, IconImg } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './AgencyPay.css';

// const goodsIds = [1, 2, 3, 4, 5, 6];
// const goodsSourceArr = goodsIds.map(index => require(`../resource/shop/${index}.png`));

const paySource = {
  wx: require('../../assets/wx.png'),
  zfb: require('../../assets/zfb.png'),
  yezf: require('../../assets/yezf.png'),
};

class AgencyPay extends BaseComponent {
  constructor(props) {
    super(props);
    this.payEnum = this.helps.payEnum;
    const { WECHAT, ALI, BALANCE } = this.payEnum;
    this.state = {
      goods: [],
      payTypeSelect: WECHAT,
    };
    this.marsonryPayType = [
      { payType: WECHAT, label: '微信支付', paySource: paySource.wx },
      { payType: ALI, label: '支付宝支付', paySource: paySource.zfb },
      { payType: BALANCE, label: '余额支付', paySource: paySource.yezf },
    ];
    if (this.helps.isWeixinBrowser()) {
      this.marsonryPayType = [
        { payType: WECHAT, label: '微信支付', paySource: paySource.wx },
        { payType: BALANCE, label: '余额支付', paySource: paySource.yezf },
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
      this.props.dispatch({ type: 'agent/updateUserInfo' });
      this.helps.toast(res.info || '充值成功');
      return false;
    }
    this.helps.toast(res.info || '充值失败，请重试');
  }
  buyGood = (shopId) => {
    const { payTypeSelect } = this.state;
    const { WECHAT, ALI } = this.payEnum;
    if (payTypeSelect === WECHAT) {
      this.goToPay(WECHAT, shopId);
    } else if (payTypeSelect === ALI) {
      this.goToPay(ALI, shopId);
    } else {
      this.readyToExcharge(shopId);
    }
  }
  selectPayType = (val) => {
    this.setState({
      payTypeSelect: val,
    });
  }
  goToDetail = () => {
    this.props.dispatch(this.helps.routerRedux.push('/buyMasonryDetail'));
  }
  render() {
    const { goods, payTypeSelect } = this.state;
    const { canCashCount } = this.props;
    return (
      <div>
        <Title>购买钻石</Title>
        <NavBar
          title="购买钻石"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={this.goToDetail}>明细</div>}
        />
        <WhiteSpace />
        <div className={styles.payTypeContainer}>
          <div className={styles.payTypeTitle}>支付方式</div>
          {
            this.marsonryPayType.map(payInfo => (
              <FlexRowBetweenWingSpace
                key={payInfo.payType}
                className={styles.paySelectItem}
                onClick={() => this.selectPayType(payInfo.payType)}
              >
                <FlexRow>
                  <IconImg src={payInfo.paySource} className={styles.payIcon} />
                  <div>{payInfo.label}</div>
                  {
                    payInfo.payType === this.payEnum.BALANCE
                    && (<div className={styles.balanceTip}>
                      ￥{this.parseFloatMoney(canCashCount)}
                    </div>)
                  }
                </FlexRow>
                <div>
                  {
                    payTypeSelect === payInfo.payType && <Icon type="check" />
                  }
                </div>
              </FlexRowBetweenWingSpace>
            ))
          }
        </div>
        <WhiteSpace />
        <div className={styles.payWrap}>
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
                  <p className={styles.goodInfo}>{this.transMoenyUnit(masonryCount)}钻石</p>
                  <p className={styles.goodInfo}>售价：{this.transMoenyUnit(goodsMoney)}元</p>
                </div>
              ))
            }
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

export default connect(mapStateToProps)(AgencyPay);
