class BaseSocket {
  constructor(linkUrl) {
    this.socket = null;
    this.linkUrl = linkUrl;
    this.eventArr = []; // 监听的事件
    this.toDoList = []; // 当socket状态处于不可用状态（未初始化回去，待重连时，待办事件）
  }
  connect = () => {
    const linkUrl = this.linkUrl;
    this.socket = new WebSocket(linkUrl);
    // Connection opened
    this.socket.addEventListener('open', this._onOpen);
    this.socket.addEventListener('message', (event) => {
      console.log('Message from server', event.data);
      this.eventArr.some((eventInfo) => {
        if (eventInfo.eventName === event.data) {
          eventInfo.callBack();
          return true;
        }
        return false;
      });
    });
  }
  _onOpen = async () => {
    await this.onOpen();
    // 处理待办事件
    this.resolveToDoList();
    this.socket.removeEventListener('open', this._onOpen);
  }
  async onOpen() {
    console.log('rewrite onOpen on socket connect success');
  }
  // 处理待办事件
  resolveToDoList = () => {
    this.toDoList.forEach((cb) => {
      if (Object.prototype.toString.call(cb) === '[object Function]') {
        cb();
      }
    });
    this.toDoList = [];
  }
  // 重连
  reStartConnect() {
    this.connect();
  }
  // 发送消息(对外的接口,用debug来调试logger)
  sendMsg(msg) {
    if (this.socket) {
      const nowState = this.socket.readyState;
      if (nowState === this.socket.OPEN) {
        this.send(msg);
        return;
      }
      if (nowState === this.socket.CLOSING || nowState === this.socket.CLOSED) {
        this.reStartConnect();
      }
    }
    this.toDoList.push(() => {
      this.send(msg);
    });
  }
  send(msg) {
    if (!msg) {
      console.warn('must send a string message');
      return;
    }
    console.log(`socket send:${msg}`);
    this.socket && this.socket.send(msg);
  }
  on(eventName, callBack) {
    // 去重
    const isExit = this.eventArr.some((eventInfo) => {
      return eventInfo.eventName === eventName;
    });
    if (isExit) {
      return;
    }
    this.eventArr.push({
      eventName,
      callBack,
    });
  }
  off(eventName) {
    if (typeof eventName === 'undefined') {
      this.eventArr = [];
      return;
    }
    this.eventArr = this.eventArr.filter((eventInfo) => {
      return eventInfo.eventName !== eventName;
    });
  }
}

export default BaseSocket;
