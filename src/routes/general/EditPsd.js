import React from 'react';
import { connect } from 'dva';

import styles from './EditPsd.css';
import BaseComponent from '@/core/BaseComponent';
import InputItem from '@/components/antdComponent/InputItem';
import Button from '@/components/antdComponent/Button';
import NavBar from '@/components/antdComponent/NavBar';
import { Title, WhiteSpace, FlexRow } from '@/components/styleComponent';

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
    const res = await this.http.webHttp.get('/spreadApi/general/editPassword', params);
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
      <div>
        <Title>修改密码</Title>
        <div>
          <NavBar
            title="修改密码"
            onClick={this.router.back}
          />
          <WhiteSpace />
          <div className={styles.contentContainer}>
            <FlexRow className={styles.inputWrap}>
              <span className={styles.inputLabel}>原密码　　</span>
              <InputItem
                type="password"
                onChange={value => this.setState({ oldPsd: value })}
                placeholder="请输入原密码"
              />
            </FlexRow>
            <FlexRow className={styles.inputWrap}>
              <span className={styles.inputLabel}>新密码　　</span>
              <InputItem
                onChange={value => this.setState({ newPsd: value })}
                type="password"
                placeholder="请输入新密码"
              />
            </FlexRow>
            <FlexRow className={styles.inputWrap}>
              <span className={styles.inputLabel}>确认新密码</span>
              <InputItem
                placeholder="确认新密码"
                onChange={value => this.setState({ rePsd: value })}
                type="password"
              />
            </FlexRow>
            <WhiteSpace />
            <Button className={styles.editBtn} loading={editLoading} onClick={this.editPsd}>修改</Button>
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
