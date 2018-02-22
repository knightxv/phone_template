import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';
import classnames from 'classnames';

import BaseComponent from '@/core/BaseComponent';
import { Button, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './OrderDetail.less';


class CashOrderDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderid: '',
      createTime: 0,
      resultTime: 0,
      result: -1,
      cardNumber: 0,
      cardname: '',
      cashCount: 0,
    };
  }
  async componentWillMount() {
    const query = this.router.getQuery();
    this.setState({
      ...query,
    });
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
      orderid,
      createTime,
      resultTime,
      result,
      cardNumber,
      cardname,
      cashCount,
    } = this.state;
    const createTimeLabel = new Date(+createTime).format('yyyy-MM-dd hh:mm:ss');
    const resultTimeLabel = new Date(+resultTime).format('yyyy-MM-dd hh:mm:ss');
    const resultLabel = this.Enum.resolveStatusLabel[result];
    const cashCountLabel = this.helps.parseFloatMoney(cashCount);
    return (
      <div className={styles.container}>
        <Title>订单详情</Title>
        <NavBar
          title="订单详情"
        />
        <div className={styles.contentContainer}>
          <div>
            <div className={styles.blockContainer}>
              <div className={styles.orderInfoRowItem}>
                <div className={styles.payInfoTitle}>订单号</div>
                <span className={styles.orderIdLabel}>{ orderid }</span>
                <CopyToClipboard
                  text={orderid}
                  onCopy={this.copyOrderId}
                >
                  <div className={styles.copyBtn}>复制订单号</div>
                </CopyToClipboard>
              </div>
              <div className={styles.masonryInfoWrap}>
                <div className={styles.masonryCountLabel}>
                  提现<span className={styles.masonryMoenyLabel}>{cashCountLabel}</span>元到银行卡
                </div>
              </div>
              <div className={styles.orderRowItemWrap}>
                <div className={styles.orderRowItem}>
                  <div>
                    银行卡号
                  </div>
                  <div>
                    { cardNumber }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    开户姓名
                  </div>
                  <div>
                    { cardname }
                  </div>
                </div>
              </div>
              <div className={styles.orderRowItemWrap} style={{ border: 'none' }}>
                <div className={styles.orderRowItem}>
                  <div>
                    申请时间
                  </div>
                  <div>
                    { createTimeLabel }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    受理时间
                  </div>
                  <div>
                    { resultTimeLabel }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    受理结果
                  </div>
                  <div
                    className={classnames({
                      [styles.colorGreen]: result == this.Enum.resolveStatus.pass,
                      [styles.colorFail]: result == this.Enum.resolveStatus.fail,
                      [styles.colorWait]: result == this.Enum.resolveStatus.waiting,
                    })}
                  >
                    { resultLabel }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.btnWrap}>
            <Button onClick={this.router.back}>返回</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(CashOrderDetail);
