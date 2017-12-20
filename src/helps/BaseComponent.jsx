import React from 'react';
import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import Toast from './antdComponent/Toast';
import * as TypeDefine from './typeDefine';

// import * as ToolComponents from './styleComponent';
import webHttp from './webHttp';
import './config';
import help from './help';

const powerEnum = { // 权限配置
  agentGiveForPlayer: 1, // 开启玩家赠送权限
  iAgentGiveForAgent: 2, // 开启总代理为下级代理充值权限
  iAgentGiveForAnyAgent: 3, // 开启总代理为所有代理充值权限
  playerSDKCharge: 4, // 开启玩家第三方充值
  proxySDKCharge: 5, // 开启代理第三方充值
  playerSave: 6, // 玩家收藏
  banlance: 7, // 账户余额栏目
  myPlayer: 8, // 我的玩家
  myAgent: 9, // 我的代理
  agentSave: 10, // 收藏代理功能
  iAgentGiveForUnderAgent: 12, // 我的下级代理（囤卡模式）
};
export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    // 提供工具类
    const resolveRouterReduxPush = (obj) => {
      const isObj = Object.prototype.toString.call(obj) === '[object Object]';
      if (isObj && obj.query) {
        obj.search = querystring.stringify(obj.query);
      }
      return routerRedux.push(obj);
    };

    // 工具
    this.helps = {
      webHttp,
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

    // 提供路由服务（对help的扩展，专门针对路由管理）
    const self = this;
    this.router = {
      getQuery() {
        const searchText = self.props.location.search.substr(1);
        const query = querystring.parse(searchText);
        return query;
      },
      go(path, query) {
        if (!query) {
          self.props.dispatch(routerRedux.push(path));
          return;
        }
        const isObj = Object.prototype.toString.call(query) === '[object Object]';
        if (isObj) {
          self.props.dispatch(routerRedux.push({
            pathName: path,
            search: querystring.stringify(query),
          }));
        }
      },
    };
    // this.attribute = {
    //   system: help.system(),
    //   isWechat: help.isWeixinBrowser,
    // };
  }
  hasPower(power) {
    const { powerList } = this.props;
    return !!powerList && powerList.findIndex((powerItem) => {
      return +powerItem === powerEnum[power];
    }) > -1;
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
