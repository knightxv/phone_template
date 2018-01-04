import Http from '@/helps/Http';
import Toast from '@/helps/antdComponent/Toast';


// set window.HttpDebug = true; t
const webHttpConfig = {
  // getConfigUrl: '/config',
  // httpConfigKey: 'JavaWebPublicServerUrl',
  isDebug: false,
  getFetchUrl() {
    return '';// http://120.77.87.4:8081 http://192.168.2.66:8081
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
      return new Response(true, res.info || res.Msg, res.data);
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