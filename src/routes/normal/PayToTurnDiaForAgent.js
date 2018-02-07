// import React from 'react';
// import { connect } from 'dva';
import React from 'react';
import { connect } from 'dva';
import { window } from 'global';
import { Checkbox } from 'antd-mobile';

import BaseComponent from '@/core/BaseComponent';
import { Button, NavBar } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import styles from './PayToTurnDiaForAgent.less';

const imgSource = {
  masonry: require('../../assets/zuanshi.png'),
};
class PayToTurnDiaForAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAutoSave: true,
    };
  }
  async componentWillMount() {
    if (this.props.history.length < 1) {
      this.router.go('/homePage');
    }
  }
  payToTurn = async () => {
    const { diamond, agentId } = this.router.getQuery();
    const { isAutoSave } = this.state;
    const res = await this.http.webHttp.get('/spreadApi/iAgentGiveForAgent', {
      agentId,
      diamond,
      isSaveCommon: isAutoSave,
    });
    if (res.isSuccess) {
      const { orderId } = res.data;
      this.router.go('/orderForAgentTurnDiaForAgent', {
        orderId,
      });
    } else {
      this.message.info(res.info || '赠送失败');
    }
  }
  toggleSave = () => {
    this.setState({
      isAutoSave: !this.state.isAutoSave,
    });
  }
  render() {
    const { isAutoSave } = this.state;
    const { inviteCode, masonry } = this.props;
    const { diamond, agentName, agentId } = this.router.getQuery();
    const countAfter = masonry - diamond;
    return (
      <div className={styles.container}>
        <Title>确认订单</Title>
        <NavBar
          title="确认订单"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div>
            <div className={styles.blockContainer}>
              <div className={styles.headerInfoWrap}>
                <div className={styles.masonryIconWrap}>
                  <IconImg className={styles.masonryIcon} src={imgSource.masonry} />
                </div>
                <div className={styles.masonryInfo}>
                  <div className={styles.masonryCountLabel}>转出{ diamond }钻石</div>
                </div>
              </div>
              <div className={styles.rowItemWrap}>
                <div className={styles.rowItem}>
                  <div className={styles.rowItemTitle}>我的账户信息</div>
                </div>
                <div className={styles.rowItem}>
                  <div>代理邀请码</div>
                  <div className={styles.payItem}>
                    { inviteCode }
                  </div>
                </div>
                <div className={styles.rowItem}>
                  <div>交易前钻石数</div>
                  <div className={styles.payItem}>
                    { masonry }
                  </div>
                </div>
                <div className={styles.rowItem}>
                  <div>交易后钻石数</div>
                  <div className={styles.payItem}>
                    { countAfter }
                  </div>
                </div>
              </div>
              <div className={styles.rowItemWrap}>
                <div className={styles.rowItem}>
                  <div className={styles.rowItemTitle}>转出对象</div>
                </div>
                <div className={styles.rowItem}>
                  <div>代理ID</div>
                  <div className={styles.payItem}>
                    { agentId }
                  </div>
                </div>
                {
                  agentName &&
                  <div className={styles.rowItem}>
                    <div>代理昵称</div>
                    <div className={styles.payItem}>
                      { agentName }
                    </div>
                  </div>
                }
              </div>
            </div>
            {
              this.hasPower('agentRange', 0) &&
              <div className={styles.autoSaveWrap}>
                <Checkbox checked={isAutoSave} onChange={this.toggleSave} />
                <span className={styles.saveTip}>转钻提交成功后自动添加为常用收款代理</span>
              </div>
            }
          </div>
          <div className={styles.btnWrap}>
            <Button onClick={this.payToTurn}>确认转钻</Button>
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
