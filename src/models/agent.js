import { delay } from '@/helps/help';

const REGETVERIFYCODETIME = 60;

export default {
  namespace: 'agent',
  state: {

    inviteCode: 0, // 邀请码
    masonry: 0, // 砖石
    rechargeOfToday: 0, // 今日充值
    rechargeOfYesterDay: 0, // 昨日充值
    canCashCount: 0, // 未提现
    cashCountlog: 0, // 已提现
    proxyid: '',

      // 提现银行卡信息
    bankName: '', // 提现银行
    bankOfDeposit: '', // 银行开户行
    bankCardName: '', // 开户姓名
    cardNumber: '', // 卡号
    positionName: '', // 地区

    ranking: 999999,
    wechatacc: '',

    getVerifyCodeElseTime: 0, // 获取验证码剩余的时间（0代表可以重新获取）
  },
  reducers: {
    authSuccess(state) {
      console.log('auth success');
      return {
        ...state,
        authSuccess: true,
      };
    },

    authFail(state) {
      console.log('auth fail');
      return {
        ...state,
        authSuccess: false,
      };
    },
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
    *getVerifyCode({ payload }, { put, select }) {
        // 重置为60秒
      yield put({
        type: 'updateAppInfo',
        payload: {
          getVerifyCodeElseTime: REGETVERIFYCODETIME,
        },
      });
      let isCountEnd = false;
      while (!isCountEnd) {
        const state = yield select();
        const elseTime = state.app.getVerifyCodeElseTime;
        if (elseTime > 0) {
          yield delay(1000);
          yield put({
            type: 'updateAppInfo',
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
  subscriptions: {
      async setup({ dispatch, history }) {  // eslint-disable-line
      },
  },
};

