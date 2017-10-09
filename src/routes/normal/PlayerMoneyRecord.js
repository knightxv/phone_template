import React from 'react';
import { connect } from 'dva';

import { Table, NavBar } from '@/helps/antdComponent';
import { Title } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './PlayerMoneyRecord.css';
// import { Toast, Title } from '../utils/help';

const columns = [
  {
    dataIndex: 'heroID',
    title: '玩家ID',
    isKey: true,
  },
  {
    dataIndex: 'diamond',
    title: '充钻数量/个',
  },
  {
    dataIndex: 'timeTick',
    title: '充值时间',
    render: (text) => {
      if (isNaN(text)) {
        return text;
      }
      const resolveTime = new Date(text);
      return resolveTime.format('yyyy/MM/dd');
    },
  },
];

class PlayerMoneyRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
    this.tableData = [];
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/rechargeRecordOfMenber');
    if (res.isSuccess) {
      this.tableData = res.data;
    }
    this.setState({
      isLoaded: true,
    });
  }
  render() {
    const tableData = this.tableData;
    const sortTableData = tableData.sort((item1, item2) => {
      return item2.timeTick - item1.timeTick;
    });
    return (
      <div className={styles.normal}>
        <Title>会员充值记录</Title>
        <NavBar
          title="会员充值记录"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <Table
          dataSource={sortTableData}
          columns={columns}
        />
      </div>
    );
  }

}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(PlayerMoneyRecord);
