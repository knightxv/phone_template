import React from 'react';
import { connect } from 'dva';
import BaseComponent from '@/helps/BaseComponent';
import { Table } from '@/helps/antdComponent';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title } from '@/helps/styleComponent';
import styles from './CommissionRecord.css';

const columns = [
  {
    title: '代理名',
    dataIndex: 'agentName',
  },
  {
    title: '代理邀请码',
    dataIndex: 'agentCode',
  },
  {
    title: '提成金额/元',
    dataIndex: 'commissionCount',
    render: (text) => {
      return parseFloat(text / 100).toFixed(2);
    },
  },
  {
    title: '代理充值时间',
    dataIndex: 'agentRechargeTime',
    render(text) {
      if (!isNaN(text)) {
        const resolveTime = new Date(text);
        return resolveTime.format('yyyy/MM/dd');
      }
    },
  },
];


class CommissionRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/general/commissionRecord');
    if (res.isSuccess) {
      this.setState({
        tableData: res.data,
      });
    }
  }
  render() {
    const { tableData } = this.state;
    const sortTableData = tableData.sort((item1, item2) => {
      return item2.agentRechargeTime - item1.agentRechargeTime;
    });
    return (
      <div>
        <Title>提成记录</Title>
        <NavBar
          title="提成记录"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
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

export default connect(mapStateToProps)(CommissionRecord);
