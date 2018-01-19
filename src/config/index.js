
import defaultConfig from './config.default';
import localConfig from './config.local';
import prodConfig from './config.prod';

let appConfig = {};

if (process.env.NODE_ENV === 'development') {
  appConfig = Object.assign(defaultConfig, localConfig);
} else {
  appConfig = Object.assign(defaultConfig, prodConfig);
}

export default appConfig;
