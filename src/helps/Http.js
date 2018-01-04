/*
  simple use
  import Http from '../services/Http';
  const http = new Http({
    getConfigUrl: 'http://192.168.1.100:8000/config',
    httpConfigKey: 'JavaWebPublicServerUrl',
    isDebug: false,
  });
  http.get('/phone/api/agreenExplain')
    .then(res => {
      console.log(res);
    });
*/

// request后端接口
import queryString from 'querystring';
import fetch from 'dva/fetch';

// 默认返回的http格式
class Response {
  constructor(isSuccess, info, data = null) {
    this.isSuccess = isSuccess;
    this.info = info;
    this.data = data;
  }
}

const parseJSON = res => res.json();
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

const httpRequest = (fetchUrl, fetchOption) => {
  return fetch(fetchUrl, fetchOption)
    .then(checkStatus)
    .then(parseJSON);
};

// import wrappedPromise from './makeCancelablePromise';
const getDefaultOption = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include', // same-origin
  headers: {
      // 'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'text/plain',
  },
};

const postDefaultOption = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // 'Access-Control-Allow-Credentials':'true',
    // 'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'text/plain',
  },
};
const defaultOption = {
  // httpPrefix: '',
  getConfigUrl: '',
  httpConfigKey: 'web', // 拿到配置后的url key值
  isDebug: false,
  webResolveResult: (res, Response) => { // 默认http拿到请求后返回的数据
    // if (res.status === 'success') {
    //   return new Response(true, res.Msg, res.data);
    // } else {
    //   return new Response(false, res.Msg);
    // }
  },
  onGetHttpConfigSuccess: (config) => {  // 请求config数据成功
  },
  resolveConfig: null, // 重新设置config
  onGetHttpConfigFail: () => {  // 请求config数据失败
  },
   // 得到response进行处理（当中间键用）
  responseHandle: (response) => { // middware async
    // console.log(response);
  },
   // get请求得到reponse
  onGetResponseSuccess: (response) => { // middware async
    // console.log('---get---', fetchUrl);
    // console.log('--params--', params);
    // console.log('--response--', response);
    // return true;
  },
   // post请求得到reponse
  onPostResponseSuccess: (response) => { // middware async
    // console.log('---post---', fetchUrl);
    // console.log('--params--', body);
    // console.log('--response--', response);
    // return true;
  },
};

const isFunction = (fn) => {
  return Object.prototype.toString.call(fn) === '[object Function]';
};

class Http {
  constructor(userHttpOption) {
    this.httpConfig = null;
    this.configOption = {
      ...defaultOption,
      ...userHttpOption,
    };
    this.httpPrefix = ''; // 请求前缀
    this.httpConfig = null;
  }
  // 设置http url
  setHttpPrefix(url) {
    if (!url.indexOf('http://') !== -1) {
      this.httpPrefix = `http://${url}`;
      return false;
    }
    this.httpPrefix = url;
  }
    // 获取配置信息
  async _fetchToGetHttpConfig() {
    const self = this;
    if (this.httpConfig) {
      return this.httpConfig;
    }
    const { getConfigUrl, resolveConfig } = this.configOption;
    return new Promise((resolve) => {
      fetch(getConfigUrl)
        .then(parseJSON)
        .then(async (config) => {
          await self._onGetConfigSuccess(config);
          const reConfig = isFunction(resolveConfig) ? resolveConfig(config) : config;
          self.httpConfig = reConfig;
          resolve(reConfig);
        })
        .catch(async () => {
          await self._onGetConfigFail();
          resolve(null);
        });
    });
  }
  // 从获取的config中拿到请求的url（设置好 httpConfigKey ）
  async _getFetchUrl() {
    await this._fetchToGetHttpConfig();
    const { httpConfigKey } = this.configOption;
    const httpConfig = this.httpConfig;
    if (!httpConfig) {
      return '';
    }
    return httpConfig[httpConfigKey];
  }
  httpLog(type, url, params, response) {
    console.log(`${type} : ${url}`);
    console.log('params : ', params);
    console.log('response : ', response);
  }
  get(...arg) {
    const self = this;
    const { fetchOption, responseHandle, isDebug, webResolveResult, onGetResponseSuccess } = this.configOption;
    const option = {
      ...getDefaultOption,
      ...fetchOption,
    };
    return new Promise(async (resolve) => {
      // 获取远程地址
      let fetchUrl = '';
      if (self.configOption.getFetchUrl) {
        fetchUrl = self.configOption.getFetchUrl();
      } else {
        fetchUrl = await self._getFetchUrl();
      }
      const [apiUrl, params = {}] = arg;
      fetchUrl = `${fetchUrl}${apiUrl}?${queryString.stringify({ ...params })}`;
      httpRequest(fetchUrl, option)
        .then(async (response) => {
          isFunction(responseHandle) && await responseHandle(response);// middleware
          isFunction(onGetResponseSuccess) && await onGetResponseSuccess(response);// middleware
          if (isDebug || window.HttpDebug) {
            self.httpLog('get', fetchUrl, params, response);
          }
          if (isFunction(webResolveResult)) {
            const resolveRes = await webResolveResult(response, Response);
            if (resolveRes && resolveRes instanceof Response) {
              resolve(resolveRes);
            } else {
              throw new Error('webResolveResult 应该实现并返回Response的实例');
            }
            return false;
          }
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
          resolve(new Response(false, '网络繁忙,请稍后重试'));
        });
    });
  }
    // 如果后端服务器不识别这种请求头就采用config.header.headerForm
  post(...arg) {
    const self = this;
    const { postOption, responseHandle, isDebug, webResolveResult, onPostResponseSuccess } = this.configOption;
    return new Promise(async (resolve) => {
      // 获取远程地址
      let prefixUrl = '';
      if (self.configOption.getFetchUrl) {
        prefixUrl = self.getFetchUrl();
      } else {
        prefixUrl = await self.configOption._getFetchUrl();
      }
      const [apiUrl, body = {}] = arg;
      // const { type = this.defaultKeyType } = option;
      const option = {
        ...postDefaultOption,
        ...postOption,
        body: JSON.stringify({ ...body }),
      };
      const fetchUrl = `${prefixUrl}${apiUrl}`;
      httpRequest(fetchUrl, option)
        .then(async (response) => {
          isFunction(responseHandle) && await responseHandle(response);// middleware
          isFunction(onPostResponseSuccess) && await onPostResponseSuccess(response);// middleware
          if (isDebug || window.HttpDebug) {
            self.httpLog('post', fetchUrl, body, response);
          }
          if (isFunction(webResolveResult)) {
            resolve(webResolveResult(response));
            return false;
          }
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
          resolve(new Response(false, '网络繁忙,请稍后重试'));
        });
    });
  }
  // 当拿到config成功
  async _onGetConfigSuccess(config) {
    const { isDebug, onGetHttpConfigSuccess } = this.configOption;
    if (isDebug) {
      console.log('获取远程config成功');
      console.log('config : ', config);
    }
    isFunction(onGetHttpConfigSuccess) && await onGetHttpConfigSuccess(config);
  }
  // 当拿到config失败
  async _onGetConfigFail() {
    const { isDebug, onGetHttpConfigFail } = this.configOption;
    if (isDebug) {
      console.log('获取远程config失败');
    }
    isFunction(onGetHttpConfigFail) && await onGetHttpConfigFail();
  }
}

exports.Response = Response;
export default Http;
