import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import NavBar from '@/helps/antdComponent/NavBar';
// -- import ListViewTable from '@/helps/antdComponent/ListView';
// import DatePicker from '@/helps/antdComponent/DatePicker';
// import SelectPicker from '@/helps/antdComponent/SelectPicker';
import { DatePicker, SelectPicker } from '@/helps/antdComponent/index.js';
import { Title, FlexRowBetweenWingSpace, IconImg } from '@/helps/styleComponent';
import styles from './CashMoneyRecord.less';

const PayType = [
  { value: '', label: '全部' },
  { value: 0, label: '买钻石给玩家' },
  { value: 1, label: '购买钻石' },
  { value: 2, label: '下级代理返钻' },
  { value: 3, label: '系统调整' },
  { value: 4, label: '月销钻排行奖励' },
  { value: 5, label: '提现' },
];

class CashMoneyRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectTime: null,
      selectType: [''],
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
  renderHeader = () => {
    const { tableData, selectTime } = this.state;
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
    const transPayMoney = Math.abs(this.parseFloatMoney(PayMoney));
    const transIncome = this.parseFloatMoney(income);
    return (<FlexRowBetweenWingSpace className={styles.headerWrap}>
      <div>
        <p>{selectTime ? selectTime.format('YYYY年MM月') : new Date().format('yyyy年MM月') }</p>
        <p>{`支出余额￥${transPayMoney}  收入￥${transIncome}`}</p>
      </div>
      {
        <DatePicker
          mode="month"
          title="选择日期"
          value={selectTime}
          onChange={this.selectDateTime}
        >
          <IconImg
            className={styles.riliIcon}
            src={require('../../assets/rili.png')}
          />
        </DatePicker>
      }
    </FlexRowBetweenWingSpace>);
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
    return (<FlexRowBetweenWingSpace className={styles.itemWrap} key={rowData.tranTime}>
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
    const { tableData, selectType } = this.state;
    return (
      <div className={styles.container}>
        <Title>余额交易明细</Title>
        <NavBar
          title="余额交易明细"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<SelectPicker
            value={selectType}
            title="选择交易类型"
            data={PayType}
            cols={1}
            onChange={this.selectTypeChange}
          >
            <WrapDiv>筛选</WrapDiv>
          </SelectPicker>}
        />
        {
          this.renderHeader()
        }
        {
          tableData.map(item => this.renderRow(item))
        }
      </div>
    );
  }
}

// 防止extra放在div报警告
const WrapDiv = ({ children, extra, ...props }) => {
  return (<div {...props}>{children}</div>);
};

// const renderHeader = ({ tableData, selectTime }, self) => {
//   const PayMoney = tableData.reduce((before, current) => {
//     if (current.TranAmount < 0) {
//       return before + (+current.TranAmount);
//     }
//     return before;
//   }, 0);
//   const income = tableData.reduce((before, current) => {
//     if (current.TranAmount > 0) {
//       return before + (+current.TranAmount);
//     }
//     return before;
//   }, 0);
//   const transPayMoney = Math.abs(self.parseFloatMoney(PayMoney));
//   const transIncome = self.parseFloatMoney(income);
//   return (<FlexRowBetweenWingSpace className={styles.headerWrap}>
//     <div>
//       <p>{selectTime ? selectTime.format('YYYY年MM月') : new Date().format('yyyy年MM月') }</p>
//       <p>{`支出余额￥${transPayMoney}  收入￥${transIncome}`}</p>
//     </div>
//     <DatePicker
//       mode="month"
//       title="选择日期"
//       value={selectTime}
//       onChange={self.selectDateTime}
//     >
//       <IconImg
//         className={styles.riliIcon}
//         src={require('../../assets/rili.png')}
//       />
//     </DatePicker>
//   </FlexRowBetweenWingSpace>);
// };

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(CashMoneyRecord);
