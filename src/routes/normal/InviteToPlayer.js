import React from 'react';
import { connect } from 'dva';
// import CopyToClipboard from 'react-copy-to-clipboard';
// import { ActionSheet } from 'antd-mobile';
import QRCode from 'qrcode.react';

// import { isWechat } from '@/helps/help';
import NavBar from '@/helps/antdComponent/NavBar';
// import { Icon } from '@/helps/antdComponent/index.js';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './InviteToAgent.less';

class InviteToPlayer extends BaseComponent {
  constructor(props) {
    super(props);
    // const { proxyid } = props;
    this.state = {
      linkSrc: '',
      inviteLink: '',
    };
    this.isLoad = false; // 是否拿到数据(确保只执行一次，相对于componentDidMount,解决重新刷新页面问题)
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
  onLoad = async () => {
    this.isGetData = true;
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
    const putTop = 160;
    ctx.drawImage(qrcodeImg, putLeft, putTop);
    // 画文字
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`邀请码：${code}`, putLeft, putTop - 10);
    const linkSrc = this.bgCanvas.toDataURL('image/png');
    this.setState({
      linkSrc,
    });
  }
  render() {
    const { linkSrc, inviteLink } = this.state;
    const { inviteCode } = this.props;
    const canvasWidth = document.documentElement.offsetWidth > 750 ? 750 : document.documentElement.offsetWidth;
    const canvasHeight = document.documentElement.offsetHeight > 1134 ? 1134 : document.documentElement.offsetHeight;
    if (inviteCode && !this.isLoad) {
      this.isLoad = true;
      this.onLoad();
    }
    return (
      <div className={styles.container}>
        <Title>邀请成为玩家</Title>
        <NavBar
          title="邀请成为玩家"
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
            size={parseInt(canvasWidth * 0.2)}
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

