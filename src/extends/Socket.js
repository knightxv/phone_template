import BaseSocket from '../base/manage/BaseSocket';

const EventType = {
  ReLoadAgentInfo: 'reload.getUserInfo',
};

class Socket extends BaseSocket {
  EventType = EventType;
}

// export default new Socket('ws://120.77.87.4:8081/websocket');

export default {
  EventType,
  sendMsg() {
    console.log('socket function debug');
  },
  on() {

  },
};
