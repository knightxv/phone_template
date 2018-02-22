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
export const system = () => {
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


// 得到天(0:0:0)的时间戳(不传默认今天)
export const getDayTimeStamp = (timeStamp) => {
  let now = new Date();
  if (timeStamp) {
    now = new Date(timeStamp);
  }
  const monthLabel = now.format('yyyy/MM/dd');
  return new Date(monthLabel).getTime();
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
