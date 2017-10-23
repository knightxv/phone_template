import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import { NavBar, ListView } from '@/helps/antdComponent';
import { Title, FlexRowBetweenWingSpace } from '@/helps/styleComponent';
import styles from './BuyMasonryDetail.css';

const getSectionData = (dataBlob, sectionId) => {
  return dataBlob[sectionId];
};
const getRowData = (dataBlob, sectionId, rowId) => {
  return dataBlob[`${sectionId}:${rowId}`];
};
const ds = new ListView.DataSource({
  getSectionData,
  getRowData,
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

const parseData = (classData, rowKey = 'data') => {
  const dataBlob = [];
  const sectionIds = [];
  const rowIds = [];
  let temArr = [];
  for (let i = 0; i < classData.length; i++) {
    sectionIds.push(i);
    dataBlob[i] = classData[i];
    temArr = classData[i][rowKey];
    rowIds[i] = [];

    if (temArr && temArr.length !== 0) {
        for (let j = 0; j < temArr.length; j ++) {
          rowIds[i].push(j);
          dataBlob[i + ':' + j] = temArr[j];
        }
    } else {
      // row没有数据时也要渲染
      rowIds[i].push(0);
      dataBlob[i + ':' + 0] = null;
    }
  }
  return [dataBlob, sectionIds, rowIds];
};


class AgencyPayType extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds,
    };
    this.data = [];
    this.page = 0;
    this.size = 15;
    this.dataLoadOver = false; // 数据是否加载完了
    // const now = new Date();
    // this.monthValueNow = now.format('yyyyMM');
    // const beforeMonth = now.setMonth(now.getMonth() - 1);
    // this.monthValueBefore = beforeMonth.format('yyyyMM');
  }
  renderRow = (rowData) => {
    if (!rowData) {
      return null;
    }
    return (<FlexRowBetweenWingSpace className={styles.detailItem}>
      <div>
        <p>购进{rowData.cashCount}个钻石</p>
        <p>{ new Date(+rowData.cashTime).format('yyyy-MM-dd hh:mm')}</p>
      </div>
      <p>
        -{parseFloat(rowData.cashCount / 10)}
      </p>
    </FlexRowBetweenWingSpace>);
  }
  renderSectionHeader = (sectionData) => {
    if (sectionData.data.length === 0) {
      return null;
    }
    return <div className={styles.monthLabel}>{sectionData.monthLabel}</div>;
  }
  async componentWillMount() {
    this.getDetailData();
  }
  getDetailData = async () => {
    this.page ++;
    const page = this.page;
    const size = this.size;
    const res = await this.helps.webHttp.get('/spreadApi/balanceRechargeRecord', { page, size });
    // cashTime: 1508480231603, // 购买的时间  cashCount: 300, // 购买的数量`
    
    if (res.isSuccess) {
      const temData = {};
      if (res.data.length === 0) {
        return;
      }
      if (res.data.length < this.size) {
        this.dataLoadOver = true;
      }
      res.data.forEach((data) => {
        const monthValue = new Date(+data.cashTime).format('yyyyMM');
        if (!temData[monthValue]) {
          temData[monthValue] = [];
        }
        temData[monthValue].push(data);
      });
      for (let attr in temData) {
        const index = this.data.findIndex((monthData) => {
          return monthData.monthValue === attr;
        });
        if (index > -1) {
          this.data[index].data = [...this.data[index].data, ...temData[attr]];
        } else {
          this.data.push({
            monthLabel: new Date(+temData[attr][0].cashTime).format('yyyy年MM月'),
            monthValue: attr,
            data: [...temData[attr]],
          });
        }
      }
      this.data.sort((item1, item2) => {
        return item2.monthValue - item1.monthValue;
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(...parseData(this.data)),
      });
    } else {
      this.helps.toast(res.info);
    }
  }
  // 到达底部
  onEndReached = () => {
    if (this.dataLoadOver) {
      this.helps.toast('没有更多数据');
      return;
    }
    this.getDetailData();
  }
  render() {
    return (
      <div className={styles.container}>
        <Title>购钻明细</Title>
        <NavBar
          title="购钻明细"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <ListView
          initialListSize={this.size}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          enableEmptySections
          pageSize={this.size}
          scrollRenderAheadDistance={500}
          scrollEventThrottle={200}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={15}
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(AgencyPayType);
