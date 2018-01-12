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
import styles from './InviteToAgent.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class InviteToPlayer extends BaseComponent {
  constructor(props) {
    super(props);
    // const { proxyid } = props;
    this.state = {
      linkSrc: '',
      inviteLink: '',
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
    const { inviteCode, invitePlayerBg } = this.props;
    let serverInfo = this.props.serverInfo;
    if (!serverInfo || serverInfo.length < 1) {
      const res = await this.http.webHttp.get('/spreadApi/getPlatformInfo');
      if (res.isSuccess) {
        serverInfo = res.data.serverInfo;
      } else {
        this.message.info('网络异常,请重试');
      }
      if (!serverInfo || serverInfo.length < 1) {
        this.message.info('没有可选的游戏');
        this.router.go('/login');
        return;
      }
    }
    const gameInfo = serverInfo[0];
    const { accountServerIP, accountServerPort, appDownLoadUrl, weChatMPID, gameID } = gameInfo;
    const inviteLink = `http://${accountServerIP}:${accountServerPort}/WeChatAuthorize?ddmmp=${weChatMPID}&redirect=${appDownLoadUrl}?gameID=${gameID}&reqdeleInviter=${inviteCode}&actionType=invitePlayer`;
    await this.setStateAsync({
      inviteLink,
    });
    await this.makeImage(inviteCode, invitePlayerBg);
    // if (this.canvasNode && this.canvasNode._canvas.toDataURL) {
    //   const imgData = this.canvasNode._canvas.toDataURL('image/png');
    //   this.setState({
    //     linkSrc: imgData,
    //   });
    // }
    // const { inviteCode, inviteAgentBg } = this.props;
    // const winLoc = window.location;
    // const origin = winLoc.origin;
    // const pathname = winLoc.pathname;
    // const registerLink = `${origin}${pathname}#/inviteAgentMiddle?pCode=${inviteCode}`;
    // await this.setStateAsync({
    //   registerLink,
    // });
    // await this.makeImage(inviteCode, inviteAgentBg);
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
    const { linkSrc, inviteLink } = this.state;
    const canvasWith = this.contentContainer ? this.contentContainer.offsetWidth : 0;
    const canvasHeight = this.contentContainer ? this.contentContainer.offsetHeight : 0;
    return (
      <div className={styles.container}>
        <Title>邀请成为玩家</Title>
        <NavBar
          title="邀请成为玩家"
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
            value={inviteLink}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.agent,
    ...state.app,
  };
}

export default connect(mapStateToProps)(InviteToPlayer);

