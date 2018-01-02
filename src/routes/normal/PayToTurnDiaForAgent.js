import React from 'react';
import { connect } from 'dva';
// import { window } from 'global';
import { Checkbox } from 'antd-mobile';

import BaseComponent from '@/helps/BaseComponent';
import { Button } from '@/helps/antdComponent/index.js';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title } from '@/helps/styleComponent';
import styles from './PayToTurnDiaForPlayer.less';

class PayToTurnDiaForAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAutoSave: true,
    };
    this.query = this.router.getQuery();

  }
  // 跳出支付picker
  togglePayPicker = () => {
    this.setState({
      payPickerVisible: !this.state.payPickerVisible,
    });
  }
  goToPay = async () => {
    const { diamond, agentId } = this.query;
    const { isAutoSave } = this.state;
    const res = await this.http.webHttp.get('/spreadApi/iAgentGiveForAgent', {
      agentId,
      diamond,
      isSaveCommon: isAutoSave,
    });
    if (res.isSuccess) {
      this.router.back();
    }
    this.message.info(res.info || '赠送成功');
  }
  toggleSave = () => {
    this.setState({
      isAutoSave: !this.state.isAutoSave,
    });
  }
  render() {
    const { isAutoSave } = this.state;
    const { inviteCode, masonry } = this.props;
    const { diamond, agentName, agentId } = this.query;
    // const canCashCountLabel = this.helps.parseFloatMoney(canCashCount);
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
                <div className={styles.turnInfoItemKey}>收款代理ID:</div>
                <div className={styles.turnInfoItemVal}>
                  <span className={styles.count}>{ agentId }</span>
                </div>
              </div>
              <div className={styles.turnInfoItem}>
                <div className={styles.turnInfoItemKey}>转出钻石数量:</div>
                <div className={styles.turnInfoItemVal}>
                  <span className={styles.count}>{ diamond }</span>个
                </div>
              </div>
            </div>
          </div>
          {
            this.hasPower('agentRange', 0) &&
            <div className={styles.autoSaveWrap}>
              <Checkbox checked={isAutoSave} onChange={this.toggleSave} />
              <span className={styles.saveTip}>转钻提交成功后自动添加为常用收款代理</span>
            </div>
          }
          <div className={styles.buyBtnWrap}>
            <Button onClick={this.goToPay}>确认转钻</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.agent,
  };
};

export default connect(mapStateToProps)(PayToTurnDiaForAgent);
