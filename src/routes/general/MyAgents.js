import React from 'react';
import { connect } from 'dva';
import styles from './MyAgents.css';
import BaseComponent from '../../helps/BaseComponent';
import { Table, NavBar } from '../../helps/antdComponent';
import { Title, WingBlank } from '../../helps/styleComponent';


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
    title: '总充值数',
    dataIndex: 'allRechargeCount',
  },
  {
    title: '今日的充值数',
    dataIndex: 'rechargeCountOfToday',
  },
  {
    title: '总提成金额',
    dataIndex: 'CommissionOfAll',
    render: (text) => {
      return parseFloat(text / 100);
    },
  },
  {
    title: '今日提成金额',
    dataIndex: 'CommissionOfToday',
    render: (text) => {
      return parseFloat(text / 100);
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
    const res = await this.helps.webHttp.get('/spreadApi/general/myUnderAgents');
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
          {`我的下级代理：${agentNumber}人　总充值：${allRechargeCount}元
          　今日充值：${rechargeCountOfToday}元　总提成：${CommissionOfAll}元　今日提成：${CommissionOfToday}元`}
        </WingBlank>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(MyAgents);
