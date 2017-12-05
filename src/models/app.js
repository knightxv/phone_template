
import webHttp from '../helps/webHttp';

export default {
  namespace: 'app',
  state: {
    gameName: '',
    companyName: '', // 公司名字
    iconLogo: '', // logo图片地址
    invitePlayLink: '', // 邀请玩家链接
    inviteAgentBg: '', // 邀请代理图片地址
    // loginID: '',
    // password: '',
  },
  reducers: {
    updateAppInfo(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
  },
  subscriptions: {
      async setup({ dispatch, history }) {  // eslint-disable-line
        webHttp.get('/spreadApi/getPlatformInfo').then((res) => {
          const gameConfig = res.data;
          dispatch({
            type: 'updateAppInfo',
            payload: {
              ...gameConfig,
              // ...gameConfig.bobing,
            },
          });
        });
      },
  },
};

