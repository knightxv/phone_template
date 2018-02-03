import React from 'react';
import { connect } from 'dva';
import { window } from 'global';
import { Checkbox } from 'antd-mobile';

import BaseComponent from '@/core/BaseComponent';
import { Button, Icon, Modal, NavBar } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import PayIcon from '@/components/PayIcon';
import styles from './PayToTurnDiaForPlayer.less';

const imgSource = {
  masonry: require('../../assets/zuanshi.png'),
  androidTip: require('../../assets/android_tip.png'),
  iosTip: require('../../assets/ios_tip.png'),
};
class PayToTurnDiaForPlayer extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      payPickerVisible: false,
      // selectPayType: this.Enum.payType.WECHAT,
      // selectPayInfo: null,
      selectPayType: null, // 选择的支付方式
      isAutoSave: true,
      payTipVisible: false,
    };
    this.query = this.router.getQuery();
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
  selectPayType = (selectPayType) => {
    this.setState({
      selectPayType,
      payPickerVisible: false,
    });
  }
  // // 跳转到支付页面
  // goToPay = async (payType, shopId) => {
  //   const chargeType = this.helps.payType(payType);
  //   const res = await this.http.webHttp.get('/spreadApi/recharge', { goodsId: shopId, chargeType });
  //   if (!res.isSuccess) {
  //     this.message.info(res.info || '购买失败');
  //     return false;
  //   }
  //   const chargeURL = res.data.chargeURL;
  //   window.location.href = chargeURL;
  // }
  // 余额充值
  readyToExcharge = async () => {
    const { isAutoSave } = this.state;
    const { playerId, diamond, serverid } = this.router.getQuery();
    const { inviteCode } = this.props;
    const params = {
      serverid,
      pid: inviteCode,
      HeroID: playerId,
      diamond,
      isSaveCommon: isAutoSave,
    };
    const res = await this.http.webHttp.get('/spreadApi/giveDiamond', params);
    this.message.info(res.info || '赠送成功,请耐心等待');
    if (res.isSuccess) {
      this.router.back();
    }
    const updateRes = await this.http.webHttp.get('/spreadApi/getUserInfo');
    if (updateRes.isSuccess) {
      this.props.dispatch({ type: 'agent/updateAppInfo',
        payload: {
          ...updateRes.data,
        } });
    }
  }
  // 支付宝支付
  togglePayTipPicker = () => {
    this.message.info('微信浏览器暂不支持此支付方式');
    // 弹出picker
    // this.setState({
    //   payTipVisible: !this.state.payTipVisible,
    // });
  }
  payToTurn =() => {
    const { selectPayType } = this.state;
    if (selectPayType === null) {
      return;
    }
    const { BALANCE } = this.Enum.payType;
    if (selectPayType === BALANCE) {
      this.readyToExcharge();
      return;
    }
    // if (this.helps.isWechat && payTypeSelect === ALI) {
    //   this.togglePayTipPicker();
    //   return;
    // }
    this.goToPay();

  }
  goToPay = async () => {
    const { selectPayType, isAutoSave } = this.state;
    const { inviteCode } = this.props;
    if (selectPayType === null) {
      return;
    }
    const type = selectPayType;
    const chargeType = this.helps.payType(type);
    const { playerId, diamond, serverid } = this.router.getQuery();
    const params = {
      pid: inviteCode,
      HeroID: playerId,
      serverid,
      money: this.helps.parseFloatMoney(diamond * 10),
      chargeType,
      isSaveCommon: isAutoSave,
    };
    const res = await this.http.webHttp.get('/spreadApi/recharge_for_player', params);
    if (!res.isSuccess) {
      this.message.info(res.info || '购买失败');
      return false;
    }
    const chargeURL = res.data.chargeURL;
    window.location.href = chargeURL;
  }
  toggleSave = () => {
    this.setState({
      isAutoSave: !this.state.isAutoSave,
    });
  }
  render() {
    const { payPickerVisible, selectPayType, isAutoSave, payTipVisible } = this.state;
    const { inviteCode, masonry } = this.props;
    const payItemArr = this.payItemArr();
    const { diamond, playerName, playerId } = this.query;
    const price = this.helps.parseFloatMoney(diamond * 10);
    const hasPowerToGive = this.hasPowerSome('wechatPayForAgentTurnDiaToPlayer', 'AliPayForAgentTurnDiaToPlayer');
    const { ALI } = this.Enum.payType;
    const selectPayTypeLabel = this.Enum.payTypeLabel[selectPayType];
    return (
      <div className={styles.container}>
        <Title>确认订单</Title>
        <NavBar
          title="确认订单"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div className={styles.headerContainer}>
            <div className={styles.userInfoItem}>
              <div>代理ID：{ inviteCode }</div>
              <div>当前账户钻石数:{ masonry }个</div>
            </div>
            <div className={styles.turnInfoWrap}>
              <div className={styles.turnInfoItem}>
                <div className={styles.turnInfoItemKey}>收款玩家:</div>
                <div className={styles.turnInfoItemVal}>
                  <span className={styles.count}>{ playerName }(玩家ID:{ playerId })</span>
                </div>
              </div>
              <div className={styles.turnInfoItem}>
                <div className={styles.turnInfoItemKey}>转出钻石数量:</div>
                <div className={styles.turnInfoItemVal}>
                  <span className={styles.count}>{ diamond }</span>个
                </div>
              </div>
            </div>
            {
              hasPowerToGive &&
              <div>
                <div className={styles.rowItemWrap} onClick={this.togglePayPicker}>
                  <div>付款方式</div>
                  <div className={styles.payItem}>
                    <PayIcon payType={selectPayType} />
                    <span>{ selectPayTypeLabel }</span>
                    { payItemArr.length > 1 && <Icon type="right" /> }
                  </div>
                </div>
              </div>
            }
          </div>
          {
            hasPowerToGive &&
            <div>
              <div className={styles.priceTip}>
                注：玩家购钻价格统一0.1元/钻
              </div>
              <div className={styles.priceLabel}>
                价格：<span className={styles.count}>{ selectPayType === this.Enum.payType.BALANCE ? '0.00' : price }</span>元
              </div>
            </div>
          }
          {
            this.hasPower('playerRange', 0) &&
            <div className={styles.autoSaveWrap}>
              <Checkbox checked={isAutoSave} onChange={this.toggleSave} />
              <span className={styles.saveTip}>转钻提交成功后自动添加为常用收款玩家</span>
            </div>
          }
          <div className={styles.buyBtnWrap}>
            <Button onClick={this.payToTurn}>确认转钻</Button>
          </div>
        </div>
        {
          this.helps.isWechat && selectPayType === ALI &&
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
          maskClosable
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
                          {/* {
                            payInfo.payType === this.Enum.payType.BALANCE
                            && <div>
                              余额:<span className={styles.count}>{ canCashCountLabel }</span>元
                            </div>
                          } */}
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

export default connect(mapStateToProps)(PayToTurnDiaForPlayer);
