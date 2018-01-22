import React from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import UUID from 'uuid-js';

// import InputItem from '@/helps/antdComponent/InputItem';
import BaseComponent from '@/core/BaseComponent';
// import NavBar from '@/helps/antdComponent/NavBar';
import { Title } from '@/components/styleComponent';
import styles from './PcWechatLogin.less';

class PcWechatLogin extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loginLink: '',
      linkSrc: '',
    };
    this.timer = null;
    this.gameInfo = {};
    this.queryInfo = {};
    this.pollTime = 1000; // 间隔时间
    
  }
  async componentDidMount() {
    await this.getServerConfig();
    this.updateCode();
  }
  // 拿到服务器配置放到 this.gameInfo 上
  getServerConfig = async () => {
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
        return;
      }
    }
    const gameInfo = serverInfo[0];
    this.gameInfo = gameInfo;
  }
  createUUID = () => {
    const uuid4 = UUID.create();
    return uuid4.toString();
  }
  // 更新二维码 并把 uuid,t 放到 this.queryInfo 上并自动循环登录
  updateCode = async () => {
    const gameInfo = this.gameInfo;
    if (!gameInfo) {
      this.message.info('没有可选的游戏');
      return;
    }
    const uuid = this.createUUID();
    const t = new Date().getTime();
    this.queryInfo = {
      uuid, t,
    };
    const origin = window.location.origin;
    const { accountServerIP, accountServerPort, weChatMPID } = gameInfo;
    const pcLoingLink = `http://${accountServerIP}:${accountServerPort}/WeChatAuthorize?ddmmp=${weChatMPID}&redirect=${origin}/generalManage/wechat.html&uuid=${uuid}&t=${t}&actionType=pcLogin`;
    await this.setStateAsync({
      loginLink: pcLoingLink,
    });
    const imgData = this.canvasNode._canvas.toDataURL('image/png');
    await this.setStateAsync({
      linkSrc: imgData,
    });
    this.pollLogin();
  }
  // 循环登录
  pollLogin = () => {
    const { uuid, t } = this.queryInfo;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(async () => {
      const res = await this.http.webHttp.get('/spreadApi/wechat/isLogin', {
        uuid, t,
      });
      if (res.isSuccess) {
        window.clearTimeout(this.timer);
        const { isRegister } = res.data;
        this.wechatAuthSuccess(isRegister);
      } else {
        this.pollLogin();
      }
    }, this.pollTime);
  }
  stopPollLoing = () => {
    window.clearTimeout(this.timer);
  }
  componentWillUnmount() {
    this.stopPollLoing();
  }
  // 用户扫码成功
  wechatAuthSuccess = (isRegister) => {
    if (isRegister) {
      this.router.go('/homePage');
    } else {
      this.router.go('/wechatBindPhone');
    }
  }
  render() {
    const { loginLink, linkSrc } = this.state;
    return (
      <div className={styles.container}>
        <Title>微信登录</Title>
        {/* <NavBar
          title="微信登录"
          onClick={this.router.back}
        /> */}
        <div className={styles.contentContainer}>
          <div>
            <img width={300} height={300} src={linkSrc} />
            <div className={styles.sysTip}>扫码>关注>登录</div>
            <div style={{ display: 'none' }}>
              <QRCode
                ref={(node) => { this.canvasNode = node; }}
                size={160}
                value={loginLink}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    ...state.app,
  };
}

export default connect(mapStateToProps)(PcWechatLogin);
