import React from 'react';
import { connect } from 'dva';

import styles from './EditPsd.css';
import BaseComponent from '../../helps/BaseComponent';
import { Input, Button, NavBar } from '../../helps/antdComponent';
import { Title, WingBlank, WhiteSpace, FlexRow } from '../../helps/styleComponent';

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
      this.helps.toast('请完善填写内容');
      return false;
    }
    if (newPsd !== rePsd) {
      this.helps.toast('两次密码不一致');
      return false;
    }
    const params = {
      oldPsd,
      newPsd,
    };
    const res = await this.helps.webHttp.get('/spreadApi/general/editPassword', params);
    if (res.isSuccess) {
      this.props.dispatch(this.helps.routerRedux.goBack());
      this.helps.toast('修改成功');
    } else {
      this.helps.toast(res.info);
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
            onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          />
          <WhiteSpace />
          <div className={styles.contentContainer}>
            <FlexRow className={styles.inputWrap}>
              <span className={styles.inputLabel}>原密码　　</span>
              <Input
                type="password"
                onChange={ev => this.setState({ oldPsd: ev.target.value })}
                placeholder="请输入原密码"
              />
            </FlexRow>
            <FlexRow className={styles.inputWrap}>
              <span className={styles.inputLabel}>新密码　　</span>
              <Input
                onChange={ev => this.setState({ newPsd: ev.target.value })}
                type="password"
                placeholder="请输入新密码"
              />
            </FlexRow>
            <FlexRow className={styles.inputWrap}>
              <span className={styles.inputLabel}>确认新密码</span>
              <Input
                placeholder="确认新密码"
                onPressEnter={this.editPsd}
                onChange={ev => this.setState({ rePsd: ev.target.value })}
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
