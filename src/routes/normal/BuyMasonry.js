import React from 'react';
import { connect } from 'dva';
import { window } from 'global';

import BaseComponent from '@/core/BaseComponent';
import SlideUpModal from '@/components/Modal/SlideUpModal';
import { Button, Icon, NavBar } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import PayIcon from '@/components/PayIcon';
import styles from './BuyMasonry.less';

const imgSource = {
  masonry: require('../../assets/zuanshi.png'),
  // wx: require('../../assets/wx.png'),
  // zfb: require('../../assets/zfb.png'),
  // yezf: require('../../assets/yezf.png'),
  androidTip: require('../../assets/android_tip.png'),
  iosTip: require('../../assets/ios_tip.png'),
};
class BuyMasonry extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      goods: [],
      record: [],
      payPickerVisible: false,
      selectPayType: null, // 选择的支付方式
      payTipVisible: false,
    };
    const query = this.router.getQuery();
    // const { goodsMoney, masonryCount, shopId } = query;
    this.query = query;
  }
  // 判断权限得到支付方式
  payItemArr = () => {
    const { WECHAT, ALI, BALANCE, YLZF } = this.Enum.payType;
    const payItemArr = [];
    if (this.hasPower('AgentBuyDiabanlancePay')) {
      payItemArr.push(BALANCE);
    }
    if (this.hasPower('AgentBuyDiawechatPay')) {
      payItemArr.push(WECHAT);
    }
    if (this.hasPower('AgentBuyDiaAliPay')) {
      payItemArr.push(ALI);
    }
    if (this.hasPower('ylzfForAgentBuyDia')) {
      payItemArr.push(YLZF);
    }
    return payItemArr;
  }
  async componentWillMount() {
    if (this.props.history.length < 1) {
      this.router.go('/homePage');
      return;
    }
    // 解决浏览器支付返回缓存ajax问题 Provisional headers are shown
    const res = await this.http.webHttp.get('/spreadApi/getUserInfo');
    if (res.isSuccess) {
      this.props.dispatch({ type: 'agent/updateAppInfo',
        payload: {
          ...res.data,
        } });
    }
    const payItemArr = this.payItemArr();
    this.setState({
      selectPayType: payItemArr.length > 0 ? payItemArr[0] : null,
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
  selectPayType = (payType) => {
    this.setState({
      selectPayType: payType,
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
      this.router.go('/orderForAgentBuyDia', {
        orderId,
      });
    } else {
      this.message.info(res.info || '充值失败，请重试');
    }
  }
  buyGood = () => {
    let { selectPayType } = this.state;
    const { shopId } = this.query;
    if (typeof selectPayType !== 'number') {
      selectPayType = this.payItemArr()[0];
    }
    if (typeof selectPayType === 'undefined') {
      return;
    }
    const { WECHAT, ALI, BALANCE, YLZF } = this.Enum.payType;
    if (selectPayType === BALANCE) {
      this.readyToExcharge(shopId);
      return;
    }
    if (selectPayType !== YLZF && this.helps.isWechat) {
      this.togglePayTipPicker();
      return;
    }
    this.goToPay(selectPayType, shopId);
  }
  // 微信不支持支付提示
  togglePayTipPicker = () => {
    // 弹出picker
    this.setState({
      payTipVisible: !this.state.payTipVisible,
    });
  }
  render() {
    const { payPickerVisible, selectPayType: sPayType, payTipVisible } = this.state;
    const { inviteCode, canCashCount } = this.props;
    const { goodsMoney, masonryCount } = this.query;
    const payItemArr = this.payItemArr();
    const selectPayType = typeof sPayType !== 'number' ? payItemArr[0] : sPayType;
    const goodsMoneyLabel = this.helps.parseFloatMoney(goodsMoney);
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
          <div className={styles.blockContainer}>
            <div className={styles.headerInfoWrap}>
              <div className={styles.masonryIconWrap}>
                <IconImg className={styles.masonryIcon} src={imgSource.masonry} />
              </div>
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
                  <PayIcon payType={selectPayType} />
                  <span>{ this.Enum.payTypeLabel[selectPayType] }</span>
                  { payItemArr.length > 1 && <Icon type="right" /> }
                </div>
              </div>
            </div>
          </div>
          <div className={styles.btnWrap}>
            <Button onClick={this.buyGood}>确认支付</Button>
          </div>
        </div>
        {
          <SlideUpModal
            visible={payTipVisible}
            onClose={this.togglePayTipPicker}
          >
            <div onClick={this.togglePayTipPicker}>
              {
                this.helps.system === 'IOS' ?
                <IconImg className={styles.payWechatTipImg} src={imgSource.iosTip} />
                : <IconImg className={styles.payWechatTipImg} src={imgSource.androidTip} />
              }
            </div>
          </SlideUpModal>
        }
        <SlideUpModal
          visible={payPickerVisible}
          onClose={this.togglePayPicker}
        >
          <div className={styles.payPickerBody}>
            <div className={styles.pickerHeader}>
              <Icon type="cross" size="lg" onClick={this.togglePayPicker} />
              <div className={styles.pickerTitle}>选择付款方式</div>
              <div className={styles.iconRight} />
            </div>
            <div>
              {
                payItemArr.map(payType => (
                  <div
                    className={styles.pickePayItem}
                    key={payType}
                    onClick={() => this.selectPayType(payType)}
                  >
                    <div className={styles.payInfoWrap}>
                      <div className={styles.payItem}>
                        <PayIcon payType={payType} />
                        <span>
                          {
                            this.Enum.payTypeLabel[payType]
                          }
                          {
                            this.helps.isWechat
                            && (payType === this.Enum.payType.WECHAT || payType === this.Enum.payType.ALI)
                            && (<span className={styles.colorGray}>(微信浏览器暂不支持)</span>)
                          }
                        </span>
                      </div>
                      <div>
                        {
                          payType === this.Enum.payType.BALANCE
                          && <div>
                            余额:<span className={styles.count}>{ canCashCountLabel }</span>元
                          </div>
                        }
                      </div>
                    </div>
                    <div className={styles.selectIconWrap}>
                      {
                        payType === selectPayType && <Icon color="#1d9ed7" type="check" />
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </SlideUpModal>
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
