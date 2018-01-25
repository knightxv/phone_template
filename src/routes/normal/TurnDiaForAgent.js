import React from 'react';
import { connect } from 'dva';
// import classNames from 'classnames';
import ScrollTop from '@/components/ScrollTop';

import BaseComponent from '@/core/BaseComponent';
import { ScrollListView } from '@/components/lazyComponent/ScrollListView';
import { StickyContainer, Sticky } from '@/components/lazyComponent/ReactSticky';
import { Icon, InputItem, Modal, SearchBar, NavBar, Button } from '@/components/lazyComponent/antd';
import { WhiteSpace, Title } from '@/components/styleComponent';
import styles from './TurnDiaForAgent.less';

class TurnDiaForAgent extends BaseComponent {
  constructor(props) {
    super(props);
    // const { payEnum } = this.helps;
    // let defaultPayEnum = payEnum.WECHAT;
    // const paySelectArr = this.power();
    // if (paySelectArr.length > 0) {
    //   defaultPayEnum = paySelectArr[0].payType;
    // }
    this.state = {
      agentName: '', // 用户名
      agentId: '',
      agentNotFind: false, // 玩家是否未找到
      // diamond: selectDiamondArr[defaultSelectIndex], // 钻石
      // isChooseInput: false, // 是否选择其他数额
      // selectIndex: defaultSelectIndex,
      // payTypeSelect: defaultPayEnum,
      record: [],
      agents: [
      ], // 玩家
      diamond: '',
      selectplayerVisible: false,
      searchVal: '',
    };
    this.idTimer = null;
    this.todayTimeStamp = new Date(new Date().format('yyyy/MM/dd')).getTime();
    this.monthTimeStamp = this.helps.getMonthTimeStamp();
    // this.paySelectArr = [];
  }
  async componentWillMount() {
    const res = await this.http.webHttp.get('/spreadApi/agentSellDiaRecord');
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
      agentId: val,
    });
    this.idTimer = setTimeout(async () => {
      if (!val || val.length < 6) {
        this.setState({
          agentName: '',
        });
        return false;
      }
      // 获取头像和名称
      const res = await this.http.webHttp.get('/spreadApi/getAgentInfoById', { agentId: val });
      if (res.isSuccess) {
        const { agentName } = res.data;
        this.setState({
          agentName,
          agentNotFind: !agentName,
        });
      } else {
        this.setState({
          agentName: '',
          agentNotFind: true,
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
    this.router.go('/turnDiaForAgentOrderDetail', { orderId });
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
        <Icon type="right" color="#b8b8b8" />
      </div>
    </div>);
  }
  // 获取玩家数据
  getAgents = async () => {
    const res = await this.http.webHttp.get('/spreadApi/getAgents');
    if (res.isSuccess) {
      this.setState({
        agents: res.data || [],
      });
    }
  }
  // 选择玩家
  showChoosePlayerPicker = () => {
    // 弹出picker
    this.toggleSelectplayerVisible();
    // 获取数据
    this.getAgents();
  }
  // 玩家picker的显示与隐藏
  toggleSelectplayerVisible = () => {
    this.setState({
      selectplayerVisible: !this.state.selectplayerVisible,
    });
  }
  // 跳转充值页面
  goToNext = () => {
    const { diamond, agentId, agentNotFind, agentName } = this.state;
    if (!agentId || agentId.length < 6 || agentNotFind) {
      this.message.info('代理不存在');
      return;
    }
    if (!diamond) {
      this.message.info('请选择钻石个数');
      return;
    }
    this.router.go('/payToTurnDiaForAgent', {
      agentId,
      agentName,
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
      <div className={styles.playersItem}>代理</div>
      <div className={styles.playersItem}>账户钻石</div>
      <div className={styles.playersItemOption}>操作</div>
    </div>);
  }
  selectAgent = (agentId) => {
    this.toggleSelectplayerVisible();
    this.idValChange(agentId);
  }
  cancelSave = async (agentInviteCode) => {
    const res = await this.http.webHttp.get('/spreadApi/cancelSaveAgent', {
      agentInviteCode,
    });
    if (res.isSuccess) {
      const { agents } = this.state;
      const newAgents = agents.filter((agent) => {
        return agent.agentInviteCode !== agentInviteCode;
      });
      this.setState({
        agents: newAgents,
      });
    }
    this.message.info(res.info);
  }
  renderAgentRow = (row) => {
    console.log(row);
    const { masonrySurplus, agentInviteCode, agentName } = row;
    const hasPowerToSave = this.hasPower('agentRange', 0);
    return (<div className={styles.playersItemWrap}>
      <div className={styles.playersItem}>
        <div className={styles.rowAgentName}>{ agentName }</div>
        <div>{ agentInviteCode }</div>
      </div>
      <div className={styles.playersItem}>{ masonrySurplus }</div>
      <div className={styles.playersItemOption}>
        <div className={styles.optionWrap}>
          <Button size="small" onClick={() => this.selectAgent(agentInviteCode)}>选中</Button>
          {
            hasPowerToSave &&
            <Button size="small" onClick={() => this.cancelSave(agentInviteCode)} type="danger" className={styles.btnDanger}>删除</Button>
          }
        </div>
      </div>
    </div>);
  }
  renderRecordHeader = () => {
    const { record } = this.state;
    let allCount = 0;
    let monthCount = 0;
    record.forEach((data) => {
      if (data.chargeTime >= this.monthTimeStamp) {
        monthCount += data.chargeCount;
      }
      allCount += data.chargeCount;
    });
    return (<div className={styles.recordHeader}>
      <div>
        <div>
          本月购钻数量:<span className={styles.count}>{ monthCount }</span>个
        </div>
        <div>
          总购钻数量:<span className={styles.count}>{ allCount }</span>个
        </div>
      </div>
    </div>);
  }
  scrollTop = () => {
    const scrollNode = this.scroll;
    if (scrollNode) {
      scrollNode.scrollTo && scrollNode.scrollTo(0, 0);
    }
  }
  render() {
    const { agentName, diamond, agentNotFind, agentId,
      record, selectplayerVisible, searchVal, agents,
    } = this.state;
    const { masonry } = this.props;
    const filterAgentsData = agents.filter((agent) => {
      if (!searchVal) {
        return true;
      }
      return agent.agentInviteCode.toString().indexOf(searchVal)
      !== -1 || agent.agentName.toString().indexOf(searchVal) !== -1;
    });

    return (
      <div>
        <Title>给代理充钻</Title>
        <NavBar
          title="给代理充钻"
          onClick={this.router.back}
        />
        <div>
          <div className={styles.playerInputWrap}>
            <InputItem
              onChange={this.idValChange}
              value={agentId}
              type="number"
              maxLength={8}
              clear
              placeholder="请输入代理ID"
              extra={<Button size="small" onClick={this.showChoosePlayerPicker}>选择代理</Button>}
            >代理ID</InputItem>
            {
              agentNotFind && <div className={styles.playerNotFind}>代理不存在</div>
            }
            {
              agentName && <div className={styles.playerName}>{agentName}</div>
            }
          </div>
          <WhiteSpace />
          <div className={styles.playerInputWrap}>
            <InputItem
              onChange={this.diamondChange}
              value={diamond}
              type="number"
              clear
              maxLength={8}
              placeholder={`本次最多转出${masonry}个钻`}
            >钻石数量</InputItem>
          </div>
          <div className={styles.payBtnWrap}>
            <Button
              className={styles.payBtn}
              onClick={this.goToNext}
            >
            下一步
            </Button>
          </div>
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
                    <div style={{ height: '1rem' }} />
                    { this.renderRecordHeader() }
                    <ScrollListView
                      data={record}
                      renderRow={this.renderRow}
                      getNode={(node) => { this.scroll = node; }}
                    />
                    {
                      wasSticky && <ScrollTop onClick={this.scrollTop} />
                    }
                  </div>
                );
              }
            }
          </Sticky>
        </StickyContainer>
        {/* 选择代理picker */}
        <Modal
          transparent
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
                <div className={styles.pickerTitle}>选择代理</div>
                <div className={styles.iconRight} />
              </div>
              <div className={styles.playerPickerContainer}>
                <SearchBar
                  placeholder="输入代理的ID/名称"
                  onChange={this.onSearchInputChange}
                  value={searchVal}
                />
                <ScrollListView
                  data={filterAgentsData}
                  renderHeader={this.renderHeader}
                  renderRow={this.renderAgentRow}
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

export default connect(mapStateToProps)(TurnDiaForAgent);
