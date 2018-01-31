import { payType as payEnum } from './Enum';

export const parseFloatMoney = (money) => {
  if (isNaN(money)) {
    return '';
  }
  return parseFloat(money / 100).toFixed(2);
};

export const parseIntMoney = (money) => {
  if (isNaN(money)) {
    return '';
  }
  return parseInt(money / 100);
};
export const transMoenyUnit = (count) => {
  if (isNaN(count)) {
    return '';
  }
  const transCount = count.toString();
  if (transCount.length === 4) {
    return `${parseFloat(transCount / 1000)}千`;
  } else if (transCount.length > 4) {
    return `${parseFloat(transCount / 10000)}万`;
  }
  return transCount;
};
export const transCountUnit = (count) => {
  if (isNaN(count)) {
    return '';
  }
  const transCount = count.toString();
  if (transCount.length === 4) {
    return `${parseFloat(transCount / 1000)}千`;
  } else if (transCount.length > 4) {
    return `${parseFloat(transCount / 10000)}万`;
  }
  return transCount;
};

// 兼容旧版本
const isWeixinBrowser = () => {
  return /micromessenger/.test(window.navigator.userAgent.toLowerCase());
};
export const isWechat = isWeixinBrowser();

// 支付

const browserTypeEnum = {
  // 微信支付
  WECHAT_ANDROID_PHONE_WINDOS: 0, // 0 安卓手机浏览器---
  WECHAT_IOS_PHONE_WINDOS: 1, // 1 IOS手机浏览器---
  WECHAT_PC_WINDOS: 2, // 微信PC----
  WECHAT_IOS_WECHATWINDOS: 3, // 3 IOSWeChat浏览器---
  WECHAT_ANDROID_WECHATWINDOS: 4, // 4 安卓WeChat浏览器---
	// 支付宝支付
  ALIPAY_ANDROID_PHONE_WINDOS: 5, // 安卓手机浏览器---
  ALIPAY_IOS_PHONE_WINDOS: 6, // 5 IOS手机浏览器---
  ALIPAY_PC_WINDOS: 7, // 支付宝pc---
};

// 支付配置

// 判断是哪个系统
const system = () => {
  const u = window.navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // g
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  let useSystem;
  if (isAndroid) {
    useSystem = 'Android';
  } else if (isIOS) {
    useSystem = 'IOS';
  } else {
    useSystem = 'PC';
  }
  return useSystem;
};
const nowSystem = system();
export const payType = (type) => {
  let chargeType;
  if (nowSystem === 'PC') {
    if (type === payEnum.ALI) {
      chargeType = browserTypeEnum.ALIPAY_PC_WINDOS;
    } else {
      chargeType = browserTypeEnum.WECHAT_PC_WINDOS;
    }
  } else if (nowSystem === 'Android') {
    if (isWechat) {
      chargeType = browserTypeEnum.WECHAT_ANDROID_WECHATWINDOS;
    } else if (type === payEnum.ALI) {
      chargeType = browserTypeEnum.ALIPAY_ANDROID_PHONE_WINDOS;
    } else {
      chargeType = browserTypeEnum.WECHAT_ANDROID_PHONE_WINDOS;
    }
  } else if (nowSystem === 'IOS') {
    if (isWechat) {
      chargeType = browserTypeEnum.WECHAT_IOS_WECHATWINDOS;
    } else if (type === payEnum.ALI) {
      chargeType = browserTypeEnum.ALIPAY_IOS_PHONE_WINDOS;
    } else {
      chargeType = browserTypeEnum.WECHAT_IOS_PHONE_WINDOS;
    }
  }
  return chargeType;
};

export default exports;
