import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { Table, NavBar } from '@/helps/antdComponent';
import { Title } from '@/helps/styleComponent';
import styles from './CashMoney.css';

const statusMap = {
  0: '审核中',
  1: '审核成功',
  2: '已拒绝',
};

const columns = [
  {
    dataIndex: 'cashCount',
    title: '提现金额',
    render(text) {
      return parseFloat(text / 100).toFixed(2);
    },
  },
  {
    dataIndex: 'result',
    title: '审核状态',
    render: (cell) => {
      const statusVal = cell;
      return statusMap[statusVal];
    },
  },
  {
    dataIndex: 'createTime',
    title: '申请提现时间',
    render: (cell) => {
      if (!isNaN(cell)) {
        const resolveTime = new Date(cell);
        return resolveTime.format('yyyy/MM/dd');
      }
      return cell;
    },
  },
];
class AgencyExtractMoneyRecord extends BaseComponent {
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
    const res = await this.helps.webHttp.get('/spreadApi/cashRecord');
    if (res.isSuccess) {
      this.tableData = res.data;
    } else {
      this.helps.toast(res.info || '请求错误');
    }
    this.setState({
      isLoaded: true,
    });
  }
  render() {
    const tableData = this.tableData;
    return (
      <div>
        <Title>余额提现记录</Title>
        <NavBar
          title="余额提现记录"
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

export default connect(mapStateToProps)(AgencyExtractMoneyRecord);
