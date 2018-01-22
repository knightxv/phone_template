import Enum from './Enum';
import socketManage from './Socket';
import defaultHelper from '../base/helper/index';
import appHelper from './helper';
import wechatSdk from './wechatSdk';
import http from './http/index';
import message from './message';
import valid from './valid';
import config from './config';
// import router from './router';

const helps = {
  ...defaultHelper,
  ...appHelper,
};


export default {
  socketManage,
  helps,
  Enum,
  wechatSdk,
  http,
  message,
  valid,
  config,
  // router,
};
