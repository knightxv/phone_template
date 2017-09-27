import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import BootStrapTable from '../components/Table';
import http from '../utils/http';
import styles from './AgencyMoneyRecord.css';
import { FlexRow, Flex, BaseFont } from '../utils/styleComponent';
import { Toast, Title } from '../utils/help';

const columns = [
  {
    key: 'agentName',
    title: '代理名称',
    isKey: true,
  },
  {
    key: 'rechargeCount',
    title: '充值数量',
  },
  {
    key: 'chargeMoney',
    title: '金额',
    dataFormat: (cell) => {
      const timeVal = cell;
      return parseFloat(timeVal / 100);
    },
  },
  {
    key: 'rechargeTime',
    title: '充值时间',
    dataFormat: (cell) => {
      if (isNaN(cell)) {
        return cell;
      }
      const resolveTime = new Date(cell);
      return resolveTime.format('yyyy/MM/dd');
    },
  },
];

class AgencyMoneyRecord extends React.Component {
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
    const res = await http.get('/spreadApi/underAgentsChargeLog');
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
        <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div>
        <BootStrapTable
          data={tableData}
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
