import webHttp from '../extends/http/webHttp';

export default {
  namespace: 'app',
  state: {
    componentLoading: false, // 组件是否在加载

    // 请求的数据
    gameName: '',
    companyName: '', // 公司名字
    iconLogo: '', // logo图片地址
    // invitePlayLink: '', // 邀请玩家链接
    inviteAgentBg: '', // 邀请代理图片地址
    serverInfo: [], // 服务器信息
  },
  reducers: {
    updateAppInfo(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    showLoading(state) {
      return {
        ...state,
        componentLoading: true,
      };
    },
    hideLoading(state) {
      return {
        ...state,
        componentLoading: false,
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

