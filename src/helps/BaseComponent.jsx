/*
remark:

npm dev
yarn add react-helmet styled-components

roadhogrc.mock.js add
'GET /config': {
    web: 'http://192.168.1.100:8000'
},

*/
import React from 'react';
import { routerRedux } from 'dva/router';
import fetch from 'dva/fetch';
import querystring from 'querystring';
import { window } from 'global';
import { Toast } from './antdComponent';
import * as TypeDefine from './typeDefine';

// import * as ToolComponents from './styleComponent';
import webHttp from './webHttp';
import './config';
import help from './help';

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    // 提供工具类
    const resolveRouterReduxPush = (obj) => {
      const isObj = Object.prototype.toString.call(obj) === '[object Object]';
      if (isObj && obj.query) {
        obj.search = help.queryString.stringify(obj.query);
      }
      return routerRedux.push(obj);
    };
    this.helps = {
      webHttp,
      fetch,
      ...help,
      toast: (msg) => {
        Toast.info(msg || '未知错误', 1, null, false);
      },
      querystring,
      routerRedux: {
        ...routerRedux,
        push: resolveRouterReduxPush,
      },
    };

    this.TypeDefine = TypeDefine;

    // this.attribute = {
    //   system: help.system(),
    //   isWechat: help.isWeixinBrowser,
    // };
  }
  parseFloatMoney = (money) => {
    return parseFloat(money / 100).toFixed(2);
  }
  transMoenyUnit = (count) => {
    const transCount = count.toString();
    if (transCount.length === 4) {
      return `${parseFloat(transCount / 1000)}千`;
    } else if (transCount.length > 4) {
      return `${parseFloat(transCount / 10000)}万`;
    }
    return transCount;
  }
}
