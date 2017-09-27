import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import BootStrapTable from '../components/Table';
import http from '../utils/http';
import styles from './SecondaryAgencyRecord.css';
// import { FlexRow, Flex, BaseFont } from '../utils/styleComponent';
import { Toast, Title } from '../utils/help';

const columns = [
  {
    key: 'underAgentName',
    title: '下级代理名称',
  },
  {
    key: 'agentInviteCode',
    title: '代理邀请码',
    isKey: true,
  },
  {
    key: 'allRechargeCount',
    title: '总充钻石数',
  },
  {
    key: 'rechargeCountOfToday',
    title: '今日的充钻石数',
  },
  {
    key: 'CommissionOfAll',
    title: '总提成钻石石',
  },
  {
    key: 'CommissionOfToday',
    title: '今日提成钻石数',
  },
];

class SecondaryAgencyRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
    this.tableData = [];
    this.serchInput = null;
  }
  async componentWillMount() {
    const res = await http.get('/spreadApi/myUnderAgents');
    if (res.isSuccess) {
      this.tableData = res.data;
    }
    this.setState({
      isLoaded: true,
    });
  }
  render() {
    // const { isLoaded } = this.state;
    const tableData = this.tableData;
    const myUnderAgentsCount = tableData.length;
    const allRechargeCount = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.allRechargeCount;
    }, 0);
    const rechargeCountOfToday = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.rechargeCountOfToday;
    }, 0);
    const CommissionOfAll = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.CommissionOfAll;
    }, 0);
    const CommissionOfToday = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.CommissionOfToday;
    }, 0);
    return (
      <div className={styles.normal}>
        <Title>我的代理</Title>
        <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div>
        <BootStrapTable
          data={tableData}
          columns={columns}
        />
        <div className="textTip textAlign">
          {`下级代理：${myUnderAgentsCount}人　　总充钻：${allRechargeCount}钻　　今日充钻：${rechargeCountOfToday}钻　　总提成：${CommissionOfToday}钻　　今日提成：${CommissionOfAll}钻`}
        </div>
        <div className="redColor textTip textAlign">
          您可以推荐朋友成为代理，在官网申请代理时填写您的邀请码为上级介绍人，您即可获得该代理终身充值的10%的提成。
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SecondaryAgencyRecord);
