import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { WhiteSpace } from 'antd-mobile';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Title, Toast, isWechat } from '../utils/help';
import { Button, BaseFont } from '../utils/styleComponent';
import styles from './PlayerPayManage.css';


// 用户点击复制
const onCopy = (text, result) => {
  if (result && !isWechat) {
    Toast.info('复制成功');
  } else {
    Toast.info('复制失败，请手动复制');
  }
};

function PlayerPayManage({ proxyid, dispatch }) {
  const navigate = (routerName, query) => {
    dispatch(routerRedux.push({
      pathname: routerName,
      query,
    }));
  };
  const winLoc = window.location;
  const origin = winLoc.origin;
  const pathname = winLoc.pathname;
  const rechargeRouterName = '/pay';
  const rechargeLink = `${origin}${pathname}#/pay?code=${proxyid}`;
  const registerRouterName = '/register';
  const registerLink = `${origin}${pathname}#/register?code=${proxyid}`;
  const params = { code: proxyid };
  return (
    <div className={styles.normal}>
      <Title>充值管理中心</Title>
      <div className="return_btn" onClick={() => dispatch(routerRedux.goBack())}>&lt;返回</div>
      <BaseFont className={styles.itemWrap}>充值链接</BaseFont>
      <BaseFont className={styles.link}>{rechargeLink}</BaseFont>
      <div className={styles.buttonItemWrap}>
        <Button
          className={styles.linkBtn}
          onClick={() => navigate(rechargeRouterName, params)}
        >
        访问该地址
        </Button>
        <CopyToClipboard
          text={rechargeLink}
          onCopy={onCopy}
        >
          <Button
            className={styles.linkBtn}
          >
          点击复制
          </Button>
        </CopyToClipboard>
      </div>
      <BaseFont className={styles.tip}>
        代理可在浏览器复制此地址发送给玩家，玩家可以通过QQ浏览器或者UC浏览器访问该地址充值，在微信中打开将无法正常进行支付！
      </BaseFont>
      <WhiteSpace size="xl" />
      <BaseFont className={styles.itemWrap}>代理申请链接</BaseFont>
      <BaseFont className={styles.link}>{registerLink}</BaseFont>
      <div className={styles.buttonItemWrap}>
        <Button
          className={styles.linkBtn}
          onClick={() => navigate(registerRouterName, params)}
        >
        访问该地址
        </Button>
        <CopyToClipboard
          text={registerLink}
          onCopy={onCopy}
        >
          <Button
            className={styles.linkBtn}
          >
          点击复制
          </Button>
        </CopyToClipboard>
      </div>
      <BaseFont className={styles.tip}>
        代理可在浏览器复制此地址发送给下级代理，代理可以通过QQ浏览器或者UC浏览器访问该地址申请代理，在微信中打开将无法正常进行申请！
      </BaseFont>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.app,
  };
}

export default connect(mapStateToProps)(PlayerPayManage);
