import { routerRedux } from 'dva/router';
import querystring from 'querystring';
import { window } from 'global';

export default {
  getQuery() {
    const searchValWin = window.location.search;
    const searchValApp = this.props.location.search;
    const searchTextWin = searchValWin.substr(1);
    const searchTextApp = searchValApp.substr(1);
    const queryWin = querystring.parse(searchTextWin);
    const queryApp = querystring.parse(searchTextApp);
    return {
      ...queryWin,
      ...queryApp,
    };
  },
  // go(path, query) {
  //   if (!query) {
  //     this.props.dispatch(routerRedux.push(path));
  //     return;
  //   }
  //   const isObj = Object.prototype.toString.call(query) === '[object Object]';
  //   if (isObj) {
  //     this.props.dispatch(routerRedux.push({
  //       pathname: path,
  //       search: querystring.stringify(query),
  //     }));
  //   }
  // },
  go() {

  },
  back() {
    this.props.dispatch(routerRedux.goBack());
  },
};
