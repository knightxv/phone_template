import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { InputItem, Button } from '@/helps/antdComponent/index.js';
// import Button from '@/helps/antdComponent/Button';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title } from '@/helps/styleComponent';
import styles from './EditAgencyPsd.css';

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
  // 登录
  editPsd = async () => {
    console.log('登录');
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
    const { editLoading } = this.state;
    return (
      <div className={styles.container}>
        <Title>修改密码</Title>
        <NavBar
          title="修改密码"
          onClick={this.router.back}
        />
        <div>
          <div className={styles.inputContainer}>
            <div className={styles.inputWrap}>
              <InputItem
                type="password"
                onChange={value => this.setState({ oldPsd: value })}
                placeholder="如果包含字母，请注意区分大小写"
              >　原密码:</InputItem>
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                type="password"
                onChange={value => this.setState({ newPsd: value })}
                placeholder="输入新密码，请注意区分大小写"
              >　新密码:</InputItem>
            </div>
            <div className={styles.inputWrap}>
              <InputItem
                type="password"
                onChange={value => this.setState({ rePsd: value })}
                placeholder="再次输入新密码，确认输入无误"
              >确认密码:</InputItem>
            </div>
            <div className={styles.editBtnWrap}>
              <Button
                className={styles.editBtn}
                loading={editLoading}
                onClick={this.editPsd}
              >
                确认修改
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
