import React from 'react';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { window } from 'global';
import Toast from './antdComponent/Toast';

// import * as ToolComponents from './styleComponent';
import webHttp from '../extends/http/webHttp';
import './config';
import help from './help';
import Enum, { powerEnum } from '../extends/Enum';


export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    // 工具
    this.helps = {
      ...help,
      // 这两个要整理到helps上
      parseFloatMoney(money) {
        if (isNaN(money)) {
          return '';
        }
        return parseFloat(money / 100).toFixed(2);
      },
      transMoenyUnit(count) {
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
      },
      transCountUnit(count) {
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
      },
    };
    // 枚举
    this.TypeDefine = this.Enum = Enum;

    this.http = {
      webHttp,
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
  // 是否有某个权限
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
}
