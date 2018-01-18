import React from 'react';
import { connect } from 'dva';

import { Button, InputItem } from '@/helps/antdComponent/index.js';
// import InputItem from '@/helps/antdComponent/InputItem';
import NavBar from '@/helps/antdComponent/NavBar';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './Register.less';

class SetUserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      rePwd: '',
    };
  }
  confimToSet = async () => {
    const { userName, password, rePwd } = this.state;
    if (password !== rePwd) {
      this.message.info('两次密码不一致');
      return;
    }
    const res = await this.http.webHttp.get('/spreadApi/setUserInfo', { userName, password });
    if (res.isSuccess) {
      this.router.go('/homePage');
    } else {
      this.message.toast(res.info || '设置失败');
    }
  }
  async componentWillMount() {
    
  }
  setStateAsync = (state) => {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
  render() {
    const { userName, password, rePwd } = this.state;
    return (
      <div className={styles.container}>
        <Title>设置账户信息</Title>
        <NavBar
          title="设置账户信息"
        />
        <div className={styles.contentContainer}>
          <div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                value={userName}
                onChange={value => this.setState({ userName: value })}
                placeholder="请输入您的姓名(必填)"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                type="password"
                value={password}
                onChange={value => this.setState({ password: value })}
                placeholder="请输入您的登录密码"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                type="password"
                value={rePwd}
                onChange={value => this.setState({ rePwd: value })}
                placeholder="请确认您的登录密码"
              />
            </div>
            <div className={styles.registerWrap}>
              <Button
                onClick={this.confimToSet}
              >确定</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// function mapStateToProps(state) {
//   return {
//     ...state.agent,
//   };
// }

export default connect()(SetUserInfo);
