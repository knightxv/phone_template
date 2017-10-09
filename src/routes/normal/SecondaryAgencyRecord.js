import React from 'react';
import { connect } from 'dva';

import { NavBar, Table } from '@/helps/antdComponent';
import { Title, WingBlank } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
// import { FlexRow, Flex, BaseFont } from '../utils/styleComponent';
import styles from './SecondaryAgencyRecord.css';

const columns = [
  {
    dataIndex: 'underAgentName',
    title: '下级代理名称',
  },
  {
    dataIndex: 'agentInviteCode',
    title: '代理邀请码',
  },
  {
    dataIndex: 'allRechargeCount',
    title: '总充钻石数',
  },
  {
    dataIndex: 'rechargeCountOfToday',
    title: '今日的充钻石数',
  },
  {
    dataIndex: 'CommissionOfAll',
    title: '总提成钻石石',
  },
  {
    dataIndex: 'CommissionOfToday',
    title: '今日提成钻石数',
  },
];

class SecondaryAgencyRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      tableData: [],
    };
    this.serchInput = null;
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/myUnderAgents');
    if (res.isSuccess) {
      this.setState({
        tableData: res.data,
      });
    }
  }
  render() {
    const { tableData } = this.state;
    const agentNumber = tableData.length;
    const allRechargeCount = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.allRechargeCount;
    }, 0);
    const allRechargeCountFloat = parseFloat(allRechargeCount / 100).toFixed(2);

    const rechargeCountOfToday = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.rechargeCountOfToday;
    }, 0);
    const rechargeCountOfTodayFloat = parseFloat(rechargeCountOfToday / 100).toFixed(2);

    const CommissionOfAll = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.CommissionOfAll;
    }, 0);
    const CommissionOfAllFloat = parseFloat(CommissionOfAll / 100).toFixed(2);

    const CommissionOfToday = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.CommissionOfToday;
    }, 0);
    const CommissionOfTodayFloat = parseFloat(CommissionOfToday / 100).toFixed(2);
    return (
      <div className="background">
        <Title>我的下级代理</Title>
        <NavBar
          title="我的下级代理"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <Table
          dataSource={tableData}
          columns={columns}
        />
        <WingBlank style={{ textAlign: 'center', fontSize: 12 }}>
          {`我的下级代理：${agentNumber}人　总充值：${allRechargeCountFloat}元
          　今日充值：${rechargeCountOfTodayFloat}元　总提成：${CommissionOfAllFloat}元　今日提成：${CommissionOfTodayFloat}元`}
        </WingBlank>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SecondaryAgencyRecord);
