import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';
import NavBar from '@/components/antdComponent/NavBar';
import { WhiteSpace } from '@/components/styleComponent';
import styles from './AgreenDetail.css';

class AgreenDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      htmlText: '',
    };
  }
  async componentWillMount() {
    const type = this.Enum.htmlTextType.agreen_page;
    const res = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', { type });
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
          onClick={this.router.back}
        />
        <WhiteSpace />
        <div className={styles.container} dangerouslySetInnerHTML={this.helps.createMarkup(htmlText)}>
          {/* <div className="return_btn" >&lt;返回</div> */}
          
        </div>
      </div>
    );
  }
}

export default connect()(AgreenDetail);
