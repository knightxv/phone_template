import React from 'react';
import { connect } from 'dva';

import { StickyContainer, Sticky } from 'react-sticky';
import { Icon, Button } from '@/helps/antdComponent/index.js';
import { BodyScrollListView, ScrollListView } from '@/helps/lazyComponent/ScrollListView';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title, WhiteSpace, FlexRowBetweenWingSpace, FlexRow, IconImg } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './AgencyPay.less';

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
    this.marsonryPayType = [
      // { payType: WECHAT, label: '微信支付', paySource: paySource.wx },
      // { payType: ALI, label: '支付宝支付', paySource: paySource.zfb },
      // { payType: BALANCE, label: '余额支付', paySource: paySource.yezf },
    ];
    // 如果有余额支付权限
    const havePowerToBanlance = this.hasPower('banlance');
    const havePowerToRecharge = this.hasPower('proxySDKCharge');
    if (havePowerToRecharge) {
      if (!this.helps.isWeixinBrowser()) {
        this.marsonryPayType.push({ payType: ALI, label: '支付宝支付', paySource: paySource.zfb });
      }
      this.marsonryPayType.push({ payType: WECHAT, label: '微信支付', paySource: paySource.wx });
    }
    if (havePowerToBanlance) {
      this.marsonryPayType.push({ payType: BALANCE, label: '余额支付', paySource: paySource.yezf });
    }
    this.state = {
      goods: [],
      record: [],
      payTypeSelect: this.marsonryPayType[0] && this.marsonryPayType[0].payType,
    };
    this.page = 0;
    this.size = 10;
  }
  async componentWillMount() {
    const res = await this.http.webHttp.get('/spreadApi/getMasonryGoods');
    if (res.isSuccess) {
      this.setState({
        goods: res.data,
      });
    }
    this.getRecord();
  }
  getRecord = async () => {
    const { page, size } = this;
    const res = await this.http.webHttp.get('/spreadApi/diamondsDetail', { page, size });
    if (res.isSuccess) {
      this.setState({
        record: [
          ...this.state.record,
          ...res.data,
        ],
      });
    }
  }
  // 跳转到支付页面
  goToPay = async (payType, shopId) => {
    const chargeType = this.helps.payType(payType);
    const res = await this.http.webHttp.get('/spreadApi/recharge', { goodsId: shopId, chargeType });
    if (!res.isSuccess) {
      this.message.info(res.info || '购买失败');
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
    const res = await this.http.webHttp.get('/spreadApi/balanceRecharge', params);
    if (res.isSuccess) {
      this.message.info(res.info || '充值成功');
      const userInfoRes = await this.http.webHttp.get('/spreadApi/getUserInfo');
      this.props.dispatch({ type: 'agent/updateAppInfo', payload: userInfoRes.data });
      return false;
    }
    this.message.info(res.info || '充值失败，请重试');
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
    this.router.go('/buyMasonryDetail');
  }
  // 跳到确认支付页面
  buyGoods = () => {

  }
  renderRow = (row) => {
    return <div className={styles.rowItem}>1</div>
  }
  render() {
    const { goods, payTypeSelect, record } = this.state;
    const { canCashCount } = this.props;
    return (
      <div className={styles.container}>
        <Title>购买钻石</Title>
        <NavBar
          title="购买钻石"
          onClick={this.router.back}
          right={<div onClick={this.goToDetail}>明细</div>}
        />
        <WhiteSpace />
        <div className={styles.payWrap}>
          <div className={styles.goodsContainer}>
            {
              goods.map(({ goodsMoney, masonryCount, shopId }, i) => (
                <div
                  className={styles.goodsWrap}
                  key={i}
                  style={{ marginRight: (i !== 0 && ((i - 2) % 3) === 0) ? 0 : '5%' }}
                  onClick={() => this.buyGood(shopId)}
                >
                  <p className={styles.goodInfo}>{this.helps.transMoenyUnit(masonryCount)}钻石</p>
                  <p className={styles.goodInfo}>售价:{this.helps.parseFloatMoney(goodsMoney)}元</p>
                </div>
              ))
            }
          </div>
          <div className={styles.payTip}>-推荐新代理,88开运!-</div>
          <div className={styles.btnWrap}>
            <Button onClick={this.buyGoods} className={styles.payBtn}>立即购买</Button>
          </div>
        </div>
        <StickyContainer className={styles.stickyContainer} >
          <Sticky>
            {
              ({
              style,
                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight
              }) => {
                // console.log(wasSticky)
                return (
                  <div className={styles.listWrap} style={style}>
                    <div className={styles.recordHeader}>
                      <div>
                        本月购钻数量:3003个
                      </div>
                      <div>
                        总购钻数量:300个
                      </div>
                    </div>
                    {
                      wasSticky
                      ? <ScrollListView
                        data={record}
                        renderRow={this.renderRow}
                      />
                      : <BodyScrollListView
                        data={record}
                        renderRow={this.renderRow}
                      />
                    }
                  </div>
                );
              }
            }
          </Sticky>
        </StickyContainer>
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

/*
<div className={styles.container}>
        <Title>购买钻石</Title>
        <NavBar
          title="购买钻石"
          onClick={this.router.back}
          right={<div onClick={this.goToDetail}>明细</div>}
        />
        <WhiteSpace />
        <div className={styles.payWrap}>
          <div className={styles.goodsContainer}>
            {
              goods.map(({ goodsMoney, masonryCount, shopId }, i) => (
                <div
                  className={styles.goodsWrap}
                  key={i}
                  style={{ marginRight: (i !== 0 && ((i - 2) % 3) === 0) ? 0 : '5%' }}
                  onClick={() => this.buyGood(shopId)}
                >
                  <p className={styles.goodInfo}>{this.helps.transMoenyUnit(masonryCount)}钻石</p>
                  <p className={styles.goodInfo}>售价:{this.helps.parseFloatMoney(goodsMoney)}元</p>
                </div>
              ))
            }
          </div>
          <div className={styles.payTip}>-推荐新代理,88开运!-</div>
          <div className={styles.btnWrap}>
            <Button onClick={this.buyGoods} className={styles.payBtn}>立即购买</Button>
          </div>
        </div>
        <StickyContainer className={styles.stickyContainer} >
          <Sticky>
            {
              ({
              style,
                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight
              }) => {
                return (
                  <div className={styles.listWrap} style={style}>
                    <ListView
                      data={record}
                      renderHeader={this.renderHeader}
                      renderRow={this.renderRow}
                      scrollEnabled={false}
                    />
                  </div>
                );
              }
            }
          </Sticky>
        </StickyContainer>
      </div>

        
*/
