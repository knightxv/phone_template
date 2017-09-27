import React from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { createMarkup } from '../utils/help';
import styles from './AgreenDetail.css';

const htmlText = require('../page/ageen');

function AgreenDetail() {
  return (
    <div className={styles.container} dangerouslySetInnerHTML={createMarkup(htmlText)}>
      {/* <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div> */}
      
    </div>
  );
}

export default connect()(AgreenDetail);
