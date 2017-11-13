import React from 'react';
import { connect } from 'dva';

import { Button, Input } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { WhiteSpace, WingBlank, FlexRow, BaseFont, IconImg, Title } from '@/helps/styleComponent';
import styles from './Pay.css';

class Pay extends BaseComponent {
  constructor(props) {
    super(props);
    const searchText = this.props.location.search.substr(1);
    const query = this.helps.querystring.parse(searchText);
    const { heroID = '', serverID = '', code, price = '' } = query;;
    this.code = code;
    if (heroID && serverID) {
      // 说明是从游戏端那边过来的
      this.heroID = heroID;
      this.serverID = serverID;
      this.price = price;
      window.location.hash = window.location.hash.split('?')[0];
      this.disabledUserEditId = true; // 禁止用户编辑id
    }
    this.state = {
      heroID, // 用户id
      money: price, // 充值金额
      diamond: '', // 钻石
      userName: '', // 用户名
      avatar: '', // 用户头像
    };
    this.idTimer = null;
    this.moneyTimer = null;
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
    const chargeType = this.helps.payType(type);
    // HeroID 玩家ID Diamond充值数量  TimeTick 充值时间
    const { heroID: HeroID, money } = this.state;
    // const { code: pid, serverID } = this.props.location.query;
    const pid = this.code;
    const serverID = this.serverID;
    if (!pid) {
      this.helps.toast('代理不存在，请联系代理重新分享链接');
      return false;
    }
    const params = {
      pid,
      HeroID,
      serverID,
      money,
      chargeType,
    };
    const res = await this.helps.webHttp.get('/spreadApi/recharge_for_player', params);
    if (!res.isSuccess) {
      this.helps.toast(res.info || '购买失败');
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
      const res = await this.helps.webHttp.get('/spreadApi/getPlayerInfoById', { heroID: val });
      if (res.isSuccess) {
        const { userName, avatar } = res.data;
        this.setState({
          userName,
          avatar,
        });
      } else {
        this.helps.toast(res.info);
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
          diamond: '',
        });
        return false;
      }
      const res = await this.helps.webHttp.get('/spreadApi/getDiamondsByMoney', { money: val });
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
    const payEnum = this.helps;
    return (
      <div className="alignCenterContainer">
        <Title>充值</Title>
        <WingBlank>
          <WhiteSpace size="md" />
          {
            avatar &&
            (
              <IconImg className={styles.userAvatar} src={avatar} />
            )
          }
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>ID　　</BaseFont>
            <Input
              onChange={ev => this.idValChange(ev.target.value)}
              placeholder="请输入六位ID号"
              maxLength={11}
              disabled={disabledUserEditId}
              value={heroID}
            />
          </FlexRow>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>用户名</BaseFont>
            <Input
              placeholder="根据ID自动检测"
              value={userName}
              disabled
            />
          </FlexRow>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>金额　</BaseFont>
            <Input
              onChange={ev => this.moneyValChange(ev.target.value)}
              placeholder="请输入金额数"
              disabled={disabledUserEditId}
              maxLength={11}
              value={money}
            />
          </FlexRow>
          <FlexRow className={styles.inputContainer}>
            <BaseFont className={styles.inputLabel}>钻石　</BaseFont>
            <Input
              placeholder="根据金额自动检测"
              value={diamond}
              disabled
            />
          </FlexRow>
          <WhiteSpace size="lg" />
          <Button
            className={styles.payBtn}
            onClick={() => this.recharge(payEnum.WECHAT)}
          >
          微信支付
          </Button>
          <Button
            className={styles.payBtn}
            onClick={() => this.recharge(payEnum.ALI)}
          >
          支付宝支付
          </Button>
        </WingBlank>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Pay);
