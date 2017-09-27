import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import BootStrapTable from '../components/Table';
import http from '../utils/http';
import styles from './AgencyExtractMoneyRecord.css';
// import { FlexRow, BaseFont } from '../utils/styleComponent';
import { Toast, Title } from '../utils/help';

const statusMap = {
  0: '审核中',
  1: '审核成功',
  2: '已拒绝',
};

const columns = [
  {
    key: 'cashCount',
    title: '提现金额',
  },
  {
    key: 'result',
    title: '审核状态',
    dataFormat: (cell) => {
      const statusVal = cell;
      return statusMap[statusVal];
    },
  },
  {
    key: 'createTime',
    isKey: true,
    title: '申请提现时间',
    dataFormat: (cell) => {
      if (!isNaN(cell)) {
        const resolveTime = new Date(cell);
        return resolveTime.format('yyyy/MM/dd');
      }
      return cell;
    },
  },
];
class AgencyExtractMoneyRecord extends React.Component {
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
    const res = await http.get('/spreadApi/cashRecord');
    if (res.isSuccess) {
      this.tableData = res.data;
    } else {
      Toast.info(res.message || '请求错误');
    }
    this.setState({
      isLoaded: true,
    });
  }
  render() {
    // const { isLoaded } = this.state;
    const tableData = this.tableData;
    // this.tableData = [
    //   {
    //     cashCount: 12,
    //     result: 2,
    //     createTime: 'fdsfsd3232',
    //   },
    // ];
    // const tableData = [
    //   ...this.tableData,
    //   ...this.tableData,...this.tableData,...this.tableData,...this.tableData,...this.tableData,
    //   ...this.tableData,...this.tableData,...this.tableData,...this.tableData,...this.tableData,
    //   ...this.tableData,...this.tableData,...this.tableData,...this.tableData,...this.tableData,
    //   ...this.tableData,...this.tableData,...this.tableData,...this.tableData,...this.tableData,
    // ];
    return (
      <div className={styles.normal}>
        <Title>余额提现记录</Title>
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

export default connect(mapStateToProps)(AgencyExtractMoneyRecord);
