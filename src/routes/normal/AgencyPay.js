import React from 'react';
import { connect } from 'dva';

import { Button, NavBar } from '@/helps/antdComponent';
import { NetImg, BaseFont, Title } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './AgencyPay.css';

// const goodsIds = [1, 2, 3, 4, 5, 6];
// const goodsSourceArr = goodsIds.map(index => require(`../resource/shop/${index}.png`));

class AgencyPay extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      goods: [],
    };
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/getMasonryGoods');
    if (res.isSuccess) {
      this.setState({
        goods: res.data,
      });
    }
  }
  // 跳转到支付页面
  navigateToPay = async (shopId) => {
    // window.open(chargeURL, '_self');
    this.props.dispatch(this.helps.routerRedux.push({
      pathname: '/AgencyPayType',
      query: {
        shopId,
      },
    }));
  }
  // 余额充值
  readyToExcharge = async (shopId) => {
    if (!window.confirm('确认购买？')) {
      return false;
    }
    const params = {
      goodsId: shopId,
    };
    const res = await this.helps.webHttp.get('/spreadApi/balanceRecharge', params);
    if (res.isSuccess) {
      this.helps.toast(res.info || '充值成功');
      return false;
    }
    this.helps.toast(res.info || '充值失败，请重试');
  }
  render() {
    const { goods } = this.state;
    return (
      <div>
        <Title>充值</Title>
        <NavBar
          title="充值"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <div className={styles.goodsContainer}>
          {
            goods.map(({ shopId, goodsInfo, goodsIco }, i) => (
              <div className={styles.goodsWrap} key={i}>
                <NetImg src={goodsIco} className={styles.goodsImg} />
                <BaseFont>{goodsInfo}</BaseFont>
                <div className={styles.btnWrap}>
                  <Button className={styles.payBtn} onClick={() => this.navigateToPay(shopId)}>购买</Button>
                  <Button className={styles.payBtn} onClick={() => this.readyToExcharge(shopId)}>余额购买</Button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(AgencyPay);
