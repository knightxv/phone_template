import React from 'react';
import { connect } from 'dva';
import classNames from 'classnames';

import ScrollTop from '@/components/ScrollTop';
import { BodyScrollListView, ScrollListView } from '@/helps/lazyComponent/ScrollListView';
import { StickyContainer, Sticky } from '@/helps/lazyComponent/ReactSticky';
import Button from '@/helps/antdComponent/Button';
import NavBar from '@/helps/antdComponent/NavBar';
// import ListView from '@/helps/antdComponent/ListView';
import { Icon, InputItem, Modal } from '@/helps/antdComponent/index.js';
import SearchBar from '@/helps/antdComponent/SearchBar';
// import InputItem from '@/helps/antdComponent/InputItem';
import BaseComponent from '@/helps/BaseComponent';
import { WhiteSpace, Title } from '@/helps/styleComponent';
import styles from './TurnDiaForPlayer.less';


class TurnDiaForPlayer extends BaseComponent {
  constructor(props) {
    super(props);
    const { playerId, serverid } = this.router.getQuery();
    // const { payEnum } = this.helps;
    // let defaultPayEnum = payEnum.WECHAT;
    // const paySelectArr = this.power();
    // if (paySelectArr.length > 0) {
    //   defaultPayEnum = paySelectArr[0].payType;
    // }
    this.state = {
      playerName: '', // 用户名
      playerId,
      errorTip: '', // 错误提示
      // diamond: selectDiamondArr[defaultSelectIndex], // 钻石
      // isChooseInput: false, // 是否选择其他数额
      // selectIndex: defaultSelectIndex,
      // payTypeSelect: defaultPayEnum,
      record: [],
      players: [], // 玩家
      diamond: '',
      selectplayerVisible: false,
      searchVal: '',
    };
    this.idTimer = null;
    this.serverid = serverid; // 游戏的id
    this.todayTimeStamp = new Date(new Date().format('yyyy/MM/dd')).getTime();
    this.monthTimeStamp = this.helps.getMonthTimeStamp();
    this.loadPlayers = false;
    // this.paySelectArr = [];
  }
  async componentWillMount() {
    this.idValChange(this.state.playerId);
    const { serverid } = this.router.getQuery();
    const res = await this.http.webHttp.get('/spreadApi/agentSellPlayerDiaRecord', {
      serverid,
    });
    if (res.isSuccess) {
      const record = res.data;
      this.setState({
        record,
      });
    }
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
          errorTip: '',
        });
        return false;
      }
      // 获取头像和名称
      const res = await this.http.webHttp.get('/spreadApi/getPlayerInfoById', { heroID: val, serverid: this.serverid });
      if (res.isSuccess) {
        if (this.hasPower('playerRange', 1)) {
          let palyers = this.state.players;
          if (!this.loadPlayers) {
            palyers = await this.getPlayer();
          }
          const isUnderPlayer = palyers.some((player) => {
            return player.playerId == val;
          });
          if (isUnderPlayer) {
            const { userName } = res.data;
            this.setState({
              playerName: userName,
              errorTip: '',
            });
          } else {
            this.setState({
              playerName: '',
              errorTip: '该玩家非您的下级',
            });
          }
        } else {
          // 所有玩家
          const { userName } = res.data;
          this.setState({
            playerName: userName,
            errorTip: '',
          });
        }
      } else {
        this.setState({
          playerName: '',
          errorTip: res.info || '玩家未找到',
        });
      }
    }, 500);
  }
  // 钻石数量
  diamondChange = (diamond) => {
    this.setState({
      diamond,
    });
  }
  // 跳转订单详情
  goOrderDetail = (orderId) => {
    const { serverid } = this.router.getQuery();
    this.router.go('/turnDiaForPlayerOrderDetail', { orderId, serverid });
  }
  renderRow = (row) => {
    const {
      chargeTime,
      chargeCount,
      chargeInfo,
      orderId,
     } = row;
    const chargeTimeLabel = new Date(chargeTime).format('yyyy-MM-dd hh:mm:ss');
    return (<div className={styles.recordRowItem} onClick={() => this.goOrderDetail(orderId)}>
      <div>
        <div> { chargeInfo } </div>
        <div className={styles.recordItemTime}>{ chargeTimeLabel }</div>
      </div>
      <div className={styles.recordItemCountLabel}>
        <span className={styles.count}>{ chargeCount }个钻石</span>
        <Icon type="right" />
      </div>
    </div>);
  }
  // 获取玩家数据
  getPlayer = async () => {
    const res = await this.http.webHttp.get('/spreadApi/getPlayers');
    if (res.isSuccess) {
      this.setState({
        players: res.data || [],
      });
      this.loadPlayers = true;
    }
    return res.data || [];
  }
  // 选择玩家
  showChoosePlayerPicker = () => {
    // 弹出picker
    this.toggleSelectplayerVisible();
    // 获取数据
    this.getPlayer();
  }
  // 玩家picker的显示与隐藏
  toggleSelectplayerVisible = () => {
    this.setState({
      selectplayerVisible: !this.state.selectplayerVisible,
    });
  }
  // 跳转充值页面
  goToNext = () => {
    const { diamond, playerId, errorTip, playerName } = this.state;
    if (!playerId || playerId.length < 6) {
      return;
    }
    if (errorTip) {
      this.message.info(errorTip);
      return;
    }
    if (!diamond) {
      this.message.info('请选择钻石个数');
      return;
    }
    const { serverid } = this.router.getQuery();
    this.router.go('/payToTurnDiaForPlayer', {
      playerId,
      playerName,
      serverid,
      diamond,
    });
  }
  onSearchInputChange = (searchVal) => {
    this.setState({
      searchVal,
    });
  }
  onCancelClick = () => {
    this.setState({
      searchVal: '',
    });
  }
  renderHeader = () => {
    return (<div className={styles.playersItemWrap}>
      <div className={styles.playersItem}>玩家</div>
      <div className={styles.playersItem}>账户钻石</div>
      <div className={styles.playersItemOption}>操作</div>
    </div>);
  }
  selectPlayer = (playerId) => {
    this.toggleSelectplayerVisible();
    this.idValChange(playerId);
  }
  cancelSavePlayer = async (heroId) => {
    const { serverid } = this.router.getQuery();
    const res = await this.http.webHttp.get('/spreadApi/cancelSavePlayer', {
      heroId,
      serverid,
    });
    if (res.isSuccess) {
      const { players } = this.state;
      const newPlayers = players.filter((play) => {
        return play.playerId !== heroId;
      });
      this.setState({
        players: newPlayers,
      });
    }
    this.message.info(res.info);
  }
  renderPlayerRow = (row) => {
    const { masonrySurplus, playerId, playerName } = row;
    const hasPowerToSave = this.hasPower('playerRange', 0);
    return (<div className={styles.playersItemWrap}>
      <div className={styles.playersItem}>
        <div>{ playerName }</div>
        <div>{ playerId }</div>
      </div>
      <div className={styles.playersItem}>{ masonrySurplus }</div>
      <div className={styles.playersItemOption}>
        <div className={styles.optionWrap}>
          <Button size="small" onClick={() => this.selectPlayer(playerId)}>选中</Button>
          {
            hasPowerToSave &&
            <Button size="small" onClick={() => this.cancelSavePlayer(playerId)} type="danger" className={styles.btnDanger}>删除</Button>
          }
        </div>
      </div>
    </div>);
  }
  scrollTop = () => {
    // window.location
    // scrollNode.scrollTop(0, 0);
    window.location.reload();
  }
  renderRecordHeader = () => {
    const { record } = this.state;
    let allCount = 0;
    let monthCount = 0;
    let incomeToday = 0;
    let incomeMonth = 0;
    record.forEach((data) => {
      if (data.chargeTime >= this.todayTimeStamp) {
        incomeToday += data.chargeMoney;
      }
      if (data.chargeTime >= this.monthTimeStamp) {
        incomeMonth += data.chargeMoney;
      }
      if (data.chargeTime >= this.monthTimeStamp) {
        monthCount += data.chargeCount;
      }
      allCount += data.chargeCount;
    });
    const incomeTodayLabel = this.helps.parseFloatMoney(incomeToday);
    const incomeMonthLabel = this.helps.parseFloatMoney(incomeMonth);
    return (<div className={styles.recordHeader}>
      <div>
        <div>
          本月充钻数量:<span className={styles.count}>{ monthCount }</span>个
        </div>
        <div>
        充钻总数量:<span className={styles.count}>{ allCount }</span>个
        </div>
      </div>
      <div>
        {
          this.hasPowerSome('banlance') &&
          <div>
            本月收益:<span className={styles.money}>{ incomeMonthLabel }</span>元
          </div>
        }
        {
          this.hasPowerSome('banlance') &&
          <div>
            今日收益:<span className={styles.money}>{ incomeTodayLabel }</span>元
          </div>
        }
      </div> 
    </div>);
  }
  render() {
    const { playerName, diamond, errorTip, playerId,
      record, selectplayerVisible, searchVal, players,
      // isChooseInput, selectIndex, payTypeSelect,
    } = this.state;
    // const { payEnum } = this.helps;
    const money = !isNaN(diamond) ? diamond * 10 : 0;
    const moneyFloat = this.helps.parseFloatMoney(money);
    const { masonry } = this.props;
    // const paySelectArr = this.power(); //  为了处理双击刷新问题
    const filterPlayersData = players.filter((player) => {
      if (!searchVal) {
        return true;
      }
      return player.playerId.toString().indexOf(searchVal)
      !== -1 || player.playerName.toString().indexOf(searchVal) !== -1;
    });
    const hasPowerToGive = this.hasPowerSome('wechatPayForAgentTurnDiaToPlayer', 'AliPayForAgentTurnDiaToPlayer');
    return (
      <div>
        <Title>给玩家充钻</Title>
        <NavBar
          title="给玩家充钻"
          onClick={this.router.back}
        />
        <div className={styles.playerInputWrap}>
          <InputItem
            onChange={this.idValChange}
            value={playerId}
            type="number"
            maxLength={8}
            clear
            placeholder="请输入玩家ID"
            extra={<Button size="small" onClick={this.showChoosePlayerPicker}>选择玩家</Button>}
          >玩家ID</InputItem>
          {
            errorTip && <div className={styles.playerNotFind}>{ errorTip }</div>
          }
          {
            playerName && <div className={styles.playerName}>{playerName}</div>
          }
        </div>
        <WhiteSpace />
        <div className={styles.playerInputWrap}>
          <InputItem
            onChange={this.diamondChange}
            value={diamond}
            type="number"
            clear
            placeholder={`本次最多转出${masonry}个钻`}
          >钻石数量</InputItem>
        </div>
        {
          hasPowerToGive &&
          <div>
            <div className={styles.priceTip}>注:玩家购钻价格统一0.1元/钻</div>
            <div className={styles.priceWrap}>
              价格:<span className={styles.money}>{ moneyFloat}</span>元
            </div>
          </div>
        }
        <div className={styles.payBtnWrap}>
          <Button
            className={styles.payBtn}
            onClick={this.goToNext}
          >
          下一步
          </Button>
        </div>
        <StickyContainer>
          <Sticky>
            {
              ({
              style,
                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight,
              }) => {
                return (
                  <div className={styles.listWrap} style={style}>
                    {
                      wasSticky
                      ? <ScrollListView
                        ref={(node) => { this.scroll = node; }}
                        data={record}
                        renderRow={this.renderRow}
                        renderHeader={this.renderRecordHeader}
                      />
                        : <BodyScrollListView
                          ref={(node) => { this.scroll = node; }}
                          data={record}
                          renderRow={this.renderRow}
                          renderHeader={this.renderRecordHeader}
                        />
                    }
                    {
                      wasSticky && <ScrollTop onClick={this.scrollTop} />
                    }
                  </div>
                );
              }
            }
          </Sticky>
        </StickyContainer>
        {/* 选择玩家picker */}
        <Modal
          popup
          maskClosable
          className={styles.payModal}
          visible={selectplayerVisible}
          onClose={this.toggleSelectplayerVisible}
        >
          <div className={styles.payPicker}>
            <div className={styles.pickerHideMask} onClick={this.toggleSelectplayerVisible} />
            <div className={styles.payPickerBody}>
              <div className={styles.pickerHeader}>
                <Icon type="cross" size="lg" onClick={this.toggleSelectplayerVisible} />
                <div className={styles.pickerTitle}>选择玩家</div>
                <div className={styles.iconRight} />
              </div>
              <div className={styles.playerPickerContainer}>
                <SearchBar
                  placeholder="输入玩家的ID/名称"
                  onChange={this.onSearchInputChange}
                  value={searchVal}
                />
                <ScrollListView
                  data={filterPlayersData}
                  renderHeader={this.renderHeader}
                  renderRow={this.renderPlayerRow}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(TurnDiaForPlayer);
