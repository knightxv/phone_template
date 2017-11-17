import gameConfig from '../config/gameInfo';

export default {
  namespace: 'app',
  state: {
    gameName: '阿当比鸡',
  },
  reducers: {
    setGameName(state, { payload }) {
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
        dispatch({
          type: 'setGameName',
          payload: {
            ...gameConfig,
            // ...gameConfig.bobing,
          },
        });
      },
  },
};

