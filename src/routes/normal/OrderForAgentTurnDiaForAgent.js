import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';

import BaseComponent from '@/core/BaseComponent';
import { Button, NavBar } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import styles from './OrderDetail.less';

const imgSource = {
  masonry: require('../../assets/zuanshi.png'),
};

class OrderForAgentTurnDiaForAgent extends BaseComponent {
  constructor(props) {
    super(props);
    const {
      orderId,
    } = this.router.getQuery();
    this.state = {
      orderId,
      MyAgentId: '',
      MyPayzDiaCountAfter: 0,
      MyPayzDiaCountBefore: 0,
      agentId: '',
      agentPayzDiaCountAfter: 0,
      agentPayzDiaCountBefore: 0,
      createTime: 0,
      turnOutCount: 0,
    };
  }
  async componentWillMount() {
    const {
      orderId,
    } = this.router.getQuery();
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
      MyAgentId,
      MyPayzDiaCountAfter,
      MyPayzDiaCountBefore,
      agentId,
      agentPayzDiaCountAfter,
      agentPayzDiaCountBefore,
      createTime,
      turnOutCount,
    } = this.state;
    const payDateTime = new Date(createTime).format('yyyy-MM-dd hh:mm:ss');
    return (
      <div className={styles.container}>
        <Title>订单详情</Title>
        <NavBar
          title="订单详情"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div>
            <div className={styles.blockContainer}>
              <div className={styles.orderInfoRowItem}>
                <div className={styles.payInfoWrap}>
                  <div className={styles.payInfoTitle}>订单号</div>
                  <span className={styles.orderIdLabel}>{ orderId }</span>
                </div>
                <CopyToClipboard
                  text={orderId}
                  onCopy={this.copyOrderId}
                >
                  <div className={styles.copyBtn}>复制订单号</div>
                </CopyToClipboard>
              </div>
              <div className={styles.masonryInfoWrap}>
                <div className={styles.masonryIconWrap}>
                  <IconImg className={styles.masonryIcon} src={imgSource.masonry} />
                </div>
                <div className={styles.masonryInfo}>
                  <div className={styles.masonryCountLabel}>
                    转出{turnOutCount}钻石
                  </div>
                </div>
              </div>
              <div className={styles.orderRowItemWrap}>
                <div className={styles.orderRowItem}>
                  <div>
                    订单状态
                  </div>
                  <div className={styles.colorGreen}>
                    交易完成
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    交易完成时间
                  </div>
                  <div>
                    { payDateTime }
                  </div>
                </div>
              </div>
              <div className={styles.orderRowItemWrap} style={{ border: 'none' }}>
                <div className={styles.orderRowItem}>
                  <div className={styles.rowItemTitle}>我的账户信息</div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    代理邀请码
                  </div>
                  <div className={styles.colorOrange}>
                    { MyAgentId }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    交易前钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { MyPayzDiaCountBefore }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    交易后钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { MyPayzDiaCountAfter }
                  </div>
                </div>
              </div>
              <div className={styles.orderRowItemWrap} style={{ border: 'none' }}>
                <div className={styles.orderRowItem}>
                  <div className={styles.rowItemTitle}>转出对象</div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    代理ID
                  </div>
                  <div className={styles.colorOrange}>
                    { agentId }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    交易前钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { agentPayzDiaCountBefore }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    交易后钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { agentPayzDiaCountAfter }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.btnWrap}>
            <Button onClick={() => this.router.go('/turnDiaForAgent')}>完成</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(OrderForAgentTurnDiaForAgent);
