import { connect } from 'dva';
import React from 'react';
// import styles from './IndexPage.css';
import { Title, WhiteSpace } from '@/helps/styleComponent';
import { NavBar } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';

class NoticeDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
    };
  }
  async componentWillMount() {
    // 获取首页额外数据
    const params = { type: this.TypeDefine.htmlTextType.notice_normalAgency };
    const extraRes = await this.helps.webHttp.get('/ddm/phone/api/getHtmlText', params);
    if (extraRes.isSuccess) {
      // const { rankTipVisible, noticeVisible, noticeInfo } = res.data;
      this.setState({
        notice: extraRes.data.htmlText,
      });
    }
  }
  render() {
    const { notice } = this.state;
    const noticeHtml = this.helps.createMarkup(notice);
    return (
      <div>
        <Title>公告栏</Title>
        <NavBar
          title="公告栏"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <WhiteSpace />
        <div style={{ padding: '.2rem', background: '#fff' }}>
          <div dangerouslySetInnerHTML={noticeHtml} style={{ wordWrap: 'break-word', wordBreak: 'break-all' }} />
        </div>
      </div>
    );
  }
}

NoticeDetail.propTypes = {
};

export default connect()(NoticeDetail);
