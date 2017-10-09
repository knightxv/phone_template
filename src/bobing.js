import dva from 'dva';

import { window } from 'global';
import { persistStore, autoRehydrate } from 'redux-persist';
import Promise from 'promise';
// import { browserHistory } from 'dva/router';
// import { useRouterHistory } from 'dva/router';
// import { createHashHistory } from 'history';

import './assets/css/global.css';
import './index.css';
import './assets/css/normal.css';

// 判断是否兼容此浏览器
window.isSupport = true;
window.Promise = Promise;
// 1. Initialize
const app = dva({
    // history: browserHistory,
  // history: useRouterHistory(createHashHistory)({ queryKey: false }),
  extraEnhancers: [autoRehydrate({
    log: false,
    stateReconciler: (defaultStore, newStore) => {
      return {
        ...defaultStore,
        ...newStore,
        routing: {}, // 去掉routing，不然会自动跳到跳出页面的路由
      };
    },
  },
  )], // 重新设置状态
});
// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/general'));
// app.model(require('./models/agent'));
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router_bobing'));

// 5. Start
app.start('#root');

persistStore(app._store); // 重新设置状态
