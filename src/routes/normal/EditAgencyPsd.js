import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import BaseComponent from '@/core/BaseComponent';
import { InputItem, Button, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './EditAgencyPsd.less';

class EditPsd extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      editLoading: false,
      oldPsd: '',
      newPsd: '',
      rePsd: '',
    };
  }
  // 修改新密码
  editPsd = async () => {
    const { oldPsd, newPsd, rePsd } = this.state;
    if (!oldPsd || !newPsd || !rePsd) {
      this.message.info('请完善填写内容');
      return false;
    }
    if (newPsd !== rePsd) {
      this.message.info('两次密码不一致');
      return false;
    }
    const params = {
      oldPsd,
      newPsd,
    };
    const res = await this.http.webHttp.get('/spreadApi/editPassword', params);
    if (res.isSuccess) {
      this.router.back();
      this.message.info('修改成功');
    } else {
      this.message.info(res.info);
    }
  }
  render() {
    const { editLoading, oldPsd, newPsd, rePsd } = this.state;
    return (
      <div className={styles.container}>
        <Title>修改密码</Title>
        <NavBar
          title="修改密码"
          onClick={this.router.back}
        />
        <div className={classnames(styles.blockContainer, styles.blockInputWrap)}>
          <div className={styles.inputContainer}>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                value={oldPsd}
                type="password"
                onChange={value => this.setState({ oldPsd: value })}
                placeholder="请输入旧密码"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                type="password"
                value={newPsd}
                onChange={value => this.setState({ newPsd: value })}
                placeholder="请输入新密码"
              />
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                clear
                type="password"
                value={rePsd}
                onChange={value => this.setState({ rePsd: value })}
                placeholder="确认新密码"
              />
            </div>
            <div className={styles.btnWrap}>
              <Button
                loading={editLoading}
                onClick={this.editPsd}
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(EditPsd);
