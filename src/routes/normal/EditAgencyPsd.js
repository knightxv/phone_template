import React from 'react';
import { connect } from 'dva';
import { WhiteSpace, WingBlank } from 'antd-mobile';
import { routerRedux } from 'dva/router';

import http from '../utils/http';
import { Toast, Title } from '../utils/help';
import styles from './EditAgencyPsd.css';
import { BackgroundContainer, FlexRow, BaseFont, TextInput, Button } from '../utils/styleComponent';

class EditAgencyPsd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPsd: '',
      password: '',
      rePsd: '',
    };
  }
  edit = async () => {
    const { password, rePsd, oldPsd } = this.state;
    if (password !== rePsd) {
      Toast.info('两次密码不一致');
      return false;
    }
    const params = {
      oldPsd,
      newPsd: password,
    };
    const res = await http.get('/spreadApi/editPassword', params);
    if (res.isSuccess) {
      this.props.dispatch(routerRedux.goBack());
      Toast.info('修改密码成功');
      return false;
    }
    Toast.info('修改密码失败');
  }
  render() {
    return (
      <BackgroundContainer>
        <Title>修改密码</Title>
        <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div>
        <WingBlank size="md">
          <div className="alignCenterContainer">
            <WhiteSpace size="md" />
            <FlexRow className={styles.inputContainer}>
              <BaseFont className={styles.inputLabel}>原密码　　</BaseFont>
              <TextInput
                onChange={val => this.setState({ oldPsd: val })}
                placeholder="请输入原密码"
                maxLength={16}
                type="password"
              />
            </FlexRow>
            <FlexRow className={styles.inputContainer}>
              <BaseFont className={styles.inputLabel}>密码　　　</BaseFont>
              <TextInput
                onChange={val => this.setState({ password: val })}
                placeholder="请输入新密码"
                maxLength={16}
                type="password"
              />
            </FlexRow>
            <FlexRow className={styles.inputContainer}>
              <BaseFont className={styles.inputLabel}>确认新密码</BaseFont>
              <TextInput
                onChange={val => this.setState({ rePsd: val })}
                placeholder="确认新密码"
                maxLength={16}
                type="password"
              />
            </FlexRow>
            <WhiteSpace size="lg" />
            <Button
              onClick={this.edit}
              maxLength={16}
            >确认</Button>
          </div>
        </WingBlank>
      </BackgroundContainer>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(EditAgencyPsd);
