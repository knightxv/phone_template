import React from 'react';


// 项目基于此开发
// 引入extends
// 添加公用函数

export default class BaseComponent extends React.Component {
  setStateAsync = (state) => {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
}
