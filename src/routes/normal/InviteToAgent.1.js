import React from 'react';
import { connect } from 'dva';
// import CopyToClipboard from 'react-copy-to-clipboard';
// import { ActionSheet } from 'antd-mobile';
import QRCode from 'qrcode.react';

// import { isWechat } from '@/helps/help';
import NavBar from '@/helps/antdComponent/NavBar';
// import { Icon } from '@/helps/antdComponent/index.js';
import BaseComponent from '@/helps/BaseComponent';
import { Title, FlexRow } from '@/helps/styleComponent';
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
    this.registerLink = `${origin}${pathname}#/inviteAgentMiddle?pCode=${proxyid}`;
    this.state = {
      linkSrc: '',
    };
  }
  onCopy = (text, result) => {
    if (result && !this.helps.isWechat) {
      this.copySuccess = true;
    }
  }
  // showLinkOptionPicker =() => {
  //   const self = this;
  //   const BUTTONS = [<div>进入邀请链接</div>, '复制邀请链接', '取消'];
  //   ActionSheet.showActionSheetWithOptions({
  //     options: BUTTONS,
  //     cancelButtonIndex: BUTTONS.length - 1,
  //     destructiveButtonIndex: BUTTONS.length - 1,
  //     // title: 'title',
  //     message: '',
  //     maskClosable: true,
  //     'data-seed': 'logId',
  //     wrapProps,
  //   },
  //   (buttonIndex) => {

  //     // this.setState({ clicked: BUTTONS[buttonIndex] });
  //   });
  // }
  navigate = (routerName, query) => {
    this.router.go(routerName, query);
  };
  componentDidMount() {
    const imgData = this.canvasNode._canvas.toDataURL('image/png');
    this.setState({
      linkSrc: imgData,
    });
    // const fixType = (type) => {
    //     type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    //     const r = type.match(/png|jpeg|bmp|gif/)[0];
    //     return `image/${r}`;
    // };
    // // 加工image data，替换mime type
    // imgData = imgData.replace(fixType('png'), 'image/octet-stream');
    // var saveFile = function(data, filename){
    //   var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    //   save_link.href = data;
    //   save_link.download = filename;
    //   save_link.click();
    //   // var event = document.createEvent('MouseEvents');
    //   // event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    //   // save_link.dispatchEvent(event);
    // };
    // // 下载后的问题名
    // var filename = 'baidufe_' + (new Date()).getTime() + '.' + 'png';
    // // download
    // saveFile(imgData,filename);
    // <CopyToClipboard
    //         text={registerLink}
    //         onCopy={this.onCopy}
    //       >
    //       </CopyToClipboard>}
  }
  render() {
    const { inviteCode, inviteAgentBg } = this.props;
    const { registerLink } = this;
    const { linkSrc } = this.state;
    return (
      <div className={styles.container}>
        <Title>邀请成为代理</Title>
        <NavBar
          title="邀请成为代理"
          onClick={this.router.back}
        />
        <WrapContent inviteAgentBg={inviteAgentBg}>
          <div className={styles.qrContainer}>
            <FlexRow className={styles.userInfo}>
              <span className={styles.inviteCodeLabel}>邀请码:{inviteCode}</span>
            </FlexRow>
            <img width={160} height={160} src={linkSrc} />
            <div style={{ display: 'none' }}>
              <QRCode
                ref={(node) => { this.canvasNode = node; }}
                size={160}
                value={registerLink}
              />
            </div>
          </div>
        </WrapContent>
      </div>
    );
  }
}

const WrapContent = ({ inviteAgentBg, children }) => {
  if (inviteAgentBg) {
    return (<div className={styles.contentContainer}>
      <img className={styles.contentBg} src={inviteAgentBg} />
      <div className={styles.bgContentWrap}>
        { children }
      </div>
    </div>);
  } else {
    return (<div className={styles.contentContainer}>
      { children }
    </div>);
  }
};

function mapStateToProps(state) {
  return {
    ...state.agent,
    ...state.app,
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
