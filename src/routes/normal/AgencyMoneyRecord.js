import React from 'react';
import { connect } from 'dva';

import BaseComponent from '../../helps/BaseComponent';
import { Table, NavBar } from '../../helps/antdComponent';
import { Title } from '../../helps/styleComponent';
import styles from './AgencyMoneyRecord.css';

const columns = [
  {
    dataIndex: 'agentName',
    title: '代理名称',
    isKey: true,
  },
  {
    dataIndex: 'rechargeCount',
    title: '充值数量',
  },
  {
    dataIndex: 'chargeMoney',
    title: '金额',
    render: (cell) => {
      const timeVal = cell;
      return parseFloat(timeVal / 100);
    },
  },
  {
    dataIndex: 'rechargeTime',
    title: '充值时间',
    render: (cell) => {
      if (isNaN(cell)) {
        return cell;
      }
      const resolveTime = new Date(cell);
      return resolveTime.format('yyyy/MM/dd');
    },
  },
];

class AgencyMoneyRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      pageIndex: 0,
    };
    this.tableData = [];
    this.serchInput = null;
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/underAgentsChargeLog');
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
    return (
      <div className={styles.normal}>
        <Title>充值记录</Title>
        <NavBar
          title="充值记录"
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

export default connect(mapStateToProps)(AgencyMoneyRecord);
