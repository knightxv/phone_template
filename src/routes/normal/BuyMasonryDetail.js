import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/helps/BaseComponent';
import NavBar from '@/helps/antdComponent/NavBar';
import ListView, { DataSource } from '@/helps/antdComponent/ListView';
import { Title, FlexRowBetweenWingSpace } from '@/helps/styleComponent';
import styles from './BuyMasonryDetail.css';


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
    const getSectionData = (dataBlob, sectionId) => {
      return dataBlob[sectionId];
    };
    const getRowData = (dataBlob, sectionId, rowId) => {
      return dataBlob[`${sectionId}:${rowId}`];
    };
    const ds = new DataSource({
      getSectionData,
      getRowData,
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
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
        <p className={styles.chargeLabel}>购进{rowData.chargeCount}个钻石</p>
        <p className={styles.chargeTime}>{ new Date(+rowData.chargeTime).format('yyyy-MM-dd hh:mm')}</p>
      </div>
      <p className={styles.chargeMoney}>
        -{this.helps.parseFloatMoney(rowData.chargeMoney)}
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
    await this.getDetailData();
  }
  getDetailData = async () => {
    const page = this.page;
    const size = this.size;
    const res = await this.http.webHttp.get('/spreadApi/diamondsDetail', { page, size });
    // chargeTime: 1508480231603, // 购买的时间  chargeCount: 300, // 购买的数量`
    if (res.isSuccess) {
      this.page ++;
      const temData = {};
      if (res.data.length === 0) {
        return;
      }
      if (res.data.length < this.size) {
        this.dataLoadOver = true;
      }
      res.data.forEach((data) => {
        const monthValue = new Date(+data.chargeTime).format('yyyyMM');
        if (!temData[monthValue]) {
          temData[monthValue] = [];
        }
        temData[monthValue].push(data);
      });
      for(let attr in temData) {
        const index = this.data.findIndex((monthData) => {
          return monthData.monthValue === attr;
        });
        if (index > -1) {
          this.data[index].data = [...this.data[index].data, ...temData[attr]];
        } else {
          this.data.push({
            monthLabel: new Date(+temData[attr][0].chargeTime).format('yyyy年MM月'),
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
  onEndReached = async () => {
    if (this.dataLoadOver) {
      this.message.info('没有更多数据');
      return;
    }
    await this.getDetailData();
  }
  render() {
    return (
      <div className={styles.container}>
        <Title>购钻明细</Title>
        <NavBar
          title="购钻明细"
          onClick={this.router.back}
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
