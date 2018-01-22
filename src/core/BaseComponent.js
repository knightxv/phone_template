
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { window } from 'global';
import BaseClass from '../base/BaseClass';
import appExtends from '../extends/index';


// 项目基于此开发
// 引入extends
// 添加公用函数
Object.assign(BaseClass.prototype, appExtends);

export default class BaseComponent extends BaseClass {
  constructor(props) {
    super(props);

    // 提供路由服务（专门针对路由管理）
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
    const powerKey = this.Enum.powerEnum[powerName];
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


