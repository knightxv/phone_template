import { Toast } from 'antd-mobile';

export default {
  info(message) {
    Toast.info(message, 1, null, false);
  },
}
