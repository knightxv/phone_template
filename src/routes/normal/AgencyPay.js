import React from 'react';
import { connect } from 'dva';
import ScrollTop from '@/components/ScrollTop';

import BaseComponent from '@/core/BaseComponent';
import classnames from 'classnames';
import { StickyContainer, Sticky } from 'react-sticky';
import LongPress from '@/components/LongPress';
import { Button, Icon, NavBar } from '@/components/lazyComponent/antd';
import { ScrollListView } from '@/components/lazyComponent/ScrollListView';
import { Title, WhiteSpace } from '@/components/styleComponent';
import styles from './AgencyPay.less';

// const goodsIds = [1, 2, 3, 4, 5, 6];
// const goodsSourceArr = goodsIds.map(index => require(`../resource/shop/${index}.png`));

class AgencyPay extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      goods: [],
      selectShopId: -1, // 选择的商品id
      record: [],
    };
  }
  async componentWillMount() {
    const res = await this.http.webHttp.get('/spreadApi/getMasonryGoods');
    if (res.isSuccess) {
      const selectShopId = res.data.length > 0 ? res.data[0].shopId : -1;
      this.setState({
        goods: res.data,
        selectShopId,
      });
    }
    this.getRecord();
  }
  getRecord = async () => {
    const res = await this.http.webHttp.get('/spreadApi/agentBuyDiaOrderList');
    if (res.isSuccess) {
      this.setState({
        record: res.data,
      });
    }
  }
  // 跳转购钻详情页面
  goToDetail = (orderId) => {
    this.router.go('/buyDiaOrderDetail', { orderId });
  }
  // 选择商品
  selectGoods = (selectShopId) => {
    this.setState({
      selectShopId,
    });
  }
  deleteOrder = async (orderId) => {
    const isComfirm = confirm('确认删除订单');
    if (isComfirm) {
      const res = await this.http.webHttp.get('/spreadApi/deleteBuyDiaOrder', {
        orderId,
      });
      if (!res.isSuccess) {
        this.message.info(res.info || '删除订单失败');
        return;
      }
      this.getRecord();
      this.message.info(res.info || '删除订单成功');
    }
  }
  renderRow = (row) => {
    const chargeTime = new Date(row.chargeTime).format('yyyy-MM-dd HH:mm');
    const chargeMoney = this.helps.parseFloatMoney(row.payMoney);
    return (<LongPress
      className={styles.rowItem}
      onShortPress={() => this.goToDetail(row.orderId)}
      onLongPress={() => this.deleteOrder(row.orderId)}
    >
      <div>
        <div>{ chargeMoney }元购买了{ row.chargeCount }个钻石</div>
        <div className={styles.chargeTime}>{ chargeTime }</div>
      </div>
      <div className={styles.recordItemRightWrap}>
        <div className={styles.chargeCount}>+{ row.chargeCount }个</div>
        <Icon type="right" color="#b8b8b8" />
      </div>
    </LongPress>);
  }
  goToBuyGoods = () => {
    const { selectShopId, goods } = this.state;
    const goodsInfo = goods.filter((shop) => {
      return shop.shopId === selectShopId;
    })[0];
    if (goodsInfo) {
      const {
        goodsMoney,
        masonryCount,
        shopId,
      } = goodsInfo;
      this.router.go('/buyMasonry', {
        goodsMoney,
        masonryCount,
        shopId,
      });
    }
  }
  goToOrderDetail = () => {
    this.router.go('/buyDiaOrderDetail');
  }
  scrollTop = () => {
    const scrollNode = this.scroll;
    if (scrollNode) {
      scrollNode.scrollTo && scrollNode.scrollTo(0, 0);
    }
  }
  render() {
    const { goods, record, selectShopId } = this.state;
    const shopSelectArr = goods.filter((good) => {
      return good.shopId === selectShopId;
    });
    const shopTip = shopSelectArr[0] && shopSelectArr[0].tip;
    const monthRecord = []; // 本月购钻记录
    record.some((data) => {
      if (data.chargeTime >= this.helps.getMonthTimeStamp()) {
        monthRecord.push(data);
        return false;
      }
      return true;
    });
    const monthCount = monthRecord.reduce((bef, cur) => {
      return bef + cur.chargeCount;
    }, 0); // 本月购钻数
    const allCount = record.reduce((bef, cur) => {
      return bef + cur.chargeCount;
    }, 0); // 总购钻数
    return (
      <div className={styles.container}>
        <Title>购买钻石</Title>
        <NavBar
          title="购买钻石"
          onClick={this.router.back}
        />
        <WhiteSpace />
        <div className={styles.payWrap}>
          <div className={styles.goodsContainer}>
            {
              goods.map(({ goodsMoney, masonryCount, shopId, statu, tip }, i) => {
                const goodsWrapClass = classnames({
                  [styles.goodsWrap]: true,
                  [styles.goodsCheap]: +statu === 1,
                  [styles.goodsSelect]: selectShopId === shopId,
                });
                return (
                  <div
                    className={goodsWrapClass}
                    key={i}
                    style={{ marginRight: (i !== 0 && ((i - 2) % 3) === 0) ? 0 : '5%' }}
                    onClick={() => this.selectGoods(shopId)}
                  >
                    <p className={styles.goodLabel}>{masonryCount}钻石</p>
                    <p className={styles.goodPrice}>售价:{this.helps.parseIntMoney(goodsMoney)}元</p>
                  </div>
                );
              })
            }
          </div>
          {
            <div className={styles.payTip}>{ shopTip && `${shopTip}` }</div>
          }
          <div className={styles.btnWrap}>
            <Button onClick={this.goToBuyGoods} className={styles.payBtn}>立即购买</Button>
          </div>
        </div>
        <StickyContainer>
          <Sticky>
            {
              ({
              style,
                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight,
              }) => {
                // console.log(wasSticky)
                return (
                  <div className={styles.listWrap} style={style}>
                    <div style={{ height: '1rem' }} />
                    <div className={styles.recordHeader}>
                      <div>
                        本月购钻数量:<span className={styles.countLabel}>{ monthCount }</span>个
                      </div>
                      <div>
                        总购钻数量:<span className={styles.countLabel}>{ allCount }</span>个
                      </div>
                    </div>
                    <ScrollListView
                      data={record}
                      renderRow={this.renderRow}
                      ref={(node) => { this.scrollView = node; }}
                      ListEmptyComponent={<div className={styles.noDataTip}>没有数据哦</div>}
                      getNode={(node) => { this.scroll = node; }}
                    />
                    {
                      wasSticky && <ScrollTop onClick={this.scrollTop} />
                    }
                  </div>
                );
              }
            }
          </Sticky>
        </StickyContainer>
      </div>
    );
  }
}

export default connect()(AgencyPay);

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
