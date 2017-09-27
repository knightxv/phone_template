/* 使用: adapt (@designWidth, @rem2px)
 * 如adapt() 真实给的值为设计图的宽除以100(比如640的设计图adapt(640, 100),6.4就能占整个宽度了)
*/
// const designWidth = 640;//(设计图的大小)
// const rem2px = 100;//(设置的值与设计图的比值)
// // adapt(designWidth, rem2px)//设置rem 默认750的图，量出的尺寸除以100,rem
// const adapt = (designWidth = 750, rem2px = 100) => {
//   document.documentElement.style.fontSize = window.screen.width * window.devicePixelRatio / (designWidth / rem2px) + 'px'
// }

// //当dom加载完成时，或者 屏幕垂直、水平方向有改变进行html的根元素计算
// const resizeListener = (doc, win) => {
//   const docEl = doc.documentElement,
//     resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//     recalc = () => {
//       let clientWidth = docEl.clientWidth;
//       if (!clientWidth) return;
//       adapt()
//     };
//   if (!doc.addEventListener) return;
//   win.addEventListener(resizeEvt, recalc, false);
//   doc.addEventListener('DOMContentLoaded', recalc, false);
// };
// // //设置meta标签，解决1px边框问题
// const setMeta = () => {
//   // const width = window.screen.width;
//   // const targetW = designWidth;
//   const scale =  1;
//   let meta = document.createElement('meta');
//   meta.setAttribute('name', 'viewport');
//   meta.setAttribute('content', "user-scalable=no,initial-scale=" + scale + ",minimum-scale=" + scale + ",maximum-scale=" + scale );
//   document.head.appendChild(meta);
// }
// const init = () => {
//   resizeListener(document, window)//动态设置rem
//   setMeta()//解决1px问题
// }
// init()

// 防止点击300毫秒延迟问题
import FastClick from './fastclick.js';
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body);
  }, false);
}

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, function () {
    return arguments[1].toUpperCase();
  });
};

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase();
};

// 日期格式化
Date.prototype.format = function (format) {
  let o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (`${this.getFullYear()  }`).substr(4 - RegExp.$1.length)); }
  for (let k in o) {
    if (new RegExp(`(${  k  })`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? o[k]
        : (`00${  o[k]}`).substr((`${  o[k]}`).length));
    }
  }
  return format;
};

// const target = process.env.NODE_ENV !== 'production' ? '' : 'http://dev.fe.ptdev.cn'; //目标网站
// export {
//   target,
// }
