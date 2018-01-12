import React from 'react';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { window } from 'global';
import Toast from './antdComponent/Toast';
// import * as ToolComponents from './styleComponent';
import webHttp from '../extends/http/webHttp';
import accountHttp from '../extends/http/accountHttp';
import './config';
import help from './help';
import helper from '../extends/helper';
import Enum, { powerEnum } from '../extends/Enum';

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    // 工具
    this.helps = {
      ...help,
      ...helper,
    };
    // 枚举
    this.Enum = Enum;

    this.http = {
      webHttp,
      accountHttp,
      // fetch,
    };

    // 提供路由服务（对help的扩展，专门针对路由管理）
    const self = this;
    this.router = {
      getQuery() {
        const searchValWin = window.location.search;
        const searchValApp = props.location.search;
        const searchTextWin = searchValWin.substr(1);
        const searchTextApp = searchValApp.substr(1);
        const queryWin = querystring.parse(searchTextWin);
        const queryApp = querystring.parse(searchTextApp);
        return {
          ...queryWin,
          ...queryApp,
        };
      },
      go(path, query) {
        if (!query) {
          self.props.dispatch(routerRedux.push(path));
          return;
        }
        const isObj = Object.prototype.toString.call(query) === '[object Object]';
        if (isObj) {
          self.props.dispatch(routerRedux.push({
            pathname: path,
            search: querystring.stringify(query),
          }));
        }
      },
      back() {
        self.props.dispatch(routerRedux.goBack());
      },
    };

    // 提示
    this.message = {
      info(message) {
        Toast.info(message, 1, null, false);
      },
    };

    this.valid = {
      phone: (text) => {
        if (typeof text !== 'string') {
          return false;
        }
        return /^1[34578]\d{9}$/.test(text);
      },
    };

  }
  // hasPower(...powers) {
  //   const { powerList } = this.props;
  //   if (!powerList || !powerList.length) {
  //     return false;
  //   }
  //   return powers.some((power) => {
  //     return powerList.findIndex((powerItem) => {
  //       return +powerItem === powerEnum[power];
  //     }) > -1;
  //   });
  // }
  // 是否有权限
  hasPower(powerName, powerVal) {
    const { powerList } = this.props;
    const powerKey = powerEnum[powerName];
    if (!powerList || typeof powerList[powerKey] === 'undefined') {
      return false;
    }
    if (typeof powerVal === 'undefined') {
      return true;
    }
    return powerList[powerKey] == powerVal;
  }
  // 是否有某个权限
  hasPowerSome(...powers) {
    return powers.some((powerName) => {
      return this.hasPower(powerName);
    });
  }
  setStateAsync = (state) => {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
}
