import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, WingBlank } from 'antd-mobile';
import { routerRedux } from 'dva/router';

import styles from './Pay.css';
import { BackgroundContainer, TextInput, FlexRow, BaseFont, Button, IconImg, PayTip } from '../utils/styleComponent';
import http from '../utils/http';
import { Toast, payType, payEnum, Title, isWechat } from '../utils/help';

class Pay extends React.Component {
  constructor(props) {
    super(props);
    const query = this.props.location.query;
    const { heroID = '', serverID = '', code, price = '' } = query;
    this.code = code;
    if (heroID && serverID) {
      // 说明是从游戏端那边过来的
      this.heroID = heroID;
      this.serverID = serverID;
      this.price = price;
      window.location.hash = location.hash.split('?')[0];
      this.disabledUserEditId = true; // 禁止用户编辑id
    }
    this.state = {
      heroID, // 用户id
      money: price, // 充值金额
      diamond: '', // 钻石
      userName: '', // 用户名
      avatar: '', //用户头像
    };
    this.idTimer = null;
    this.moneyTimer = null;
    // this.disabledUserEditId = false;
  }
  async componentWillMount() {
    if (!this.heroID) {
      return false;
    }
    this.idValChange(this.heroID);
    this.moneyValChange(this.price);
  }
  // 充值
  recharge = async (type) => {
    const chargeType = payType(type);
    // HeroID 玩家ID Diamond充值数量  TimeTick 充值时间
    const { heroID: HeroID, money } = this.state;
    // const { code: pid, serverID } = this.props.location.query;
    const pid = this.code;
    const serverID = this.serverID;
    if (!pid) {
      Toast.info('代理不存在，请联系代理重新分享链接');
      return false;
    }
    const params = {
      pid,
      HeroID,
      serverID,
      money,
      chargeType,
    };
    const res = await http.get('/spreadApi/recharge_for_player', params);
    if (!res.isSuccess) {
      Toast.info(res.message || '购买失败');
      return false;
    }
    const chargeURL = res.data.chargeURL;
    window.location.href = chargeURL;
    // openWindow(chargeURL);
  }
  // id发生改变
  idValChange = (val) => {
    clearTimeout(this.idTimer);
    this.idTimer = setTimeout(async () => {
      if (!val || val.length < 6) {
        return false;
      }
      // 获取头像和名称
      const res = await http.get('/spreadApi/getPlayerInfoById', { heroID: val });
      if (res.isSuccess) {
        const { userName, avatar } = res.data;
        this.setState({
          userName,
          avatar,
        });
      } else {
        Toast.info(res.message);
      }
    }, 500);
    this.setState({
      heroID: val,
    });
  }
  // 金额发生改变
  moneyValChange = (val) => {
    clearTimeout(this.moneyTimer);
    this.moneyTimer = setTimeout(async () => {
      if (!val || isNaN(val)) {
        this.setState({
          diamond: ''
        });
        return false;
      }
      const res = await http.get('/spreadApi/getDiamondsByMoney', { money: val });
      if (res.isSuccess) {
        this.setState({
          diamond: res.data.diamond,
        });
      }
    }, 500);
    this.setState({
      money: val,
    });
  }
  render() {
    const { userName, diamond, heroID, avatar, money } = this.state;
    const disabledUserEditId = !!this.disabledUserEditId; // 是否禁止用户输入
    return (
      <BackgroundContainer>
        <Title>充值</Title>
        <div className="alignCenterContainer">
          <WingBlank size="md">
            <WhiteSpace size="md" />
            {
              avatar &&
              (
                <IconImg className={styles.userAvatar} src={avatar} />
              )
            }
            <FlexRow className={styles.inputContainer}>
              <BaseFont className={styles.inputLabel}>ID　　</BaseFont>
              <TextInput
                onChange={this.idValChange}
                placeholder="请输入六位ID号"
                maxLength={11}
                disabled={disabledUserEditId}
                value={heroID}
              />
            </FlexRow>
            <FlexRow className={styles.inputContainer}>
              <BaseFont className={styles.inputLabel}>用户名</BaseFont>
              <TextInput
                placeholder="根据ID自动检测"
                value={userName}
                disabled
              />
            </FlexRow>
            <FlexRow className={styles.inputContainer}>
              <BaseFont className={styles.inputLabel}>金额　</BaseFont>
              <TextInput
                onChange={this.moneyValChange}
                placeholder="请输入金额数"
                disabled={disabledUserEditId}
                maxLength={11}
                value={money}
              />
            </FlexRow>
            <FlexRow className={styles.inputContainer}>
              <BaseFont className={styles.inputLabel}>钻石　</BaseFont>
              <TextInput
                placeholder="根据金额自动检测"
                value={diamond}
                disabled
              />
            </FlexRow>
            <WhiteSpace size="lg" />
            <Button onClick={() => this.recharge(payEnum.WECHAT)}>微信支付</Button>
            <WhiteSpace size="md" />
            <Button onClick={() => this.recharge(payEnum.ALI)}>支付宝支付</Button>
          </WingBlank>
        </div>
      <a ref={node => {this.link = node}} href="http://www.baidu.com" target="_blank"></a>
      </BackgroundContainer>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Pay);
