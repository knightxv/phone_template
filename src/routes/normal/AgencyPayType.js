import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { NavBar } from '@/helps/antdComponent';
import { BaseFont, Title } from '@/helps/styleComponent';
import styles from './AgencyPayType.css';

class AgencyPayType extends BaseComponent {
  constructor(props) {
    super(props);
    const { shopId } = this.helps.querystring.parse(this.props.location.search.substr(1));
    this.shopId = shopId;
  }
  pay = async (type, shopId) => {
    const chargeType = this.helps.payType(type);
    const res = await this.helps.webHttp.get('/spreadApi/recharge', { goodsId: shopId, chargeType });
    if (!res.isSuccess) {
      this.helps.toast(res.info || '购买失败');
      return false;
    }
    const chargeURL = res.data.chargeURL;
    window.location.href = chargeURL;
  }
  render() {
    const { shopId } = this;
    return (
      <div className="alignCenterContainer">
        <Title>充值</Title>
        <NavBar
          title="充值"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <BaseFont
          className={styles.funItem}
          onClick={() => this.pay(this.TypeDefine.payType.WECHAT, shopId)}
        >
          微信支付
        </BaseFont>
        {
          !this.helps.isWeixinBrowser() ? (
            <BaseFont
              className={styles.funItem}
              onClick={() => this.pay(this.TypeDefine.payType.ALI, shopId)}
            >
              支付宝支付
            </BaseFont>
          ) : null
        }
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(AgencyPayType);
