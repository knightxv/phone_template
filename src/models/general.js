const delay = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};


const REGETVERIFYCODETIME = 60;

export default {
  namespace: 'general',
  state: {
    // cashCountlog: 0, // 已提成（文档没要求）
    canCashCount: 0, // 余额（元）
    proxyid: 0, // 代理id
    inviteCode: '', // 邀请码
    
    commissionRate: 0, // 当前提成比例
    prizeByExtension: 0, // 推广人数奖励(元)
    openDay: 0, // 开通天数
    commissionByAgent: 0, // 代理充值提成（元）
    commissionOfToday: 0, // 今日提成（元）
    commissionOfYesterDay: 0, // 昨日提成（元）

    wechat_acc: '', // 提现所用的微信号
    positionName: '', // 位置
    cardNumber: '', // 银行卡号
    bankCardName: '', // 银行卡名字
    bankName: '', // 银行
    bankOfDeposit: '', // 开户银行

    getVerifyCodeElseTime: 0,

  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getVerifyCode({ payload }, { put, select }) {
      // 重置为60秒
      yield put({
        type: 'updateInfo',
        payload: {
          getVerifyCodeElseTime: REGETVERIFYCODETIME,
        },
      });
      let isCountEnd = false;
      while (!isCountEnd) {
        const state = yield select();
        const elseTime = state.general.getVerifyCodeElseTime;
        if (elseTime > 0) {
          yield delay(1000);
          yield put({
            type: 'updateInfo',
            payload: {
              getVerifyCodeElseTime: elseTime - 1,
            },
          });
        } else {
          isCountEnd = true;
        }
      }
    },
  },
  reducers: {
    updateInfo(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};

