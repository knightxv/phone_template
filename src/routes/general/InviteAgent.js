import React from 'react';
import { connect } from 'dva';
import { window } from 'global';
import CopyToClipboard from 'react-copy-to-clipboard';

import styles from './InviteAgent.css';
import { WhiteSpace, WingBlank, Title } from '../../helps/styleComponent';
import { Button, NavBar } from '../../helps/antdComponent';
import BaseComponent from '../../helps/BaseComponent';

class InviteAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
    const winLoc = window.location;
    const { proxyid } = props;
    this.registerLink = `http://${winLoc.hostname}:3001#/register?code=${proxyid}`; // test
    // this.registerLink = `${winLoc.origin}/wechat/index.html#/register?code=${proxyid}`; // public
  }
  // navigateToInvite = () => {
  // }
  onCopy = (val, result) => {
    if (!result || this.helps.isWeixinBrowser()) {
      this.helps.toast('复制失败，请手动复制链接');
    } else {
      this.helps.toast('复制成功');
    }
  }
  render() {
    const registerLink = this.registerLink;
    return (
      <div>
        <Title>邀请代理</Title>
        <NavBar
          title="邀请代理"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <WhiteSpace />
        <WingBlank className="background">
          <p>链接</p>
          <div className={styles.linkInfoWrap}>
            <a
              href={registerLink}
              className={styles.linkText}
            >
              {registerLink}
            </a>
            <CopyToClipboard
              text={registerLink}
              onCopy={this.onCopy}
            >
              <Button className={styles.linkBtn}>复制</Button>
            </CopyToClipboard>
          </div>
        </WingBlank>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.general,
  };
}

export default connect(mapStateToProps)(InviteAgent);
