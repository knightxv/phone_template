import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';

import BaseComponent from '@/core/BaseComponent';
import PayIcon from '@/components/PayIcon';
import { Button, NavBar } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import styles from './OrderDetail.less';

const imgSource = {
  masonry: require('../../assets/zuanshi.png'),
};

class TurnDiaForPlayerOrderDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      orderAgentId: '',
      orderPlayerId: '',
      orderPlayerName: '',
      systemGift: '',
      payzDiaCountBefore: '',
      payzDiaCountAfter: '',
      payType: '',
      payMoney: '',
      createTime: '',
      turnOutCount: '',
      orderStatu: '购买成功', // 订单购买状态
    };
  }
  async componentWillMount() {
    const {
      orderId,
      serverid,
    } = this.router.getQuery();
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
      orderAgentId,
      orderPlayerId,
      orderPlayerName,
      systemGift,
      payzDiaCountBefore,
      payzDiaCountAfter,
      payType,
      payMoney,
      createTime,
      turnOutCount,
      orderStatu,
    } = this.state;
    const payDateTime = new Date(createTime).format('yyyy-MM-dd hh:mm:ss');
    const orderPayMoneyLabel = this.helps.parseFloatMoney(payMoney);
    const payTypeLabel = this.Enum.payTypeLabel[payType];
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
                { (payType == this.Enum.payType.returnDirection || payType == this.Enum.payType.MANAGE)
                  ? <div className={styles.masonryInfo}>
                    <div className={styles.masonryCountLabel}>
                      转出{turnOutCount}钻石
                    </div>
                  </div>
                : <div className={styles.masonryInfo}>
                  <div className={styles.masonryCountLabel}>
                    {turnOutCount}钻石{systemGift && `+系统额外赠送${systemGift}钻石` }
                  </div>
                  <div className={styles.masonryMoenyLabel}>￥{ orderPayMoneyLabel }</div>
                </div>
                }
              </div>
              <div className={styles.orderRowItemWrap}>
                <div className={styles.orderRowItem}>
                  <div>
                    订单状态
                  </div>
                  <div className={styles.colorGreen}>
                    { orderStatu }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    付款方式
                  </div>
                  <div className={styles.payTypeItemWrap}>
                    <PayIcon payType={payType} />{ payTypeLabel }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    购钻时间
                  </div>
                  <div>
                    { payDateTime }
                  </div>
                </div>
              </div>
              <div className={styles.orderRowItemWrap} style={{ border: 'none' }}>
                <div className={styles.orderRowItem}>
                  <div className={styles.rowItemTitle}>卖家信息</div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    代理邀请码
                  </div>
                  <div className={styles.colorOrange}>
                    { orderAgentId }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    交易前钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { payzDiaCountBefore }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    交易后钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { payzDiaCountAfter }
                  </div>
                </div>
              </div>
              <div className={styles.orderRowItemWrap} style={{ border: 'none' }}>
                <div className={styles.orderRowItem}>
                  <div className={styles.rowItemTitle}>买家信息</div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    玩家ID
                  </div>
                  <div className={styles.colorOrange}>
                    { orderPlayerId }
                  </div>
                </div>
                {
                  orderPlayerName &&
                  <div className={styles.orderRowItem}>
                    <div>
                      玩家昵称
                    </div>
                    <div className={styles.colorOrange}>
                      { orderPlayerName }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className={styles.btnWrap}>
            <Button type="red" onClick={this.router.back}>关闭</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(TurnDiaForPlayerOrderDetail);
