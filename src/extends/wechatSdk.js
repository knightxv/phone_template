import BaseWechatSdk from '../base/manage/BaseWechatSdk';

class WechatSdk extends BaseWechatSdk {
  getJsApiList() {
    this.jsApiList = [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'getNetworkType',
      'chooseWXPay',
    ];
  }
  async setWechatConfig() {
    let url = window.location.href.split('#')[0].replace(/\/$/, ''); // http://192.168.2.88:8000
    const authBody = {
      Head: 0xFF06,
      MPID: 'adgame',
      Url: url,
    };
    const res = await fetch('http://res.ddmh5.com:900/ClientPack', {
      method: 'POST',
      body: JSON.stringify(authBody),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    if (!res.AppId) {
      return false;
    }
    const { AppId, Head, NonceStr, Signature, Timestamp } = res;
    this.wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: AppId, // 必填，公众号的唯一标识
      timestamp: Timestamp, // 必填，生成签名的时间戳
      nonceStr: NonceStr, // 必填，生成签名的随机串
      signature: Signature, // 必填，签名，见附录1
      jsApiList: this.jsApiList, // 必填，需要使用的JS接口列表，
    });
    return true;
  }
  async configSuccess(result) {
    console.log(result)
  }
  async configFail(res) {
    console.log('微信获取权限失败', res);
  }
  
}

export default new WechatSdk();
