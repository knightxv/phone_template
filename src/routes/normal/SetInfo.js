import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';
import { Button, InputItem, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './Register.less';

class SetInfo extends BaseComponent {
  constructor(props) {
    super(props);
    const { userName } = this.props;
    this.state = {
      userName: userName || '',
    };
  }
  confimToSet = async () => {
    const { userName } = this.state;
    const res = await this.http.webHttp.get('/spreadApi/setUserInfo', { userName });
    if (res.isSuccess) {
      this.message.info(res.info || '修改成功');
      this.router.back();
    } else {
      this.message.info(res.info || '修改失败');
    }
  }
  render() {
    const { userName } = this.state;
    const btnDisabled = !userName;
    return (
      <div className={styles.container}>
        <Title>设置昵称</Title>
        <NavBar
          title="设置昵称"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                value={userName}
                onChange={value => this.setState({ userName: value })}
                placeholder="请输入您的昵称"
              />
            </div>
            <div className={styles.registerWrap}>
              <Button
                disabled={btnDisabled}
                onClick={this.confimToSet}
              >确定</Button>
            </div>
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

export default connect(mapStateToProps)(SetInfo);
