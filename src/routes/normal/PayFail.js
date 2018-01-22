import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';
import { Button, Icon, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './PayFail.less';

class PayFail extends BaseComponent {
  // async componentWillMount() {

  // }
  
  render() {
    return (
      <div className={styles.container}>
        <Title>订单状态</Title>
        <NavBar
          title="订单状态"
        />
        <div className={styles.payresultContainer}>
          <div className={styles.payInfo}>
            <Icon type="cross-circle-o" color="red" size="lg" />
            <div className={styles.payTip}>支付失败</div>
          </div>
          <Button onClick={() => this.router.go('/homePage')}>完成</Button>
        </div>
      </div>
    );
  }
}

export default connect()(PayFail);
