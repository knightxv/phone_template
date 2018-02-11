import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';

import { Button, Icon } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
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
          <div className={styles.contentWrap}>
            <Icon type="cross-circle-o" color="red" size="lg" />
            <div className={styles.failLabel}>账号绑定失败</div>
            <div className={styles.failTip}>账号已创建后暂不支持重新绑定邀请码</div>
            <Button onClick={() => this.router.go('/homePage')}>直接登录</Button>
          </div>
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
