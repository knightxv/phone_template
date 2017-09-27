import React from 'react';
import { connect } from 'dva';
import styles from './MyAgents.css';
import BaseComponent from '../../helps/BaseComponent';
import { Table, NavBar } from '../../helps/antdComponent';
import { Title } from '../../helps/styleComponent';


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
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(MyAgents);
