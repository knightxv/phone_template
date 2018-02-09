import { connect } from 'dva';
import React from 'react';
// import styles from './IndexPage.css';
import styled from 'styled-components';
import BaseComponent from '@/core/BaseComponent';
import { Title, WhiteSpace } from '@/components/styleComponent';
import NavBar from '@/components/antdComponent/NavBar';

class AgentNotice extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
    };
  }
  async componentWillMount() {
    // 获取首页额外数据
    const { agentNotice } = this.Enum.htmlTextType;
    const res = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', {
      type: agentNotice,
    });
    if (res.isSuccess) {
      // const { rankTipVisible, noticeVisible, noticeInfo } = res.data;
      this.setState({
        notice: res.data.htmlText,
      });
    }
  }
  goRegister = () => {
    const { pCode, redirect } = this.router.getQuery();
    if (pCode) {
      this.router.go(redirect, {
        pCode,
      });
    } else {
      this.router.go(redirect);
    }
  }
  render() {
    const { notice } = this.state;
    const noticeHtml = this.helps.createMarkup(notice);
    return (
      <div>
        <Title>代理须知</Title>
        <NavBar
          title="代理须知"
          onClick={this.router.back}
          right={<AreenBtn onClick={this.goRegister}>
            同意
          </AreenBtn>}
        />
        <WhiteSpace />
        <div style={{ padding: '.2rem', background: '#fff' }}>
          <div dangerouslySetInnerHTML={noticeHtml} style={{ wordWrap: 'break-word', wordBreak: 'break-all' }} />
        </div>
      </div>
    );
  }
}

const AreenBtn = styled.div`
  color: #fff;
  padding: .06rem .25rem;
  border: 1px solid #fff;
  border-radius: .1rem;
`;

AgentNotice.propTypes = {
};

export default connect()(AgentNotice);
