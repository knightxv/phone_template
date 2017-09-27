import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import styles from './RankExplain.css';
import http from '../utils/http';
import { createMarkup } from '../utils/help';
import { htmlTextType } from '../utils/typeDefine';

// const htmlText = require('../page/rankExplain');

class RankExplain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlText: '',
    };
  }
  async componentWillMount() {
    const params = {
      type: htmlTextType.page_prizeExplain,
    };
    const res = await http.get('/ddm/phone/api/getHtmlText', params, { type: 'WEB2' });
    if (res.isSuccess) {
      const { htmlText } = res.data;
      this.setState({
        htmlText,
      });
    }
  }
  render() {
    const { htmlText } = this.state;
    return (
      <div >
        <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div>
        <div className={styles.container} dangerouslySetInnerHTML={createMarkup(htmlText)} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(RankExplain);
