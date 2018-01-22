import React from 'react';
import { connect } from 'dva';
import BaseComponent from '@/core/BaseComponent';

import styles from './CashRecord.css';
import NavBar from '@/components/antdComponent/NavBar';
import { Title } from '@/components/styleComponent';

import { Table } from '../../helps/antdComponent';

const statusMap = {
  0: '审核中',
  1: '审核成功',
  2: '已拒绝',
};

const columns = [
  {
    title: '审核状态', // // 0待审核 1已通过 2已拒绝
    dataIndex: 'result',
    render(text) {
      return statusMap[text];
    },
  },
  {
    title: '提现金额',
    dataIndex: 'cashCount',
    render: (text) => {
      return parseFloat(text / 100).toFixed(2);
    },
  },
  {
    title: '提取时间',
    dataIndex: 'createTime',
    render(text) {
      if (!isNaN(text)) {
        const resolveTime = new Date(text);
        return resolveTime.format('yyyy/MM/dd');
      }
      return text;
    },
  },
];

class CashRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }
  async componentWillMount() {
    const res = await this.http.webHttp.get('/spreadApi/general/cashRecord');
    if (res.isSuccess) {
      this.setState({
        tableData: res.data,
      });
    }
  }
  render() {
    const { tableData } = this.state;
    const sortTableData = tableData.sort((item1, item2) => {
      return item2.createTime - item1.createTime;
    });
    return (
      <div className="background">
        <Title>提现记录</Title>
        <NavBar
          title="提现记录"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <Table
            dataSource={sortTableData}
            columns={columns}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(CashRecord);
