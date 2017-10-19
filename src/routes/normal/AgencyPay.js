import React from 'react';
import { connect } from 'dva';

import { Button, NavBar, SelectPicker, List } from '@/helps/antdComponent';
import { NetImg, BaseFont, Title, WhiteSpace } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './AgencyPay.css';

// const goodsIds = [1, 2, 3, 4, 5, 6];
// const goodsSourceArr = goodsIds.map(index => require(`../resource/shop/${index}.png`));

const marsonryPayType = [
  { value: '微信支付', label: '微信支付' },
  { value: '支付宝支付', label: '支付宝支付' },
  { value: '余额支付', label: '余额支付' },
];

class AgencyPay extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      goods: [1, 2, 3, 4],
      selectPayTypeVal: ['微信支付'],
    };
  }
  async componentWillMount() {
    // const res = await this.helps.webHttp.get('/spreadApi/getMasonryGoods');
    // if (res.isSuccess) {
    //   this.setState({
    //     goods: res.data,
    //   });
    // }
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
  selectPayType = (val) => {
    this.setState({
      selectPayTypeVal: val,
    });
  }
  render() {
    const { selectPayTypeVal, goods } = this.state;
    return (
      <div>
        <Title>钻石充值</Title>
        <NavBar
          title="钻石充值"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <WhiteSpace />
        <div className="background">
          <SelectPicker value={selectPayTypeVal} data={marsonryPayType} cols={1} onChange={this.selectPayType}>
            <List.Item arrow="horizontal">支付方式</List.Item>
          </SelectPicker>
          <div className={styles.payTitle}>充钻石</div>
          <div className={styles.goodsContainer}>
            {
              goods.map(({ shopId, goodsInfo, goodsIco }, i) => (
                <div className={styles.goodsWrap} style={{ marginRight: (i !== 0 && (i % 2) === 0) ? 0 : '5%' }} key={i}>
                  <p className={styles.goodInfo}>5000钻石</p>
                  <p className={styles.goodInfo}>售价：300.00元</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(AgencyPay);
