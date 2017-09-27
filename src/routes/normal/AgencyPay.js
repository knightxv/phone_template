import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Title, Toast } from '../utils/help';
import styles from './AgencyPay.css';
import { BackgroundContainer, NetImg, Button, BaseFont } from '../utils/styleComponent';
import http from '../utils/http';

// const goodsIds = [1, 2, 3, 4, 5, 6];
// const goodsSourceArr = goodsIds.map(index => require(`../resource/shop/${index}.png`));

class AgencyPay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goods: [],
    };
  }
  async componentWillMount() {
    const res = await http.get('/spreadApi/getMasonryGoods');
    if (res.isSuccess) {
      this.setState({
        goods: res.data,
      });
    }
  }
  // 跳转到支付页面
  navigateToPay = async (shopId) => {
    // window.open(chargeURL, '_self');
    this.props.dispatch(routerRedux.push({
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
    const res = await http.get('/spreadApi/balanceRecharge', params);
    if (res.isSuccess) {
      Toast.info(res.message || '充值成功');
      return false;
    }
    Toast.info(res.message || '充值失败，请重试');
  }
  render() {
    const { goods } = this.state;
    return (
      <BackgroundContainer>
        <Title>充值</Title>
        <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div>
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
      </BackgroundContainer>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(AgencyPay);
