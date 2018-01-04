import React from 'react';
import { connect } from 'dva';
import { window } from 'global';

import BaseComponent from '@/helps/BaseComponent';
import { Button, Icon, Modal } from '@/helps/antdComponent/index.js';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title, IconImg } from '@/helps/styleComponent';
import styles from './BuyMasonry.less';

const imgSource = {
  masonry: require('../../assets/zuanshi.png'),
  wx: require('../../assets/wx.png'),
  zfb: require('../../assets/zfb.png'),
  yezf: require('../../assets/yezf.png'),
  androidTip: require('../../assets/android_tip.png'),
  iosTip: require('../../assets/ios_tip.png'),
};
class BuyMasonry extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      goods: [],
      selectShopId: -1, // 选择的商品id
      record: [],
      payPickerVisible: false,
      // selectPayType: this.Enum.payType.WECHAT,
      selectPayType: {},
      payTipVisible: false,
    };
    const query = this.router.getQuery();
    // const { goodsMoney, masonryCount, shopId } = query;
    this.query = query;
    this.payItem = {
      wechat: {
        label: '微信支付',
        imgSourceKey: 'wx',
        payType: this.Enum.payType.WECHAT,
      },
      aliPay: {
        label: '支付宝支付',
        imgSourceKey: 'zfb',
        payType: this.Enum.payType.ALI,
      },
      balance: {
        label: '余额支付',
        imgSourceKey: 'yezf',
        payType: this.Enum.payType.BALANCE,
      },
    };
  }
  // 判断权限得到支付方式
  payItemArr = () => {
    const payItem = this.payItem;
    const payItemArr = [];
    if (this.hasPower('AgentBuyDiawechatPay')) {
      payItemArr.push(payItem.wechat);
    }
    if (this.hasPower('AgentBuyDiabanlancePay')) {
      payItemArr.push(payItem.balance);
    }
    if (this.hasPower('AgentBuyDiaAliPay')) {
      payItemArr.push(payItem.aliPay);
    }
    return payItemArr;
  }
  async componentWillMount() {
    const payItemArr = this.payItemArr();
    this.setState({
      selectPayInfo: payItemArr.length > 0 ? payItemArr[0] : {},
    });
  }
  // 跳出支付picker
  togglePayPicker = () => {
    const payItemArr = this.payItemArr();
    if (payItemArr.length > 1) {
      this.setState({
        payPickerVisible: !this.state.payPickerVisible,
      });
    }
  }
  // 选择支付方式
  selectPayType = (payInfo) => {
    this.setState({
      selectPayInfo: payInfo,
      payPickerVisible: false,
    });
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
    const params = {
      goodsId: shopId,
    };
    const res = await this.http.webHttp.get('/spreadApi/balanceRecharge', params);
    if (res.isSuccess) {
      const { orderId } = res.data;
      // this.message.info(res.info || '充值成功');
      // const userInfoRes = await this.http.webHttp.get('/spreadApi/getUserInfo');
      // this.props.dispatch({ type: 'agent/updateAppInfo', payload: userInfoRes.data });
      this.router.go('/buyDiaOrderStatu', {
        orderId,
      });
      return false;
    }
    this.message.info(res.info || '充值失败，请重试');
  }
  buyGood = () => {
    const { selectPayInfo } = this.state;
    const { shopId } = this.query;
    const payTypeSelect = selectPayInfo.payType;
    const { WECHAT, ALI } = this.Enum.payType;
    if (this.helps.isWechat && payTypeSelect === ALI) {
      // this.message.info('请用手机浏览器打开');
      this.togglePayTipPicker();
      return;
    }
    if (payTypeSelect === WECHAT) {
      this.goToPay(WECHAT, shopId);
    } else if (payTypeSelect === ALI) {
      this.goToPay(ALI, shopId);
    } else {
      this.readyToExcharge(shopId);
    }
  }
  togglePayTipPicker = () => {
    this.setState({
      payTipVisible: !this.state.payTipVisible,
    });
  }
  render() {
    const { payPickerVisible, selectPayInfo, payTipVisible } = this.state;
    const { inviteCode, canCashCount } = this.props;
    const payItemArr = this.payItemArr();
    const { goodsMoney, masonryCount } = this.query;
    const goodsMoneyLabel = this.helps.parseFloatMoney(goodsMoney);
    const {
      label,
      imgSourceKey,
      payType,
    } = selectPayInfo;
    const { ALI } = this.Enum.payType;
    const canCashCountLabel = this.helps.parseFloatMoney(canCashCount);
    return (
      <div className={styles.container}>
        <Title>确认订单</Title>
        <NavBar
          title="确认订单"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div className={styles.headerContainer}>
            <div className={styles.headerInfoWrap}>
              <IconImg className={styles.masonryIcon} src={imgSource.masonry} />
              <div className={styles.masonryInfo}>
                <div className={styles.masonryCountLabel}>{ masonryCount }钻石</div>
                <div className={styles.masonryMoenyLabel}>￥{ goodsMoneyLabel }</div>
              </div>
            </div>
            <div>
              <div className={styles.rowItemWrap}>
                <div>代理ID</div>
                <div>{ inviteCode }</div>
              </div>
              <div className={styles.rowItemWrap} onClick={this.togglePayPicker}>
                <div>付款方式</div>
                <div className={styles.payItem}>
                  <IconImg className={styles.payIcon} src={imgSource[imgSourceKey]} />
                  <span>{ label }</span>
                  { payItemArr.length > 1 && <Icon type="right" /> }
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buyBtnWrap}>
            <Button onClick={this.buyGood}>确认支付</Button>
          </div>
        </div>
        {
          this.helps.isWechat && payType === ALI &&
          <Modal
            maskClosable
            transparent
            animationType="fade"
            visible={payTipVisible}
          >
          <div onClick={this.togglePayTipPicker}>
            {
              this.helps.system === 'IOS' ?
              <IconImg className={styles.payWechatTipImg} src={imgSource.iosTip} />
              : <IconImg className={styles.payWechatTipImg} src={imgSource.androidTip} />
            }
          </div>
          </Modal>
        }
        <Modal
          transparent
          className={styles.payModal}
          visible={payPickerVisible}
          onClose={this.togglePayPicker}
        >
          <div className={styles.payPicker}>
            <div className={styles.pickerHideMask} onClick={this.togglePayPicker} />
            <div className={styles.payPickerBody}>
              <div className={styles.pickerHeader}>
                <Icon type="cross" size="lg" onClick={this.togglePayPicker} />
                <div className={styles.pickerTitle}>选择付款方式</div>
                <div className={styles.iconRight} />
              </div>
              <div>
                {
                  payItemArr.map(payInfo => (
                    <div
                      className={styles.pickePayItem}
                      key={payInfo.payType}
                      onClick={() => this.selectPayType(payInfo)}
                    >
                      <div className={styles.payInfoWrap}>
                        <div className={styles.payItem}>
                          <IconImg className={styles.payIcon} src={imgSource[payInfo.imgSourceKey]} />
                          <span>{payInfo.label}</span>
                        </div>
                        <div>
                          {
                            payInfo.payType === this.Enum.payType.BALANCE
                            && <div>
                              余额:<span className={styles.count}>{ canCashCountLabel }</span>元
                            </div>
                          }
                        </div>
                      </div>
                      <div className={styles.selectIconWrap}>
                        {
                          payType === payInfo.payType && <Icon color="#1d9ed7" type="check" />
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.agent,
  };
};

export default connect(mapStateToProps)(BuyMasonry);
