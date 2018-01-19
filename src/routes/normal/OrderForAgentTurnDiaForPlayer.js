import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { Button } from '@/helps/antdComponent/index.js';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title, WhiteSpace } from '@/helps/styleComponent';
import styles from './TurnDiaForPlayerOrderDetail.less';

/* 回调之后跳转回来的地址 */

class OrderForAgentTurnDiaForPlayer extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderPlayerId: '',
      orderPlayerName: '',
      userBalance: '',
      turnOutCount: '',
      payzDiaCountBefore: '',
      payzDiaCountAfter: '',
      payCountAfter: '',
      payType: '',
      orderId: '',
      orderAgentId: '',
      payMoney: '',
      sellType: '',
      payzMoneyBefore: '',
      payzMoneyAfter: '',
      createTime: '',
    };
  }
  async componentWillMount() {
    const { orderId, serverid } = this.router.getQuery();
    const res = await this.http.webHttp.get('/spreadApi/agentToplayerDiaOrderInfo', {
      orderId,
      serverid,
    });
    if (res.isSuccess) {
      this.setState({
        ...res.data,
      });
    }
  }
  copyOrderId = () => {
    this.message.info('复制成功，当前浏览器不支持复制');
  }
  render() {
    const {
      orderPlayerId,
      // orderPlayerName,
      // userBalance,
      turnOutCount,
      payzDiaCountBefore,
      payzDiaCountAfter,
      payType,
      orderId,
      orderAgentId,
      payMoney,
      createTime,
    } = this.state;
    const payDateTime = new Date(createTime).format('yyyy-MM-dd hh:mm:ss');
    const payMoneyLabel = this.helps.parseFloatMoney(payMoney);
    // const orderCountLabel = this.helps.transCountUnit(orderCount);
    // const payTypeLabel = this.Enum.payTypeLabel[payType];
    return (
      <div className={styles.container}>
        <Title>订单详情</Title>
        <NavBar
          title="订单详情"
        />
        <WhiteSpace />
        <div className={styles.payInfoWrap}>
          <div className={styles.orderInfoRowItem}>
            <div>
              <div className={styles.payInfoTitle}>订单号</div>
              <span className={styles.orderIdLabel}>{ orderId }</span>
            </div>
            <Button size="small" onClick={this.copyOrderId}>复制订单号</Button>
          </div>
          <div className={styles.orderInfoRowItem}>
            <div>
              <div className={styles.payInfoTitle}>转出账户</div>
              <span className={styles.orderIdLabel}>{ orderAgentId }</span>
            </div>
            <div>
              <div>转出前:<span className={styles.count}>{ payzDiaCountBefore }</span>个</div>
              <div>转出后:<span className={styles.count}>{ payzDiaCountAfter }</span>个</div>
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.payInfoTitle}>收款玩家</div>
            <div className={styles.orderIdLabel}>
            转钻给<span className={styles.count}>{ orderPlayerId }</span>个
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.payInfoTitle}>转钻数量</div>
            <div className={styles.orderIdLabel}>
              <span className={styles.count}>{ turnOutCount }</span>个
            </div>
          </div>
          {
            payType != this.Enum.payType.MANAGE &&
            <div className={styles.orderInfoItem}>
              <div className={styles.payInfoTitle}>交易金额</div>
              <div className={styles.orderIdLabel}>
                <span className={styles.count}>￥{ payMoneyLabel }</span>
              </div>
            </div>
          }

          <div className={styles.orderTimeItem}>
            <div className={styles.payInfoTitle}>订单提交时间</div>
            <div className={styles.orderIdLabel}>
              { payDateTime }
            </div>
          </div>
        </div>
        <div className={styles.backBtnWrap}>
          <Button onClick={() => this.router.go('/homePage')}>完成</Button>
        </div>
      </div>
    );
  }
}

export default connect()(OrderForAgentTurnDiaForPlayer);
