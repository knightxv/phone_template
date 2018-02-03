import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';
// import NavBar from '@/components/antdComponent/NavBar';
import { ListViewTable, NavBar } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
import styles from './CashChangeRecord.less';

class CashChangeRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      isLoaded: false,
      pageIndex: 0,
    };
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/cashRecord');
    // id: 343, // 编号
    // createTime: 1504527287992, //提取时间（时间戳）
    // cashType: 0, // 提现类型 0 :微信 1：支付宝
    // cashCount: 34, // 提现金额
    // result: 0, // 0待审核 1已通过 2已拒绝
    if (res.isSuccess) {
      this.setState({
        tableData: res.data || [],
      });
    }
  }
  renderRow = (rowData) => {
    const timeLabel = new Date(rowData.createTime).format('yyyy-MM-dd hh:mm');
    const cashCount = this.parseFloatMoney(rowData.cashCount);
    const resultMap = {
      0: '待审核',
      1: '已通过 ',
      2: '已拒绝',
    };
    const statuLabel = resultMap[rowData.result];
    return (<div className={styles.itemWrap}>
      <div>
        <div>余额-转出银行卡</div>
        <div className={styles.timeLabel}>{ timeLabel }</div>
      </div>
      <div className={`${styles.orderStatuWrap} ${rowData.result === 2 ? styles.fail : styles.success}`}>
        <span>{ cashCount }</span>
        <span className={styles.fkh}>（</span>
        <span>{ statuLabel }</span>
        <span className={styles.fkh}>）</span>
      </div>
    </div>);
  }
  render() {
    const { tableData } = this.state;
    return (
      <div className={styles.container}>
        <Title>提现记录</Title>
        <NavBar
          title="提现记录"
          onClick={this.router.back}
        />
        <ListViewTable
          tableData={tableData}
          renderRow={this.renderRow}
          className={styles.tableContainer}
        />
      </div>
    );
  }
}


function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(CashChangeRecord);
