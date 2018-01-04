import dva from 'dva';

// import { window } from 'global';
import { persistStore, autoRehydrate } from 'redux-persist';
import Promise from 'promise';
// import { browserHistory } from 'dva/router';
// import { useRouterHistory } from 'dva/router';
// import { createHashHistory } from 'history';

// 判断是否兼容此浏览器
window.isSupport = true;
if(!window.Promise) {
  // document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"'+'>'+'<'+'/'+'script>');
  window.Promise = Promise ;
}

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
      //     routing: { location: null }, // 去掉routing，不然会自动跳到跳出页面的路由
        };
      },
    },
  )], // 重新设置状态
  onError(e, dispatch) {
    console.log(e.message);
  },
});

// 4. Router
app.router(require('./router'));

app.model(require('./models/app'))
// app.model(require('./models/agent'))

// 5. Start
app.start('#root');

persistStore(app._store); // 重新设置状态
