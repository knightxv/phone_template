import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';

import BaseComponent from '@/helps/BaseComponent';
import { Button } from '@/helps/antdComponent/index.js';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title, WhiteSpace } from '@/helps/styleComponent';
import styles from './BuyDiaOrderDetail.less';

class BuyDiaOrderDetail extends BaseComponent {
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
      orderUserId,
      payType,
    } = this.state;
    const payDateTime = new Date(createTime).format('yyyy-MM-dd hh:mm:ss');
    const orderPayMoneyLabel = this.helps.parseFloatMoney(orderPayMoney);
    const orderCountLabel = orderCount;
    const payTypeLabel = this.Enum.payTypeLabel[payType];
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
              <Button className={styles.copyBtn}>复制订单号</Button>
            </CopyToClipboard>
          </div>
          <div className={styles.orderInfoRowItem}>
            <div>
              <div className={styles.payInfoTitle}>购钻账户</div>
              <span className={styles.orderIdLabel}>{ orderUserId }</span>
            </div>
            <div>
              <div>购买前:<span className={styles.count}>{ payCountBefore }</span>个</div>
              <div>购买后:<span className={styles.count}>{ payCountAfter }</span>个</div>
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.payInfoTitle}>购钻数量</div>
            <div className={styles.orderIdLabel}>
              <span className={styles.count}>{ orderCountLabel }</span>个
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.payInfoTitle}>购钻价格</div>
            <div className={styles.orderIdLabel}>
              <span className={styles.count}>￥{ orderPayMoneyLabel }</span>
            </div>
          </div>
          <div className={styles.orderInfoItem}>
            <div className={styles.payInfoTitle}>支付方式</div>
            <div className={styles.orderIdLabel}>
              { payTypeLabel }支付
            </div>
          </div>
          <div className={styles.orderTimeItem}>
            <div className={styles.payInfoTitle}>付款时间</div>
            <div className={styles.orderIdLabel}>
              { payDateTime }
            </div>
          </div>
        </div>
        <div className={styles.backBtnWrap}>
          <Button onClick={this.router.back}>返回</Button>
        </div>
      </div>
    );
  }
}

export default connect()(BuyDiaOrderDetail);

/*
<div className={styles.container}>
        <Title>购买钻石</Title>
        <NavBar
          title="购买钻石"
          onClick={this.router.back}
          right={<div onClick={this.goToDetail}>明细</div>}
        />
        <WhiteSpace />
        <div className={styles.payWrap}>
          <div className={styles.goodsContainer}>
            {
              goods.map(({ goodsMoney, masonryCount, shopId }, i) => (
                <div
                  className={styles.goodsWrap}
                  key={i}
                  style={{ marginRight: (i !== 0 && ((i - 2) % 3) === 0) ? 0 : '5%' }}
                  onClick={() => this.buyGood(shopId)}
                >
                  <p className={styles.goodInfo}>{this.helps.transMoenyUnit(masonryCount)}钻石</p>
                  <p className={styles.goodInfo}>售价:{this.helps.parseFloatMoney(goodsMoney)}元</p>
                </div>
              ))
            }
          </div>
          <div className={styles.payTip}>-推荐新代理,88开运!-</div>
          <div className={styles.btnWrap}>
            <Button onClick={this.buyGoods} className={styles.payBtn}>立即购买</Button>
          </div>
        </div>
        <StickyContainer className={styles.stickyContainer} >
          <Sticky>
            {
              ({
              style,
                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight
              }) => {
                return (
                  <div className={styles.listWrap} style={style}>
                    <ListView
                      data={record}
                      renderHeader={this.renderHeader}
                      renderRow={this.renderRow}
                      scrollEnabled={false}
                    />
                  </div>
                );
              }
            }
          </Sticky>
        </StickyContainer>
      </div>


*/
