import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';

import BaseComponent from '@/helps/BaseComponent';
import { Button } from '@/helps/antdComponent/index.js';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title, WhiteSpace } from '@/helps/styleComponent';
import styles from './TurnDiaForAgentOrderDetail.less';

class OrderForAgentTurnDiaForAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      payzDiaCountBefore: '',
      payzDiaCountAfter: '',
      userBalance: '',
      turnOutCount: '',
      orderinfo: '',
      createTime: '',
    };
  }
  async componentWillMount() {
    const { orderId } = this.router.getQuery();
    const res = await this.http.webHttp.get('/spreadApi/sellAgentDiaOrderInfo', {
      orderId,
    });
    if (res.isSuccess) {
      this.setState({
        ...res.data,
      });
    }
  }
  copyOrderId = (text, result) => {
    if (result && !this.helps.isWechat) {
      this.message.info('订单号复制成功');
    } else {
      this.message.info('订单号复制失败，当前浏览器不支持复制');
    }
  }
  render() {
    const {
      orderId,
      payzDiaCountBefore,
      payzDiaCountAfter,
      userBalance,
      orderinfo,
      createTime,
    } = this.state;
    const payDateTime = new Date(createTime).format('yyyy-MM-dd hh:mm:ss');
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
            <CopyToClipboard
              text={orderId}
              onCopy={this.copyOrderId}
            >
              <Button size="small">复制订单号</Button>
            </CopyToClipboard>
          </div>
          <div className={styles.orderInfoRowItem}>
            <div>
              <div className={styles.payInfoTitle}>转钻账户</div>
              <span className={styles.orderIdLabel}>{ userBalance }</span>
            </div>
            <div>
              <div>购买前:<span className={styles.count}>{ payzDiaCountBefore }</span>个</div>
              <div>购买前:<span className={styles.count}>{ payzDiaCountAfter }</span>个</div>
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.payInfoTitle}>订单信息</div>
            <div className={styles.orderIdLabel}>
              { orderinfo }
            </div>
          </div>

          <div className={styles.orderTimeItem}>
            <div className={styles.payInfoTitle}>订单提交时间</div>
            <div className={styles.orderIdLabel}>
              { payDateTime }
            </div>
          </div>
        </div>
        <div className={styles.backBtnWrap}>
          <Button onClick={() => this.router.go('/homePage')}>返回</Button>
        </div>
      </div>
    );
  }
}

export default connect()(OrderForAgentTurnDiaForAgent);
