import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import NavBar from '@/helps/antdComponent/NavBar';
import { WhiteSpace } from '@/helps/styleComponent';
import { createMarkup } from '@/helps/help';
import styles from './AgreenDetail.css';

class AgreenDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      htmlText: '',
    };
  }
  async componentWillMount() {
    const type = this.TypeDefine.htmlTextType.agreen_page;
    const res = await this.helps.webHttp.get('/ddm/phone/api/getHtmlText', { type });
    const htmlText = res.isSuccess ? res.data.htmlText : '';
    this.setState({
      htmlText,
    });
  }
  render() {
    const { htmlText } = this.state;
    return (
      <div>
        <NavBar
          title="同意条款"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <WhiteSpace />
        <div className={styles.container} dangerouslySetInnerHTML={createMarkup(htmlText)}>
          {/* <div className="return_btn" >&lt;返回</div> */}
          
        </div>
      </div>
    );
  }
}

export default connect()(AgreenDetail);
