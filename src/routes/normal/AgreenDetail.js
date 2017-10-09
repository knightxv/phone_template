import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { NavBar } from '@/helps/antdComponent';
import { WhiteSpace } from '@/helps/styleComponent';
import { createMarkup } from '@/helps/help';
import styles from './AgreenDetail.css';


const htmlText = require('@/page/ageen');

function AgreenDetail({ dispatch }) {
  return (
    <div>
      <NavBar
        title="同意条款"
        onClick={() => dispatch(routerRedux.goBack())}
      />
      <WhiteSpace />
      <div className={styles.container} dangerouslySetInnerHTML={createMarkup(htmlText)}>
        {/* <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div> */}
        
      </div>
    </div>
    
  );
}

export default connect()(AgreenDetail);
