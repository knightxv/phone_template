import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import BaseComponent from '@/core/BaseComponent';
import { ScrollListView } from '@/components/lazyComponent/ScrollListView';
import SlideUpModal from '@/components/Modal/SlideUpModal';
import { Icon, InputItem, SearchBar, NavBar, Button } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import Grid from '@/components/Grid';
import styles from './TurnDiaForPlayer.less';


class TurnDiaForPlayer extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '', // 用户名
      playerId: '',
      errorTip: '', // 错误提示
      players: [], // 玩家
      diamond: '', // 钻石(没有支付方式)
      selectplayerVisible: false,
      searchVal: '',
      goods: [], // 商品
      selectShopId: -1, // 选择商品的id
    };
    this.idTimer = null;
    this.loadPlayers = false;
    // this.paySelectArr = [];
  }
  async componentWillMount() {
    this.getGoods();
  }
  getGoods = async () => {
    const { serverid } = this.router.getQuery();
    const res = await this.http.webHttp.get('/spreadApi/goodsForAgentTurnDiaForPlayer', {
      serverid,
    });
    if (res.isSuccess) {
      const goods = res.data;
      this.setState({
        goods,
        selectShopId: goods.length > 0 ? goods[0].shopId : -1,
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
      const { serverid } = this.router.getQuery();
      const res = await this.http.webHttp.get('/spreadApi/getPlayerInfoById', { heroID: val, serverid });
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
  // // 跳转订单详情
  // goOrderDetail = (orderId) => {
  //   const { serverid } = this.router.getQuery();
  //   this.router.go('/turnDiaForPlayerOrderDetail', { orderId, serverid });
  // }
  // deleteOrder = async (orderId) => {
  //   const isComfirm = confirm('确认删除订单');
  //   if (isComfirm) {
  //     const res = await this.http.webHttp.get('/spreadApi/deleteAgentSellPlayerDia', {
  //       orderId,
  //     });
  //     if (!res.isSuccess) {
  //       this.message.info(res.info || '删除订单失败');
  //       return;
  //     }
  //     this.getRecord();
  //     this.message.info(res.info || '删除订单成功');
  //   }
  // }
  // 获取玩家数据
  getPlayer = async () => {
    const { serverid } = this.router.getQuery();
    const res = await this.http.webHttp.get('/spreadApi/getPlayers', {
      serverid,
    });
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
  turnDia = () => {
    const { diamond, playerId, errorTip, playerName, goods, selectShopId } = this.state;
    if (errorTip) {
      this.message.info(errorTip);
      return;
    }
    const { serverid } = this.router.getQuery();
    if (this.hasPowerTurnDiaForMoney()) {
      const shopSelectArr = goods.filter((good) => {
        return good.shopId === selectShopId;
      });
      const systemGift = shopSelectArr[0] ? shopSelectArr[0].systemGift : '';
      const shopId = shopSelectArr[0] ? shopSelectArr[0].shopId : '';
      const masonryCount = shopSelectArr[0] ? shopSelectArr[0].masonryCount : '';
      const payMoney = shopSelectArr[0] ? shopSelectArr[0].payMoney : '';
      this.router.go('/payToTurnDiaForPlayer', {
        playerId,
        playerName,
        serverid,
        systemGift,
        shopId,
        payMoney,
        diamond: masonryCount,
      });
    } else {
      if (!diamond || diamond == 0) {
        this.message.info('请选择钻石个数');
        return;
      }
      this.router.go('/payToTurnDiaForPlayer', {
        playerId,
        playerName,
        serverid,
        diamond,

      });
    }
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
  selectGoods = (shopId) => {
    this.setState({
      selectShopId: shopId,
    });
  }
  navigateRecord = () => {
    const { serverid } = this.router.getQuery();
    this.router.go('/turnDiaForPlayerRecord', {
      serverid,
    });
  }
  render() {
    const { playerName, errorTip, playerId, diamond,
      selectplayerVisible, searchVal, players, goods,
      selectShopId,
      // isChooseInput, selectIndex, payTypeSelect,
    } = this.state;
    const { masonry } = this.props;
    // const { payEnum } = this.helps;
    // const money = !isNaN(diamond) ? diamond * 10 : 0;
    // const moneyFloat = this.helps.parseFloatMoney(money);
    const filterPlayersData = players.filter((player) => {
      if (!searchVal) {
        return true;
      }
      return player.playerId.toString().indexOf(searchVal)
      !== -1 || player.playerName.toString().indexOf(searchVal) !== -1;
    });
    const hasPowerTurnDiaForMoney = this.hasPowerTurnDiaForMoney(); // 是否有权限用钱支付（是否只开了直接转钻）
    const title = hasPowerTurnDiaForMoney ? '替玩家购钻' : '给玩家转钻';
    const shopSelectArr = goods.filter((good) => {
      return good.shopId === selectShopId;
    });
    const shopTip = shopSelectArr[0] && shopSelectArr[0].tip;
    const btnDisabled = !playerId || playerId.length < 6;
    return (
      <div className={styles.container}>
        <Title>{ title }</Title>
        <NavBar
          title={title}
          onClick={() => this.router.go('/homePage')}
        />
        <div className={styles.contentContainer}>
          <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
            <div className={styles.inputWrap}>
              <InputItem
                onChange={this.idValChange}
                value={playerId}
                type="number"
                maxLength={8}
                clear
                placeholder="请输入玩家ID"
                extra={<div
                  size="small"
                  className={styles.borderBtn}
                  onClick={this.showChoosePlayerPicker}
                >选择玩家</div>}
              />
              {
                errorTip && <div className={styles.playerNotFind}>{ errorTip }</div>
              }
              {
                playerName && <div className={styles.playerName}>{playerName}</div>
              }
            </div>
            {
              hasPowerTurnDiaForMoney &&
              <div>
                <Grid>
                  {
                    goods.map(({ payMoney, masonryCount, shopId, systemGift, tip }, i) => {
                      const goodsWrapClass = classnames({
                        [styles.goodsWrap]: true,
                        [styles.goodsSelect]: selectShopId === shopId,
                      });
                      const systemGiftClass = classnames({
                        [styles.systemGift]: true,
                        [styles.systemGiftSelect]: selectShopId === shopId,
                      });
                      return (
                        <div
                          className={goodsWrapClass}
                          key={i}
                          onClick={() => this.selectGoods(shopId)}
                        >
                          <p className={styles.goodLabel}>
                            {masonryCount}钻{ +systemGift !== 0 && <span className={systemGiftClass}>+{systemGift}钻</span> }
                          </p>
                          <p className={styles.goodPrice}>售价:{this.helps.parseIntMoney(payMoney)}元</p>
                        </div>
                      );
                    })
                  }
                </Grid>
                {
                  <div className={styles.payTip}>{ shopTip || '　' }</div>
                }
              </div>
            }
            {
              !hasPowerTurnDiaForMoney &&
              <div className={classnames(styles.inputWrapItemDiamond)}>
                <div className={styles.inputWrapItem}>
                  <InputItem
                    onChange={val => this.setState({ diamond: val })}
                    value={diamond}
                    type="number"
                    maxLength={8}
                    clear
                    placeholder="请输入转出数量"
                  />
                </div>
                <div className={styles.masonryCountLabel}>
                  账户钻石数量:<span className={styles.masonryCount}>{ masonry }</span>个
                </div>
              </div>
            }
            <div className={styles.btnWrap}>
              <Button
                onClick={this.turnDia}
                disabled={btnDisabled}
              >
              下一步
              </Button>
            </div>
            <div className={styles.btnWrap}>
              <Button
                onClick={this.navigateRecord}
                type="green"
              >
              销钻记录
              </Button>
            </div>
          </div>
        </div>
        {/* 选择玩家picker */}
        <SlideUpModal
          visible={selectplayerVisible}
          onClose={this.toggleSelectplayerVisible}
        >
          <div className={styles.payPickerBody}>
            <div className={styles.pickerHeader}>
              <div className={styles.iconRight} />
              <div className={styles.pickerTitle}>选择玩家</div>
              <Icon type="cross" size="lg" onClick={this.toggleSelectplayerVisible} />
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
        </SlideUpModal>
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
