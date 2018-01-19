// 防止点击300毫秒延迟问题
import FastClick from './fastclick.js';
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body);
  }, false);
}

import './rem';

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

Array.prototype.findIndex = (() => {
  return Array.prototype.findIndex || function(fn) {
    let index = -1;
    for (let i = 0; i < this.length; i++) {
      if (fn(this[i]) === true) {
        index = i;
        break;
      }
    }
    return index;
  };
})();
