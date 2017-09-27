import { document, window } from 'global';
import queryString from 'querystring';
// import { Toast as DefaultToast } from 'antd-mobile';

// export const Toast = {
//   info: (message) => {
//     DefaultToast.info(message, 1, null, false);
//   },
// };
exports.queryString = queryString;
exports.delay = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};


exports.createMarkup = (html) => {
  return {
    __html: html,
  };
};

// 识别微信浏览器
exports.isWeixinBrowser = () => {
  return /micromessenger/.test(window.navigator.userAgent.toLowerCase());
};

// 判断是哪个系统
exports.system = () => {
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
exports.openWindow = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
};
