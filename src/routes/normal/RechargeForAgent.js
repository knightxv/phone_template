import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';

import { Button, InputItem, NavBar } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { WhiteSpace, WingBlank, FlexRow, Title } from '@/helps/styleComponent';
import styles from './RechargeForAgent.css';

const selectDiamondArr = [10, 100, 500];

class RechargeForAgent extends BaseComponent {
  constructor(props) {
    super(props);
    const searchText = this.props.location.search.substr(1);
    const query = this.helps.querystring.parse(searchText);
    const { agentId } = query;
    const { powerEnum } = this.helps;
    this.state = {
      diamond: '', // 钻石
      agentId,
      // playerName: '', // 用户名
      // playerNotFind: false, // 玩家是否未找到
      isChooseInput: false, // 是否选择其他数额
      selectIndex: -1,
    };
    this.idTimer = null;
    const { powerList } = this.props;
    this.hasPowerToRechargeAny = powerList && powerList.findIndex((power) => {
      return power === powerEnum.rechargeForAnyAgent;
    }) > -1;
  }
  async componentWillMount() {
    // this.idValChange(this.state.agentId);
  }
  // 赠送钻石
  rechargeForAgent = async () => {
    const { agentId, diamond } = this.state;
    const params = {
      agentId,
      diamond,
    };
    const res = await this.helps.webHttp.get('/spreadApi/general/giveDiamond', params);
    if (!res.isSuccess) {
      this.helps.toast(res.info || '赠送失败');
    } else {
      this.helps.toast('赠送成功');
      this.props.dispatch(this.helps.routerRedux.goBack());
    }
    // 更新用户数据
    const updateRes = await this.helps.webHttp.get('/spreadApi/getUserInfo');
    if (updateRes.isSuccess) {
      this.props.dispatch({ type: 'agent/updateAppInfo', payload: { ...updateRes.data } });
    }
  }
  // id发生改变
  idValChange = (val) => {
    this.setState({
      agentId: val,
    });
    // clearTimeout(this.idTimer);
    // this.idTimer = setTimeout(async () => {
    //   if (!val || val.length < 6) {
    //     this.setState({
    //       playerName: '',
    //     });
    //     return false;
    //   }
    //   // 获取头像和名称
    //   const res = await this.helps.webHttp.get('/spreadApi/getPlayerInfoById', { heroID: val, serverid: this.serverid });
    //   if (res.isSuccess) {
    //     const { userName } = res.data;
    //     this.setState({
    //       playerName: userName,
    //       playerNotFind: false,
    //     });
    //   } else {
    //     this.setState({
    //       playerNotFind: true,
    //     });
    //     this.helps.toast(res.info);
    //   }
    // }, 500);
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
  render() {
    const { diamond, isChooseInput, selectIndex, agentId } = this.state;
    const { canCashCount } = this.props;
    const canCashCountFloat = this.parseFloatMoney(canCashCount);
    const rechargeCount = diamond * 10;
    const moneyFloat = this.parseFloatMoney(rechargeCount);
    const isCanRecharge = canCashCount >= rechargeCount && canCashCount !== 0 && rechargeCount !== 0;
    return (<div>
      <Title>给代理充值</Title>
      <NavBar
        title="给代理充值"
        onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
      />
      <div className={styles.playerInputWrap}>
        <InputItem
          disabled={!this.hasPowerToRechargeAny}
          placeholder="请输入代理ID"
          onChange={this.idValChange}
          value={agentId}
          type="number"
          maxLength={8}
        >代理ID：</InputItem>
        {/* {
          playerNotFind
          ? (<div className={styles.playerNotFind}>玩家ID不存在</div>)
          : (<div className={styles.playerName}></div>)
        } */}
        <div className={styles.selectCountWrap}>
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
      <div className={styles.priceTip}>充值价格：<span className={styles.priceCount}>{moneyFloat}元</span></div>
      <div className={styles.priceTip}>我的余额：<span className={styles.priceCount}>{canCashCountFloat}元</span></div>
      <WingBlank>
        <Button
          disabled={!isCanRecharge}
          className={styles.payBtn}
          onClick={this.rechargeForAgent}
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

export default connect(mapStateToProps)(RechargeForAgent);
