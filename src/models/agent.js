

import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import socketManage from '../extends/Socket';
import { remoteUrl } from '@/config/index';

const delay = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};


const REGETVERIFYCODETIME = 60;
export default {
  namespace: 'agent',
  state: {
    // userName: '',
    
    // inviteCode: 0, // 邀请码
    // masonry: 0, // 砖石
    // rechargeOfToday: 0, // 今日充值
    // rechargeOfYesterDay: 0, // 昨日充值
    // canCashCount: 0, // 未提现
    // cashCountlog: 0, // 已提现
    // proxyid: '',

    //   // 提现银行卡信息
    // bankName: '', // 提现银行
    // bankOfDeposit: '', // 银行开户行
    // bankCardName: '', // 开户姓名
    // cardNumber: '', // 卡号
    // positionName: '', // 地区

    // ranking: 999999,
    // wechatacc: '',

    //*del loginID: '',
    //*del password: '',

    // getVerifyCodeElseTime: 0, // 获取验证码剩余的时间（0代表可以重新获取）
  },
  reducers: {
    updateAppInfo(state, { payload }) {
      return { ...state, ...payload };
    },
    *logout() {
        // return {
        //   loadedStore: true, // store是否已经加载完毕
        //   authSuccess: false, // 账号是否验证成功
        // };
    },
  },
  effects: {
      // 获取验证码倒计时
    // *getVerifyCode({ payload }, { put, select }) {
    //     // 重置为60秒
    //   yield put({
    //     type: 'updateAppInfo',
    //     payload: {
    //       getVerifyCodeElseTime: REGETVERIFYCODETIME,
    //     },
    //   });
    //   let isCountEnd = false;
    //   while (!isCountEnd) {
    //     const state = yield select();
    //     const elseTime = state.agent.getVerifyCodeElseTime;
    //     if (elseTime > 0) {
    //       yield delay(1000);
    //       yield put({
    //         type: 'updateAppInfo',
    //         payload: {
    //           getVerifyCodeElseTime: elseTime - 1,
    //         },
    //       });
    //     } else {
    //       isCountEnd = true;
    //     }
    //   }
    // },
  },
  subscriptions: {
      async setup({ dispatch, history }) {  // eslint-disable-line
        // // 计时器（待做）
        // dispatch({
        //   type: 'updateAppInfo',
        //   payload: {
        //     getVerifyCodeElseTime: 0,
        //   },
        // });
        // 重新刷新页面获取用户信息
        const whitePathName = [ '/homePage' ]; // 哪些路由不需要重新获取个人信息
        const pathName = history.location.pathname;
        if (whitePathName.indexOf(pathName) === -1) {
          const res = await fetch(`${remoteUrl}/spreadApi/getUserInfo`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
          })
          .then(res => res.json());
          if (res.status === 'success') {
            // 更新数据
            dispatch({
              type: 'updateAppInfo',
              payload: {
                ...res.data,
              },
            });
            // 连接socket
            const inviteCode = res.data.inviteCode;
            socketManage.sendMsg(inviteCode);
            // socketManage.on(socketManage.EventType.ReLoadAgentInfo,);
          } else if (res.status === 'failed' && res.code === 2) {
            dispatch(routerRedux.push('/login'));
          }
        }
      },
  },
};

