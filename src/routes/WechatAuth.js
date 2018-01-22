import React from 'react';
import { connect } from 'dva';
import BaseComponent from '@/core/BaseComponent';

class WechatAuth extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentWillMount() {
    const { actionType, headImageUrl, accountID, deleInviter, token } = this.router.getQuery();
    const accountId = accountID;
    const pCode = deleInviter;
    if (typeof accountId === 'undefined') {
      this.message.info('验证失败');
      this.router.go('/login');
      return;
    }
    // pc登录流程
    if (actionType === 'pcLogin') {
      const { uuid } = this.router.getQuery();
      const pcLoginRes = await this.http.webHttp.get('/spreadApi/wechat/pcWeChatLogin', {
        uuid, token, accountId, headImageUrl,
      });
      if (pcLoginRes.isSuccess) {
        // this.message.info('验证成功'); // 跳转登录成功页面
        this.router.go('/pcLoginResult', {
          result: 0,
        });
      } else {
        this.router.go('/pcLoginResult', {
          result: 1,
        });
      }
      return;
    }
    const webParams = {
      accountId,
      headImageUrl,
      token,
    };
    const webRes = await this.http.webHttp.get('/spreadApi/wechat/login', webParams);
    // isRegister 代表已经微信已经绑定账号了
    if (!webRes.isSuccess) {
      this.message.info('验证失败,请重试');
      this.router.go('/login');
      // 登录失败
      return;
    }
    // 登录流程
    if (actionType === 'login') {
      if (webRes.data.isRegister) {
        this.router.go('/homePage');
      } else {
        this.router.go('/wechatBindPhone');
      }
      return;
    }
    

    // 邀请代理流程
    if (actionType === 'inviteProxy') {
      const isRegister = webRes.data.isRegister;
      if (isRegister) {
        this.router.go('/bindFail');
      } else {
        if (pCode == 0) {
          // 已经有账号，但是没上级
          const isGoBindPhone = window.confirm('该手机已创建账户，暂无法更换上级邀请码，微信绑定账户后可使用微信快速登录，是否继续绑定账户？');
          if (isGoBindPhone) {
            this.router.go('/wechatBindPhone');
          } else {
            this.router.go('/login');
          }
          return;
        }
        this.router.go('/wechatBindPhone', {
          pCode,
        });
      }
    }
  }
  render() {
    return (
      <div>
       正在登陆...
      </div>
    );
  }
}


// function mapStateToProps(state) {
//   return {
//     ...state.agent
//   };
// }

export default connect()(WechatAuth);
