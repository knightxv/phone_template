import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';
import NavBar from '@/components/antdComponent/NavBar';
import { Title, WhiteSpace } from '@/components/styleComponent';
import styles from './RankExplain.css';

// const htmlText = require('../page/rankExplain');

// const columns = [
//   {
//     dataIndex: 'rankInfo',
//     title: '排行',
//   },
//   {
//     dataIndex: 'prizeInfo',
//     title: '奖励金额/元',
//     // render: (cell) => {
//     //   const statusVal = cell;
//     //   return statusMap[statusVal];
//     // },
//   },
// ];

class RankExplain extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      htmlText: '',
      rankInfoArr: [],
    };
  }
  async componentWillMount() {
    const params = {
      type: this.TypeDefine.htmlTextType.page_prizeExplain,
    };
    // const rankInfoArr = [
    //   {
    //     rankInfo: '第一名',
    //     prizeInfo: '8888',
    //   },
    //   {
    //     rankInfo: '第二名',
    //     prizeInfo: '5888',
    //   },
    //   {
    //     rankInfo: '第三名',
    //     prizeInfo: '3888',
    //   },
    //   {
    //     rankInfo: '第四名',
    //     prizeInfo: '2888',
    //   },
    //   {
    //     rankInfo: '第五名',
    //     prizeInfo: '1888',
    //   },
    //   {
    //     rankInfo: '第六~十名',
    //     prizeInfo: '888',
    //   },
    // ];
    const res = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', params);
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
        <Title>排行奖励说明</Title>
        <NavBar
          title="排行奖励说明"
          onClick={this.router.back}
        />
        <WhiteSpace />
        <div className={styles.container}>
          <div
            className={styles.contentContainer}
            dangerouslySetInnerHTML={this.helps.createMarkup(htmlText)}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(RankExplain);
