import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';

import { Button, InputItem, NavBar, Icon } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { WhiteSpace, WingBlank, FlexRow, FlexRowBetweenWingSpace, IconImg, Title } from '@/helps/styleComponent';
import styles from './Pay.css';

const paySource = {
  wx: require('../../assets/wx.png'),
  zfb: require('../../assets/zfb.png'),
};

const selectDiamondArr = [10, 100, 500];

class Pay extends BaseComponent {
  constructor(props) {
    super(props);
    const searchText = this.props.location.search.substr(1);
    const query = this.helps.querystring.parse(searchText);
    const { playerId } = query;
    const { payEnum } = this.helps;
    this.state = {
      diamond: '', // 钻石
      playerName: '', // 用户名
      playerId,
      playerNotFind: false, // 玩家是否未找到
      isChooseInput: false, // 是否选择其他数额
      selectIndex: -1,
      payTypeSelect: payEnum.WECHAT,
    };
    this.idTimer = null;
    this.paySelectArr = [
      {
        payTypeName: '微信支付',
        paySource: paySource.wx,
        payType: payEnum.WECHAT,
      },
      {
        payTypeName: '支付宝支付',
        paySource: paySource.zfb,
        payType: payEnum.ALI,
      },
    ];
  }
  async componentWillMount() {
    this.idValChange(this.state.playerId);
  }
  // 充值
  recharge = async () => {
    const type = this.state.payTypeSelect;
    const chargeType = this.helps.payType(type);
    // HeroID 玩家ID Diamond充值数量  TimeTick 充值时间
    const { diamond, playerId, playerNotFind } = this.state;
    if (!playerId || playerId.length < 6 || playerNotFind) {
      this.helps.toast('玩家不存在');
      return;
    }
    if (!diamond) {
      this.helps.toast('请选择钻石个数');
      return;
    }
    const money = diamond * 10;
    const moneyFloat = this.parseFloatMoney(money);
    const { proxyid } = this.props;
    const params = {
      pid: proxyid,
      HeroID: playerId,
      money: moneyFloat,
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
    this.setState({
      playerId: val,
    });
    this.idTimer = setTimeout(async () => {
      if (!val || val.length < 6) {
        this.setState({
          playerName: '',
        });
        return false;
      }
      // 获取头像和名称
      const res = await this.helps.webHttp.get('/spreadApi/getPlayerInfoById', { heroID: val });
      if (res.isSuccess) {
        const { userName } = res.data;
        this.setState({
          playerName: userName,
          playerNotFind: false,
        });
      } else {
        this.setState({
          playerNotFind: true,
        });
        this.helps.toast(res.info);
      }
    }, 500);
  }
  // 金额发生改变
  diamondValChange = (ev) => {
    const val = ev.target.value;
    if (val.length > 4 || isNaN(val) || val.indexOf('.') !== -1) {
      return;
    }
    this.setState({
      diamond: val,
    });
  }
  // 选择其他面板
  selectOtherCount = () => {
    this.setState({
      isChooseInput: true, // 是否选择其他数额
      selectIndex: 'selfSelect',
      diamond: '',
    });
  }
  // 退出编辑
  selectOtherBlur = () => {
    this.setState({
      isChooseInput: false,
      selectIndex: (this.state.diamond && this.state.diamond != 0) ? 'selfSelect' : -1,
    });
  }
  // 选择钻石数额
  selectMasonry = (count, selectIndex) => {
    this.setState({
      selectIndex,
      diamond: count,
    });
  }
  selectPayType = (payType) => {
    this.setState({
      payTypeSelect: payType,
    });
  }
  render() {
    const { playerName, diamond, playerNotFind, isChooseInput, selectIndex, payTypeSelect, playerId } = this.state;
    const money = !isNaN(diamond) ? diamond * 10 : 0;
    const moneyFloat = this.parseFloatMoney(money);
    // const { payEnum } = this.helps;
    return (
      <div>
        <Title>给玩家充值</Title>
        <NavBar
          title="给玩家充值"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <div className={styles.playerInputWrap}>
          <InputItem onChange={this.idValChange} value={playerId} type="number" maxLength={8} placeholder="请输入ID/推广码" />
          {
            playerNotFind
            ? (<div className={styles.playerNotFind}>玩家ID不存在</div>)
            : (<div className={styles.playerName}>{playerName}</div>)
          }
          <div className={styles.selectCountWrap}>
            <div className={styles.rechargeTitle}>玩家购钻比例统一1元10个钻石</div>
            <div className={styles.masonryInputWrap}>
              {
                selectDiamondArr.map((diamondCount, i) => (
                  <div
                    className={classNames(styles.masonrySelect, { [styles.masonrySelectd]: i === selectIndex })}
                    key={diamondCount}
                    onClick={() => this.selectMasonry(diamondCount, i)}
                  >
                    {`${diamondCount} 个钻`}
                  </div>
                ))
              }
              <div
                onClick={() => this.selectMasonry('', 'selfSelect')}
                className={classNames({ [styles.selfSelectWrap]: true, [styles.masonrySelectd]: selectIndex === 'selfSelect' })}
              >
                {
                  isChooseInput
                  ? (<input
                    className={styles.masonryInput}
                    value={diamond}
                    onChange={this.diamondValChange}
                    onBlur={this.selectOtherBlur}
                    autoFocus
                    maxLength={4}
                  />)
                  : (<div
                    className={styles.masonrySelectLabel}
                    onClick={this.selectOtherCount}
                  >
                    {
                      (diamond && selectIndex === 'selfSelect') ? `${diamond} 个钻` : '其他数额'
                    }
                  </div>)
                }
              </div>
            </div>
            <WhiteSpace />
          </div>
        </div>
        <WhiteSpace />
        <div className={styles.payTypeTitle}>支付方式</div>
        {
          this.paySelectArr.map(payInfo => (
            <div
              key={payInfo.payType}
              className={styles.paySelectItem}
              onClick={() => this.selectPayType(payInfo.payType)}
            >
              <FlexRow>
                <IconImg src={payInfo.paySource} className={styles.payIcon} />
                <span>{payInfo.payTypeName}</span>
              </FlexRow>
              {
                payTypeSelect === payInfo.payType && <Icon type="check" />
              }
            </div>
          ))
        }
        <div className={styles.priceTip}>价格：<span className={styles.priceCount}>{moneyFloat}元</span></div>
        <WingBlank>
          <Button
            className={styles.payBtn}
            onClick={this.recharge}
          >
          立即充值
          </Button>
        </WingBlank>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(Pay);
