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
import { window } from 'global';
import { Toast } from './antdComponent';

// import * as ToolComponents from './styleComponent';
import Http from './Http';
import './config';
import help from './help';

const webHttpConfig = {
  getConfigUrl: '/config',
  httpConfigKey: 'JavaWebPublicServerUrl',
  isDebug: true,
  responseHandle(res) {
    if (res.status === 'failed' && res.code === 2) {
      Toast.info(res.info, 1, null, false);
      window.location.href = '#/general/login';
    }
  },
  webResolveResult(res, Response) {
    if (res.status === 'success') {
      return new Response(true, res.Msg, res.data);
    } else {
      return new Response(false, res.info);
    }
  },
};
const webHttp = new Http(webHttpConfig);

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    // 提供工具类
    this.helps = {
      webHttp,
      ...help,
      toast: (msg) => {
        Toast.info(msg || '未知错误', 1, null, false);
      },
      routerRedux,
    };


    // this.attribute = {
    //   system: help.system(),
    //   isWechat: help.isWeixinBrowser,
    // };
  }
}
