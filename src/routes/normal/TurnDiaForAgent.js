import React from 'react';
import { connect } from 'dva';
// import classNames from 'classnames';
import classnames from 'classnames';
import BaseComponent from '@/core/BaseComponent';
import SearchInput from '@/components/SearchInput';
import SlideUpModal from '@/components/Modal/SlideUpModal';
import { ScrollListView } from '@/components/lazyComponent/ScrollListView';
import { Icon, InputItem, NavBar, Button } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './TurnDiaForAgent.less';

class TurnDiaForAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      agentName: '', // 用户名
      agentId: '',
      agentNotFind: false, // 代理是否未找到
      agents: [], // 可选代理
      diamond: '',
      selectplayerVisible: false,
      searchVal: '',
    };
    this.idTimer = null;
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
          agentName: agentName || '昵称',
          agentNotFind: false,
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
    const { masonry } = this.props;
    if (!agentId || agentId.length < 6 || agentNotFind) {
      this.message.info('代理不存在');
      return;
    }
    if (!diamond || diamond <= 0) {
      this.message.info('请选择钻石个数');
      return;
    }
    if (diamond > masonry) {
      this.message.info('转出的钻石不能超过账户余额');
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
  render() {
    const { agentName, diamond, agentNotFind, agentId,
      selectplayerVisible, searchVal, agents,
    } = this.state;
    const { masonry } = this.props;
    const filterAgentsData = agents.filter((agent) => {
      if (!searchVal) {
        return true;
      }
      return String(agent.agentInviteCode).indexOf(searchVal)
      !== -1 || String(agent.agentName).indexOf(searchVal) !== -1;
    });

    return (
      <div>
        <Title>给代理充钻</Title>
        <NavBar
          title="给代理充钻"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
            <div className={styles.inputWrap}>
              <InputItem
                onChange={this.idValChange}
                value={agentId}
                type="number"
                clear
                placeholder="请输入代理ID"
                extra={<Button size="small" onClick={this.showChoosePlayerPicker}>选择代理</Button>}
              />
              {
                agentNotFind && <div className={styles.playerNotFind}>代理不存在</div>
              }
              {
                agentName && <div className={styles.playerName}>{agentName}</div>
              }
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                onChange={this.diamondChange}
                value={diamond}
                type="number"
                clear
                maxLength={8}
                placeholder="请输入转出钻石数量"
              />
            </div>
            <div className={styles.masonryTip}>
              账户钻石数量：<span className={styles.count}>{masonry}</span>个
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.btnWrap}>
              <Button
                onClick={this.goToNext}
              >
              下一步
              </Button>
            </div>
            <div className={styles.btnWrap}>
              <Button
                onClick={() => this.router.go('/turnDiaForAgentRecord')}
                type="green"
              >
              购钻记录
              </Button>
            </div>
          </div>
        </div>
        <SlideUpModal
          visible={selectplayerVisible}
          onClose={this.toggleSelectplayerVisible}
        >
          <div className={styles.payPickerBody}>
            <div className={styles.pickerHeader}>
              <div className={styles.iconRight} />
              <div className={styles.pickerTitle}>选择代理</div>
              <Icon type="cross" size="lg" onClick={this.toggleSelectplayerVisible} />
            </div>
            <div className={styles.playerPickerContainer}>
              <div className={styles.searchInputWrap}>
                <SearchInput
                  placeholder="输入代理的ID/名称"
                  onChange={this.onSearchInputChange}
                  value={searchVal}
                />
              </div>
              <ScrollListView
                data={filterAgentsData}
                renderHeader={this.renderHeader}
                renderRow={this.renderAgentRow}
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

export default connect(mapStateToProps)(TurnDiaForAgent);
