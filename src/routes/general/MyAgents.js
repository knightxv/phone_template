import React from 'react';
import { connect } from 'dva';

import { Table } from '../../helps/antdComponent';

import styles from './MyAgents.css';
import BaseComponent from '@/core/BaseComponent';
import NavBar from '@/components/antdComponent/NavBar';
import { Title, WingBlank } from '@/components/styleComponent';


const columns = [
  {
    title: '下级代理名称',
    dataIndex: 'underAgentName',
  },
  {
    title: '代理商邀请码',
    dataIndex: 'agentInviteCode',
  },
  {
    title: '总充值数/元',
    dataIndex: 'allRechargeCount',
    render(text) {
      return parseFloat(text / 100).toFixed(2);
    },
  },
  {
    title: '今日的充值数/元',
    dataIndex: 'rechargeCountOfToday',
    render(text) {
      return parseFloat(text / 100).toFixed(2);
    },
  },
  {
    title: '总提成金额/元',
    dataIndex: 'CommissionOfAll',
    render: (text) => {
      return parseFloat(text / 100).toFixed(2);
    },
  },
  {
    title: '今日提成金额/元',
    dataIndex: 'CommissionOfToday',
    render: (text) => {
      return parseFloat(text / 100).toFixed(2);
    },
  },
];

class MyAgents extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }
  async componentWillMount() {
    const res = await this.http.webHttp.get('/spreadApi/general/myUnderAgents');
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
      <div>
        <Title>我的下级代理</Title>
        <NavBar
          title="我的下级代理"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <Table
            dataSource={tableData}
            columns={columns}
          />
          <WingBlank style={{ textAlign: 'center', fontSize: 12 }}>
            {`我的下级代理：${agentNumber}人　总充值：${allRechargeCountFloat}元
            　今日充值：${rechargeCountOfTodayFloat}元　总提成：${CommissionOfAllFloat}元　今日提成：${CommissionOfTodayFloat}元`}
          </WingBlank>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(MyAgents);
