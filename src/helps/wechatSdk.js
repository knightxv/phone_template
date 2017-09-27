import http from '../utils/http';

class Wechat {
  constructor(configUrl, postBody) {
    this.configUrl = configUrl;
    this.postBody = postBody;
    // this.cacheConfig = { // 用来缓存数据

    // };
    this.wx = window.wx;
    this.jsApiList = [ // 需要访问的权限
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'getNetworkType',
      'chooseWXPay',
    ];
    this.checkResult = {}; // 获取的权限结果
    this.isReady = false;
    this.init();
  }
  init() {
    const self = this;
    this.updateConfig().then((isGetConfigSuccess) => {
      if (!isGetConfigSuccess) {
        this.isReady = false;
      }
      this.wx.ready(() => {
        console.log('ready');
        this.isReady = true;
        this.wx.checkJsApi({
          jsApiList: self.jsApiList,
          success(res) {
            self.checkResult = res.checkResult;
            // alert(JSON.stringify(res));
          },
        });
      });
    });
  }
  // 更新config
  updateConfig() {
    return new Promise(async (resolve) => {
      const url = window.location.href.split('#')[0];
      const postBody = {
        ...this.postBody,
        Url: url,
      };
      const res = await http.post(this.configUrl, postBody, { type: http.KEYTYPE.CLIENT });
      console.log('get config');
      console.log(res);
      if (res.isSuccess) {
        const { AppId, Head, NonceStr, Signature, Timestamp } = res.data;
        this.wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: AppId, // 必填，公众号的唯一标识
          timestamp: Timestamp, // 必填，生成签名的时间戳
          nonceStr: NonceStr, // 必填，生成签名的随机串
          signature: Signature, // 必填，签名，见附录1
          jsApiList: this.jsApiList, // 必填，需要使用的JS接口列表，
        });
        resolve(true);
      }
      resolve(false);
    });
  }
  // 测试某个接口是否可用
  checkIsCanOption(functionName) {
    if (!this.wx || !/micromessenger/.test(navigator.userAgent.toLowerCase())) {
      return false;
    }
    return !!this.checkResult[functionName];
  }
  // 分享页面(返回是否分享功能的promise)
  async share(shareInfo) {
    console.log('upload config');
    await this.updateConfig();
    console.log('upload config success');
    const self = this;
    return new Promise((resolve) => {
      const wrapEventShareInfo = {
        ...shareInfo,
        success: () => {
          console.log('share success');
          resolve(true);
        },
        cancel: () => {
          console.log('share fail');
          resolve(false);
        },
      };
      self.wx.onMenuShareTimeline(wrapEventShareInfo);
      self.wx.onMenuShareAppMessage(wrapEventShareInfo);
      self.wx.onMenuShareQQ(wrapEventShareInfo);
      self.wx.onMenuShareWeibo(wrapEventShareInfo);
      self.wx.onMenuShareQZone(wrapEventShareInfo);
      self.wx.onMenuShareAppMessage(wrapEventShareInfo);
    });
  }
}

export default Wechat;
