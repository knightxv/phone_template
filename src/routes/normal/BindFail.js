import React from 'react';
import { connect } from 'dva';

import { Button, Icon } from '@/helps/antdComponent/index.js';

import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './BindFail.less';

class BindFail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  async componentWillMount() {

  }
  render() {
    return (
      <div className={styles.container}>
        <Title>绑定详情</Title>
        <div className={styles.contentContainer}>
          <Icon type="cross-circle-o" color="red" size="lg" />
          <div className={styles.failLabel}>账号绑定失败</div>
          <div className={styles.failTip}>账号已创建后暂不支持重新绑定邀请码</div>
          <Button onClick={() => this.router.go('/homePage')}>直接登录</Button>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(BindFail);
