import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import http from '../utils/http';
import { BaseFont, BackgroundContainer } from '../utils/styleComponent';
import styles from './AgencyPayType.css';
import { Toast, payType, payEnum, isWechat, openWindow } from '../utils/help';

// 支付
const pay = async (type, shopId) => {
  const chargeType = payType(type);
  console.log(chargeType);
  const res = await http.get('/spreadApi/recharge', { goodsId: shopId, chargeType });
  if (!res.isSuccess) {
    Toast.info(res.message || '购买失败');
    return false;
  }
  const chargeURL = res.data.chargeURL;
  window.location.href = chargeURL;
  
  // openWindow(chargeURL);
  // link.href = chargeURL;
  // link.target = '_blank';
  // // console.log(this.link);
  // link.click();
};

function AgencyPayType({ location, dispatch }) {
  const { shopId } = location.query;
  return (
    <BackgroundContainer className={styles.normal}>
      <div className="return_btn" onClick={() => dispatch(routerRedux.goBack())}>&lt;返回</div>
      <BaseFont
        className={styles.funItem}
        onClick={() => pay(payEnum.WECHAT, shopId)}
      >
        微信支付
      </BaseFont>
      {
        !isWechat ? (
          <BaseFont
            className={styles.funItem}
            onClick={() => pay(payEnum.ALI, shopId)}
          >
            支付宝支付
          </BaseFont>
        ) : null
      }
    </BackgroundContainer>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(AgencyPayType);
