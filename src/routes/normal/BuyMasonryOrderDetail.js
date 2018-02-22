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

class BuyMasonryOrderDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      createTime: 0,
      orderCount: 0,
      orderId: '',
      orderPayMoney: '',
      orderUserId: '',
      payCountBefore: 0,
      payCountAfter: 0,
      payType: 0,
    };
  }
  async componentWillMount() {
    const { orderId } = this.router.getQuery();
    const res = await this.http.webHttp.get('/spreadApi/buyDiaOrderInfo', {
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
      createTime,
      orderCount,
      orderId,
      orderPayMoney,
      payCountBefore,
      payCountAfter,
      payType,
      orderUserId,
    } = this.state;
    const payDateTime = new Date(createTime).format('yyyy-MM-dd hh:mm:ss');
    const orderPayMoneyLabel = this.helps.parseFloatMoney(orderPayMoney);
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
                <div className={styles.masonryInfo}>
                  <div className={styles.masonryCountLabel}>{ orderCount }钻石</div>
                  <div className={styles.masonryMoenyLabel}>￥{ orderPayMoneyLabel }</div>
                </div>
              </div>
              <div className={styles.orderRowItemWrap}>
                <div className={styles.orderRowItem}>
                  <div>
                    订单状态
                  </div>
                  <div className={styles.colorGreen}>
                    购买成功
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
                  <div>
                    购钻代理ID
                  </div>
                  <div className={styles.colorOrange}>
                    { orderUserId }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    购钻前账户钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { payCountBefore }
                  </div>
                </div>
                <div className={styles.orderRowItem}>
                  <div>
                    购钻后账户钻石数
                  </div>
                  <div className={styles.colorOrange}>
                    { payCountAfter }
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

export default connect()(BuyMasonryOrderDetail);
