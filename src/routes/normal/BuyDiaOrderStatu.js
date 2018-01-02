import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { Button, Icon } from '@/helps/antdComponent/index.js';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title, WhiteSpace } from '@/helps/styleComponent';
import styles from './BuyDiaOrderStatu.less';

class BuyDiaOrderStatu extends BaseComponent {
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
  copyOrderId = () => {
    this.message.info('复制成功，当前浏览器不支持复制');
  }
  goToHomePage = () => {
    this.router.go('/homePage');
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
    const orderCountLabel = this.helps.transCountUnit(orderCount);
    const payTypeLabel = this.Enum.payTypeLabel[payType];
    return (
      <div className={styles.container}>
        <Title>购钻状态</Title>
        <NavBar
          title="购钻状态"
        />
        <WhiteSpace />
          <div className={styles.payStatuInfoWrap}>
            <Icon color="#108ee9" type="check-circle" />
            <span className={styles.payStatuLabel}>订单已提交成功！</span>
          </div>
          <div className={styles.infoItemContainer}>
            <div className={styles.infoItem}>
              <div className={styles.infoItemKey}>购钻账户:</div>
              <div className={styles.infoItemVal}>
                <span className={styles.count}>{ orderUserId }</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemKey}>购钻数量:</div>
              <div className={styles.infoItemVal}>
                <span className={styles.count}>
                  { orderCountLabel } 钻石
                </span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemKey}>购钻价格:</div>
              <div className={styles.infoItemVal}>
                <span className={styles.count}>￥{ orderPayMoneyLabel }</span>
              </div>
            </div>
            <div className={styles.line} />
            <div className={styles.infoItem}>
              <div className={styles.infoItemKey}>付款方式:</div>
              <div className={styles.infoItemVal}>
                { payTypeLabel }
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemKey}>购钻前钻石数:</div>
              <div className={styles.infoItemVal}>
                <span className={styles.count}>{ payCountBefore }个</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemKey}>购钻后钻石数:</div>
              <div className={styles.infoItemVal}>
                <span className={styles.count}>{ payCountAfter }个</span>
              </div>
            </div>
            <div className={styles.line} />
            <div className={styles.infoItem}>
              <div className={styles.infoItemKey}>订单号:</div>
              <div className={styles.infoItemVal}>
              { orderId }
              </div>
            </div>
          </div>
        <div className={styles.backBtnWrap}>
          <Button onClick={this.goToHomePage}>完成</Button>
        </div>
      </div>
    );
  }
}

export default connect()(BuyDiaOrderStatu);
