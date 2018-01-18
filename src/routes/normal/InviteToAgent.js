import React from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';

import NavBar from '@/helps/antdComponent/NavBar';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './InviteToAgent.less';

class InviteToAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      linkSrc: '',
      registerLink: '',
    };
    this.isLoad = false;
  }
  createImage = (source) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = '*';
      img.src = source;
      img.onload = () => {
        resolve(img);
      };
    });
  }
  async onLoad() {
    const { inviteCode, inviteAgentBg } = this.props;
    const winLoc = window.location;
    const origin = winLoc.origin;
    const pathname = winLoc.pathname;
    const noPortOrigin = origin.replace(/:\d+/, '');
    const registerLink = `${noPortOrigin}${pathname}#/inviteAgentMiddle?pCode=${inviteCode}`;
    await this.setStateAsync({
      registerLink,
    });
    await this.makeImage(inviteCode, inviteAgentBg);
  }
  makeImage = async (code, bg) => {
    const ctx = this.bgCanvas.getContext('2d');
    const codeWidth = this.canvasNode._canvas.width;
    // 画背景
    if (bg) {
      const bgImg = await this.createImage(bg);
      ctx.drawImage(bgImg, 0, 0, this.bgCanvas.width, this.bgCanvas.height);
    }
    // 画二维码
    const imgData = this.canvasNode._canvas.toDataURL('image/png');
    const qrcodeImg = await this.createImage(imgData);
    const putLeft = (this.bgCanvas.width - qrcodeImg.width) / 2;
    const putTop = 130;
    ctx.drawImage(qrcodeImg, putLeft, putTop);
    // 画文字的背景
    ctx.fillStyle = '#fff'; 
    ctx.fillRect(putLeft, putTop - 30, codeWidth, 30);
    // 画文字
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(`邀请码：${code}`, this.bgCanvas.width / 2, putTop - 10);
    const linkSrc = this.bgCanvas.toDataURL('image/png');
    this.setState({
      linkSrc,
    });
  }
  render() {
    const { linkSrc, registerLink } = this.state;
    const { inviteCode } = this.props;
    const canvasWidth = document.documentElement.offsetWidth > 750 ? 750 : document.documentElement.offsetWidth;
    const canvasHeight = document.documentElement.offsetHeight > 1134 ? 1134 : document.documentElement.offsetHeight;
    if (inviteCode && !this.isLoad) {
      this.isLoad = true;
      this.onLoad();
    }
    return (
      <div className={styles.container}>
        <Title>邀请成为代理</Title>
        <NavBar
          title="邀请成为代理"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          { linkSrc && <img className={styles.linkImgSouce} src={linkSrc} /> }
        </div>
        <div style={{ display: 'none' }}>
          <canvas
            width={canvasWidth}
            height={canvasHeight}
            ref={(node) => { this.bgCanvas = node; }}
          >
            浏览器不支持Canvas,请升级或改用其它浏览器！
          </canvas>
        </div>
        <div style={{ display: 'none' }}>
          <QRCode
            ref={(node) => { this.canvasNode = node; }}
            size={parseInt(canvasWidth * 0.15)}
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
