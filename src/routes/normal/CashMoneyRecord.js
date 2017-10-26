import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { NavBar, ListViewTable, DatePicker, SelectPicker } from '@/helps/antdComponent';
import { Title, FlexRowBetweenWingSpace, IconImg } from '@/helps/styleComponent';
import styles from './CashMoneyRecord.css';

const PayType = [
  { value: '', label: '全部' },
  { value: 0, label: '玩家购钻' },
  { value: 1, label: '代理购钻' },
  { value: 2, label: '代理反钻' },
  { value: 3, label: '系统调整' },
  { value: 4, label: '邀请奖励' },
  { value: 5, label: '提现' },
];

class CashMoneyRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectTime: null,
      selectType: [''],
      selectTypeVisible: false, // 选择类型的组件是否显示
      timePickerVisible: false, // 日期选择组件
      tableData: [],
      isLoaded: false,
      pageIndex: 0,
    };
    this.serchInput = null;
  }
  async componentWillMount() {
    this.getDetailInfo(this.state.selectType[0]);
  }
  // 拿到数据
  getDetailInfo = async () => {
    const { selectTime, selectType } = this.state;
    const type = selectType[0];
    const res = await this.helps.webHttp.get('/spreadApi/getBalanceRecord',
      {
        monthTime: selectTime ? selectTime.valueOf() : new Date().getTime(),
        type,
      },
    );
    if (res.isSuccess) {
      this.setState({
        tableData: res.data,
      });
    } else {
      this.helps.toast(res.info || '请求错误');
    }
  }
  // 选择日期
  selectDateTime = (selectTime) => {
    this.setState({
      selectTime,
    }, () => {
      this.getDetailInfo();
    });
  }
  // 选择交易类型
  selectTypeChange = (val) => {
    this.setState({
      selectType: val,
    }, () => {
      this.getDetailInfo();
    });
  }
  renderRow = (rowData) => {
    return (<FlexRowBetweenWingSpace className={styles.itemWrap}>
      <div>
        <p className={styles.rowTitle}>{rowData.title || '系统调整'}</p>
        <p className={styles.rowTime}>{new Date(rowData.tranTime).format('yyyy-MM-dd hh:mm')}</p>
      </div>
      <div>
        {
          rowData.TranAmount >= 0
          ? (<div className="countAdd">+{this.parseFloatMoney(rowData.TranAmount)}元</div>)
          : (<div className="countSub">{this.parseFloatMoney(rowData.TranAmount)}元</div>)
        }
      </div>
    </FlexRowBetweenWingSpace>);
  }
  render() {
    const { tableData, selectType, selectTypeVisible, timePickerVisible, selectTime } = this.state;
    return (
      <div className={styles.container}>
        <Title>余额交易明细</Title>
        <NavBar
          title="余额交易明细"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={() => this.setState({ selectTypeVisible: true })}>筛选</div>}
        />
        <DatePicker
          visible={timePickerVisible}
          mode="month"
          title="选择日期"
          value={selectTime}
          onChange={this.selectDateTime}
          onOk={() => this.setState({ timePickerVisible: false })}
          onDismiss={() => this.setState({ timePickerVisible: false })}
        />
        <SelectPicker
          visible={selectTypeVisible}
          value={selectType}
          title="选择交易类型"
          data={PayType}
          cols={1}
          onChange={this.selectTypeChange}
          onOk={() => this.setState({ selectTypeVisible: false })}
          onDismiss={() => this.setState({ selectTypeVisible: false })}
        />
        <ListViewTable
          tableData={tableData}
          renderRow={this.renderRow}
          renderHeader={() => renderHeader(this.state, this)}
        />
      </div>
    );
  }
}

const renderHeader = ({ tableData, selectTime }, self) => {
  const PayMoney = tableData.reduce((before, current) => {
    if (current.TranAmount < 0) {
      return before + (+current.TranAmount);
    }
    return before;
  }, 0);
  const income = tableData.reduce((before, current) => {
    if (current.TranAmount > 0) {
      return before + (+current.TranAmount);
    }
    return before;
  }, 0);
  const transPayMoney = self.parseFloatMoney(PayMoney);
  const transIncome = self.parseFloatMoney(income);
  return (<FlexRowBetweenWingSpace className={styles.headerWrap}>
    <div>
      <p>{selectTime ? selectTime.format('YYYY年MM月') : new Date().format('yyyy年MM月') }</p>
      <p>{`支出余额￥${transPayMoney}  收入￥${transIncome}`}</p>
    </div>
    <div>
      <IconImg
        onClick={() => self.setState({ timePickerVisible: true })}
        className={styles.riliIcon}
        src={require('../../assets/rili.png')}
      />
    </div>
  </FlexRowBetweenWingSpace>);
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(CashMoneyRecord);
