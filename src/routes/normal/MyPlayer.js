import React from 'react';
import { connect } from 'dva';

import { NavBar, Table } from '@/helps/antdComponent';
import { Title, WingBlank } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
// import { FlexRow, Flex, BaseFont } from '../utils/styleComponent';
import styles from './MyPlayer.css';

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
    // const res = await this.helps.webHttp.get('/spreadApi/myUnderAgents');
    // if (res.isSuccess) {
    //   this.setState({
    //     tableData: res.data,
    //   });
    // }
  }
  render() {
    return (
      <div className="background">
        我的玩家
        {/* <Title>我的下级代理</Title>
        <NavBar
          title="我的下级代理"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <Table
          dataSource={tableData}
          columns={columns}
        /> */}
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SecondaryAgencyRecord);
