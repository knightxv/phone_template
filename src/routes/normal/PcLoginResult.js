import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
// import NavBar from '@/helps/antdComponent/NavBar';
import { Icon } from '@/helps/antdComponent/index.js';
import { Title } from '@/helps/styleComponent';
import styles from './PayFail.less';

class PcLoginResult extends BaseComponent {
  // async componentWillMount() {

  // }
  confim = () => {
    window.opener = null;
    window.close();
  }
  render() {
    const { result } = this.router.getQuery();
    const isSuccess = result == 0;
    return (
      <div className={styles.container}>
        <Title>登录状态</Title>
        <div className={styles.payresultContainer}>
          {
            isSuccess ?
            (<div className={styles.payInfo}>
              <Icon type="check-circle" color="green" size="lg" />
              <div className={styles.payTip}>登录成功</div>
            </div>) :
            (<div className={styles.payInfo}>
              <Icon type="cross-circle-o" color="red" size="lg" />
              <div className={styles.payTip}>登录失败</div>
            </div>)
          }
          {/* <Button onClick={this.confim}>点击关闭</Button> */}
        </div>
      </div>
    );
  }
}

export default connect()(PcLoginResult);
