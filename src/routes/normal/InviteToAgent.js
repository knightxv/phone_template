import React from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';

import NavBar from '@/helps/antdComponent/NavBar';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './InviteToAgent.less';

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
    this.state = {
      linkSrc: '',
      registerLink: '',
    };
  }
  createImage = (source) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = source;
      img.onload = () => {
        resolve(img);
      };
    });
  }
  async componentDidMount() {
    const { inviteCode, inviteAgentBg } = this.props;
    const winLoc = window.location;
    const origin = winLoc.origin;
    const pathname = winLoc.pathname;
    const registerLink = `${origin}${pathname}#/inviteAgentMiddle?pCode=${inviteCode}`;
    await this.setStateAsync({
      registerLink,
    });
    await this.makeImage(inviteCode, inviteAgentBg);
  }
  makeImage = async (code, bg) => {
    const ctx = this.bgCanvas.getContext('2d');
    // 画背景
    if (bg) {
      const bgImg = await this.createImage(bg);
      ctx.drawImage(bgImg, 0, 0, this.bgCanvas.width, this.bgCanvas.height);
    }
    // 画二维码
    const imgData = this.canvasNode._canvas.toDataURL('image/png');
    const qrcodeImg = await this.createImage(imgData);
    const putLeft = (this.bgCanvas.width - qrcodeImg.width) / 2;
    const putTop = (this.bgCanvas.height - qrcodeImg.height) / 2;
    ctx.drawImage(qrcodeImg, putLeft, putTop);
    // 画文字
    ctx.font = '18px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`邀请码：${code}`, putLeft, putTop - 10);
    const linkSrc = this.bgCanvas.toDataURL('image/png');
    this.setState({
      linkSrc,
    });
  }
  render() {
    const { linkSrc, registerLink } = this.state;
    const canvasWith = this.contentContainer ? this.contentContainer.offsetWidth : 0;
    const canvasHeight = this.contentContainer ? this.contentContainer.offsetHeight : 0;
    return (
      <div className={styles.container}>
        <Title>邀请成为代理</Title>
        <NavBar
          title="邀请成为代理"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer} ref={(node) => { this.contentContainer = node; }}>
          <img className={styles.linkImgSouce} src={linkSrc} />
        </div>
        <div style={{ display: 'none' }}>
          <canvas
            width={canvasWith}
            height={canvasHeight}
            ref={(node) => { this.bgCanvas = node; }}
          >
            浏览器不支持Canvas,请升级或改用其它浏览器！
          </canvas>
        </div>
        <div style={{ display: 'none' }}>
          <QRCode
            ref={(node) => { this.canvasNode = node; }}
            size={100}
            value={registerLink}
          />
        </div>
      </div>
    );
  }
}

// const WrapContent = ({ inviteAgentBg, children }) => {
//   if (inviteAgentBg) {
//     return (<div className={styles.contentContainer}>
//       <img className={styles.contentBg} src={inviteAgentBg} />
//       <div className={styles.bgContentWrap}>
//         { children }
//       </div>
//     </div>);
//   } else {
//     return (<div className={styles.contentContainer}>
//       { children }
//     </div>);
//   }
// };

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
