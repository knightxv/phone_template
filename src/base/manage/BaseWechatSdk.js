
// const isSuccess = await wechatSdkManage.shareLink({
//   title: 'lvelvelve', // 分享标题
//   link: 'http://res.ddmh5.com:81/share?gameID=adang01', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
//   imgUrl: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=380143431,1903446466&fm=58&s=59803C7385A54B111A71BD4F0300C0E1&bpow=121&bpoh=75', // 分享图标
//   type: 'link',
//   desc: '这是内容描述fff22',
// });

class BaseWechatSdk {
  constructor() {
    const wx = window.wx;
    if (!!wx) {
      this.wx = wx;
      this.init();
    } else {
      console.log('import wx on window');
    }
    this.checkResult = null;
  }
  async init() {
    await this.getJsApiList();
    const success = await this.setWechatConfig();
    if (!success) {
      console.log('获取微信配置失败');
      return;
    }
    if (!this.jsApiList) {
      return;
    }
    const self = this;
    this.wx.ready(() => {
      this.wx.checkJsApi({
        jsApiList: this.jsApiList,
        success(res) {
          self.checkApiResult(res);
        }
      });
    });
    this.wx.error((res) => {
      console.log(res);
    });
  }
  async checkApiResult(res) {
    console.log(`base wechat sdk set in ${JSON.stringify(res)}`);
    this.checkResult = res.checkResult;
    if (/:ok/.test(res.errMsg)) {
      this.configSuccess && this.configSuccess(res);
    } else {
      this.configFail && this.configFail(res);
    }
  }
  async getJsApiList() {
    console.log('rewrite getJsApiList set this.jsApiList');
    return [];
  }
  async setWechatConfig() {
    console.log('rewrite setWechatConfig to set this.wx.config');
    return null;
  }
  // 测试某个接口是否可用
  checkIsCanOption(functionName) {
    if (!this.wx || !/micromessenger/.test(navigator.userAgent.toLowerCase())) {
      return false;
    }
    if (!this.checkResult) {
      return false;
    }
    return this.checkResult[functionName];
  }
  async shareLink(shareInfo) {
    const success = await this.setWechatConfig();
    if (!success) {
      console.log('获取微信配置失败');
      return false;
    }
    console.log('share');
    console.log(shareInfo);
    this.wx.onMenuShareTimeline(shareInfo);
    this.wx.onMenuShareAppMessage(shareInfo);
    this.wx.onMenuShareQQ(shareInfo);
    this.wx.onMenuShareWeibo(shareInfo);
    this.wx.onMenuShareQZone(shareInfo);
    this.wx.onMenuShareAppMessage(shareInfo);
    return true;
  }

}

export default BaseWechatSdk;
