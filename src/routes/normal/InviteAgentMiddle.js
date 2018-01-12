import React from 'react';
import BaseComponent from '@/helps/BaseComponent';
import { connect } from 'dva';

class InviteAgentMiddle extends BaseComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     linkSrc: '',
  //   };
  // }
  async componentDidMount() {
    const { pCode } = this.router.getQuery();
    if (!this.helps.isWechat) {
      this.router.go('/login', {
        pCode,
      });
      return;
    }
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
    const { accountServerIP, accountServerPort, weChatMPID } = gameInfo;
    const origin = window.location.origin;
    const inviteLink = `http://${accountServerIP}:${accountServerPort}/WeChatAuthorize?ddmmp=${weChatMPID}&redirect=${origin}/generalManage/wechat.html&reqdeleInviter=${pCode}&actionType=inviteProxy`;
    window.location.href = inviteLink;
  }
  render() {
    return (
      <div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.app,
  };
}

export default connect(mapStateToProps)(InviteAgentMiddle);
