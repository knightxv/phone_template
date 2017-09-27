import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import BootStrapTable from '../components/Table';
import http from '../utils/http';
import styles from './PlayerMoneyRecord.css';
// import { FlexRow, Flex, BaseFont, Button } from '../utils/styleComponent';
import { Toast, Title } from '../utils/help';

const columns = [
  {
    key: 'heroID',
    title: '玩家ID',
    isKey: true,
  },
  {
    key: 'diamond',
    title: '充钻数量/个',
  },
  {
    key: 'timeTick',
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

class PlayerMoneyRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
    this.tableData = [];
  }
  async componentWillMount() {
    const res = await http.get('/spreadApi/rechargeRecordOfMenber');
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
      return item2.timeTick - item1.timeTick
    });
    return (
      <div className={styles.normal}>
        <Title>会员充值记录</Title>
        <div className="return_btn" onClick={() => this.props.dispatch(routerRedux.goBack())}>&lt;返回</div>
        <BootStrapTable
          data={sortTableData}
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
