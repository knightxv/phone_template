import { document, window } from 'global';
// import { Toast as DefaultToast } from 'antd-mobile';

// export const Toast = {
//   info: (message) => {
//     DefaultToast.info(message, 1, null, false);
//   },
// };
export const delay = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};


export const createMarkup = (html) => {
  return {
    __html: html,
  };
};

// 识别微信浏览器
export const isWeixinBrowser = () => {
  return /micromessenger/.test(window.navigator.userAgent.toLowerCase());
};

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

// 新窗口打开另外一个页面
export const openWindow = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
};

// 保存cookie
export const saveCookie = (name, value, min) => {
  let expires = '';
  if (min) {
    const date = new Date();
    date.setTime(date.getTime() + (min * 60 * 1000));
    expires = `;expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires};path=/`;
};
// 读取cookie
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookieArr = document.cookie.split(';');
  for (let i = 0; i < cookieArr.length; i++) {
    let c = cookieArr[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

export function removeCookie(name) {
  if (!name) {
    return;
  }
  saveCookie(name, '', -1);
}

const nowSystem = system();
const isWechat = isWeixinBrowser();
exports.isWechat = isWechat;
exports.system = system;

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
const payEnum = {
  WECHAT: 0,
  ALI: 1,
};

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

// 得到本月一号的时间
export const getMonthTimeStamp = (timeStamp) => {
  let now = new Date();
  if (timeStamp) {
    now = new Date(timeStamp);
  }
  const monthLabel = now.format('yyyy/MM/1');
  return new Date(monthLabel).getTime();
};


export default exports;
