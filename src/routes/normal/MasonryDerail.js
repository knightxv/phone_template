import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { NavBar, ListViewTable, DatePicker, SelectPicker } from '@/helps/antdComponent';
import { Title, FlexRowBetweenWingSpace } from '@/helps/styleComponent';
import styles from './MasonryDetail.css';

const PayType = [
  { value: '', label: '全部' },
  { value: 0, label: '玩家购钻' },
  { value: 1, label: '代理购钻' },
  { value: 2, label: '代理反钻' },
  { value: 3, label: '系统调整' },
  { value: 4, label: '邀请奖励' },
  { value: 5, label: '提现' },
];

class MasonryDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectTime: new Date().getTime(),
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
  getDetailInfo = async (type) => {
    const { selectTime } = this.state;
    const res = await this.helps.webHttp.get('/spreadApi/getMasonryRecord',
      {
        monthTime: selectTime,
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
      selectTime: selectTime.valueOf(),
      selectTypeVisible: true,
    });
  }
  // 选择交易类型
  selectTypeChange = (val) => {
    this.getDetailInfo(val[0]);
    this.setState({
      selectType: val,
    });
  }
  renderRow = (rowData) => {
    return (<FlexRowBetweenWingSpace className={styles.itemWrap}>
      <div>
        <p>{rowData.title}</p>
        <p>{new Date(rowData.tranTime).format('yyyy-MM-dd hh:mm')}</p>
      </div>
      <div>
        {this.parseFloatMoney(rowData.TranAmount)}元
      </div>
    </FlexRowBetweenWingSpace>);
  }
  render() {
    const { tableData, selectType, selectTypeVisible, timePickerVisible } = this.state;
    return (
      <div className={styles.container}>
        <Title>钻石交易明细</Title>
        <NavBar
          title="钻石交易明细"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={() => this.setState({ timePickerVisible: true })}>筛选</div>}
        />
        <DatePicker
          visible={timePickerVisible}
          mode="month"
          title="选择日期"
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
      <p>{new Date(selectTime).format('yyyy年MM月')}</p>
      <p>{`支出余额￥${transPayMoney}  收入￥${transIncome}`}</p>
    </div>
    <div>
      icon
    </div>
  </FlexRowBetweenWingSpace>);
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(MasonryDetail);
