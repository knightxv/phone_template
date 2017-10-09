import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';

// import { isWechat } from '@/helps/help';
import { Button, NavBar } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { WhiteSpace, Title, BaseFont, WingBlank } from '@/helps/styleComponent';
import styles from './PlayerPayManage.css';

class PlayerPayManage extends BaseComponent {
  constructor(props) {
    super(props);
    const winLoc = window.location;
    const origin = winLoc.origin;
    const pathname = winLoc.pathname;
    this.rechargeRouterName = '/pay';
    const { proxyid } = props;
    this.rechargeLink = `${origin}${pathname}#/pay?code=${proxyid}`;
    this.registerRouterName = '/register';
    this.registerLink = `${origin}${pathname}#/register?code=${proxyid}`;
  }
  onCopy = (text, result) => {
    if (result && !this.helps.isWechat) {
      this.helps.toast('复制成功');
    } else {
      this.helps.toast('复制失败，请手动复制');
    }
  };
  render() {
    const { proxyid, dispatch } = this.props;
    const { rechargeRouterName, rechargeLink, registerRouterName, registerLink } = this;
    const navigate = (routerName, query) => {
      dispatch(this.helps.routerRedux.push({
        pathname: routerName,
        query,
      }));
    };
    const params = { code: proxyid };
    return (
      <div className={styles.normal}>
        <Title>充值管理中心</Title>
        <NavBar
          title="充值管理中心"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <p className={styles.itemWrap}>充值链接</p>
        <WingBlank className="background">
          <div className={styles.linkInfoWrap}>
            <div
              onClick={() => navigate(rechargeRouterName, params)}
              className={styles.linkText}
              rel="noopener noreferrer"
            >
              {rechargeLink}
            </div>
            <CopyToClipboard
              text={rechargeLink}
              onCopy={this.onCopy}
            >
              <Button className={styles.linkBtn}>点击复制</Button>
            </CopyToClipboard>
          </div>
        </WingBlank>
        <BaseFont className={styles.tip}>
          代理可在浏览器复制此地址发送给玩家，玩家可以通过QQ浏览器或者UC浏览器访问该地址充值，在微信中打开将无法正常进行支付！
        </BaseFont>
        <p className={styles.itemWrap}>注册链接</p>
        <WingBlank className="background">
          <div className={styles.linkInfoWrap}>
            <div
              onClick={() => navigate(registerRouterName, params)}
              className={styles.linkText}
              rel="noopener noreferrer"
            >
              {registerLink}
            </div>
            <CopyToClipboard
              text={registerLink}
              onCopy={this.onCopy}
            >
              <Button className={styles.linkBtn}>点击复制</Button>
            </CopyToClipboard>
          </div>
        </WingBlank>
        <BaseFont className={styles.tip}>
          代理可在浏览器复制此地址发送给玩家，玩家可以通过QQ浏览器或者UC浏览器访问该地址充值，在微信中打开将无法正常进行支付！
        </BaseFont>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(PlayerPayManage);
