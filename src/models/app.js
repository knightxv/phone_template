
import webHttp from '../helps/webHttp';

export default {
  namespace: 'app',
  state: {
    gameName: '',
    loginID: '',
    password: '',
  },
  reducers: {
    setGameName(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
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
            type: 'setGameName',
            payload: {
              ...gameConfig,
              // ...gameConfig.bobing,
            },
          });
        });
      },
  },
};

