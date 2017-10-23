import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { ActionSheet } from 'antd-mobile';

// import { isWechat } from '@/helps/help';
import { NavBar, Icon } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
import { Title, Avatar, FlexRow } from '@/helps/styleComponent';
import styles from './InviteToAgent.css';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class InviteToAgent extends BaseComponent {
  constructor(props) {
    super(props);
    const winLoc = window.location;
    const origin = winLoc.origin;
    const pathname = winLoc.pathname;
    const { proxyid } = props;
    // this.rechargeRouterName = '/pay';
    // this.rechargeLink = `${origin}${pathname}#/pay?code=${proxyid}`;
    this.registerRouterName = '/register';
    this.registerLink = `${origin}${pathname}#/register?code=${proxyid}`;
    this.copySuccess = false;
  }
  onCopy = (text, result) => {
    if (result && !this.helps.isWechat) {
      this.copySuccess = true;
    }
  }
  showLinkOptionPicker =() => {
    const self = this;
    const BUTTONS = ['进入邀请链接', '复制邀请链接', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      destructiveButtonIndex: BUTTONS.length - 1,
      // title: 'title',
      message: '',
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps,
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        const { proxyid } = self.props;
        const params = { code: proxyid };
        self.navigate(this.registerRouterName, params);
      } else if (buttonIndex === 1) {
        if (self.copySuccess) {
          this.helps.toast('复制成功');
        } else {
          this.helps.toast('复制失败，请自行选择复制');
        }
      }
      // this.setState({ clicked: BUTTONS[buttonIndex] });
    });
  }
  navigate = (routerName, query) => {
    this.props.dispatch(this.helps.routerRedux.push({
      pathname: routerName,
      query,
    }));
  };
  render() {
    const { inviteCode } = this.props;
    const { rechargeRouterName, rechargeLink, registerLink } = this;
    
    return (
      <div className={styles.container}>
        <Title>邀请成为代理</Title>
        <NavBar
          title="邀请成为代理"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<CopyToClipboard
            text={registerLink}
            onCopy={this.onCopy}
          >
            <Icon type='ellipsis' onClick={this.showLinkOptionPicker} />
          </CopyToClipboard>}
        />
        <div className={styles.contentContainer}>
          <div className={styles.qrContainer}>
            <FlexRow className={styles.userInfo}>
              <Avatar />
              <span className={styles.inviteCodeLabel}>邀请码:{inviteCode}</span>
            </FlexRow>
            <QRCode size={280} value={registerLink} />
            <div className={styles.qrCodeTip}>扫一扫上面的二维码,加入代理</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(InviteToAgent);

/*
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
*/
