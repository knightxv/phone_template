import React from 'react';
import { connect } from 'dva';

import classnames from 'classnames';
import BaseComponent from '@/core/BaseComponent';
import { Button, InputItem, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './Register.less';

class SetUserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      rePwd: '',
    };
  }
  confimToSet = async () => {
    const { password, rePwd } = this.state;
    if (password !== rePwd) {
      this.message.info('两次密码不一致');
      return;
    }
    const res = await this.http.webHttp.get('/spreadApi/setUserInfo', { password });
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
    const { password, rePwd } = this.state;
    const btnDiasbled = !password || !rePwd;
    return (
      <div className={styles.container}>
        <Title>设置登录密码</Title>
        <NavBar
          title="设置登录密码"
        />
        <div className={styles.contentContainer}>
          <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
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
            <div className={styles.btnWrap}>
              <Button
                disabled={btnDiasbled}
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
