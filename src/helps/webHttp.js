import Http from './Http';
const webHttpConfig = {
  // getConfigUrl: '/config',
  // httpConfigKey: 'JavaWebPublicServerUrl',
  isDebug: false,
  getFetchUrl() {
    return '';
  },
  responseHandle(res) {
    if (res.status === 'failed' && res.code === 2) {
      Toast.info(res.info, 1, null, false);
      const hash = window.location.hash;
      if (/general\//.test(hash)) {
        window.location.href = '#/general/login';
      } else {
        window.location.href = '#/login';
      }
    }
  },
  webResolveResult(res, Response) {
    if (res.status === 'success') {
      return new Response(true, res.Msg, res.data);
    } else {
      return new Response(false, res.info);
    }
  },
  resolveConfig(config) {
    const url = config[webHttpConfig.httpConfigKey];
    if (/^http:\/\//.test(url)) {
      return config;
    }
    const resolveUrl = `http://${url}`;
    const httpConfig = {
      ...config,
      [webHttpConfig.httpConfigKey]: resolveUrl,
    };
    window.httpConfig = httpConfig;
    return httpConfig;
  },
};
export default new Http(webHttpConfig);