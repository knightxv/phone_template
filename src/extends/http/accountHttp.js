import Http from '@/helps/Http';
// import { httpDebug } from '@/config/index';
const webHttpConfig = {
  // getConfigUrl: '/config',
  // httpConfigKey: 'JavaWebPublicServerUrl',
  isDebug: false,
  getFetchUrl() {
    return 'http://112.74.51.58';
  },
  responseHandle(res) {
    console.log(res);
  },
  webResolveResult(res, Response) {
      console.log(res);
    // if (res.status === 'success') {
    //   return new Response(true, res.info || res.Msg, res.data);
    // } else {
    //   return new Response(false, res.info);
    // }
  }
};
export default new Http(webHttpConfig);
