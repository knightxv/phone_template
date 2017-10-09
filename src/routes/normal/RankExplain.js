import React from 'react';
import { connect } from 'dva';

import { NavBar } from '@/helps/antdComponent';
import { Title } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './RankExplain.css';

// const htmlText = require('../page/rankExplain');

class RankExplain extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      htmlText: '',
    };
  }
  async componentWillMount() {
    const params = {
      type: this.TypeDefine.htmlTextType.page_prizeExplain,
    };
    const res = await this.helps.webHttp.get('/ddm/phone/api/getHtmlText', params);
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
      <div>
        <Title>奖励说明</Title>
        <NavBar
          title="奖励说明"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <div className={styles.container} dangerouslySetInnerHTML={this.helps.createMarkup(htmlText)} />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(RankExplain);
