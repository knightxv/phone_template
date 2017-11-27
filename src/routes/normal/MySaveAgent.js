import React from 'react';
import { connect } from 'dva';

import { NavBar, ListViewTable } from '@/helps/antdComponent';
import { Title, SearchBar } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
// import { FlexRow, Flex, BaseFont } from '../utils/styleComponent';
import styles from './MyUnderAgent.css';

class MySaveAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      isLoaded: false,
      searchVal: '',
    };
  }
  rechargeForAgent = (agentId) => {
    this.props.dispatch(this.helps.routerRedux.push({
      pathname: 'rechargeForAgent',
      query: {
        agentId,
      },
    }));
  }
  async componentWillMount() {
    const res = await this.helps.webHttp.get('/spreadApi/mySaveAgent');
    if (res.isSuccess) {
      this.setState({
        tableData: res.data,
      });
    }
  }
  // onEndReached = () => {
  //   console.log('滚动到某个位置');
  // }
  // 添加收藏
  navigateToSaveAgent = () => {
    this.props.dispatch(this.helps.routerRedux.push('/saveAgent'));
  }
  onSearchInputChange = (ev) => {
    this.setState({
      searchVal: ev.target.value,
    });
  }
  onCancelClick = () => {
    this.setState({
      searchVal: '',
    });
  }
  renderHeader = (columnsData) => { // dataIndex title
    return (
      <div className={styles.rowSection}>
        {
          columnsData.map(({ title, dataIndex, remark, i }) => (
            <div
              key={dataIndex + i}
              style={{
                width: `${100 / columnsData.length}%`,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#000',
              }}
            >
              <p>{ title }</p>
              <p>{ remark }</p>
            </div>
          ))
        }
      </div>
    );
  }
  powerArr = () => {
    const self = this;
    const columns = [
      {
        dataIndex: 'agentInviteCode',
        title: '代理ID',
      },
      {
        dataIndex: 'CommissionOfAll',
        title: '总提成钻石数',
        render(rowVal) {
          if (rowVal.CommissionOfAll >= 0) {
            return <div className="countAdd">{`+${rowVal.CommissionOfAll}`}</div>;
          }
          return <div className="countSub">{`-${rowVal.CommissionOfAll}`}</div>;
        },
      },
      {
        dataIndex: 'CommissionOfToday',
        title: '今日提成钻石数',
        render(rowVal) {
          if (rowVal.CommissionOfToday >= 0) {
            return <div className="countAdd">{`+${rowVal.CommissionOfToday}`}</div>;
          }
          return <div className="countSub">{`-${rowVal.CommissionOfToday}`}</div>;
        },
      },
    ];
    const hasPowerToRecharge = this.hasPower('iAgentGiveForAnyAgent') && this.hasPower('iAgentGiveForAgent');
    if (hasPowerToRecharge) {
      columns.push({
        title: '操作',
        render: (data) => {
          return (<div
            className={styles.rechargeBtn}
            onClick={() => self.rechargeForAgent(data.agentInviteCode)}
          >
          充值
          </div>);
        },
      });
    }
    return columns;
  }
  renderRowData = () => {
    return (
      <div style={{ margin: '0.5rem auto', textAlign: 'center' }}>
        您还没有代理哦~赶紧去<span onClick={this.navigateToSaveAgent} className="color_base">添加</span>
      </div>
    );
  }
  render() {
    const { tableData, searchVal } = this.state;
    const filterTableData = tableData.filter((data) => {
      return data.agentInviteCode.toString().indexOf(searchVal) !== -1;
    });
    // const allRechargeCount = tableData.reduce((beforeVal, currentVal) => {
    //   return beforeVal + currentVal.allRechargeCount;
    // }, 0);
    // const allRechargeCountRemark = this.parseFloatMoney(allRechargeCount);// 总充值

    // const rechargeCountOfToday = tableData.reduce((beforeVal, currentVal) => {
    //   return beforeVal + currentVal.rechargeCountOfToday;
    // }, 0);
    // const rechargeCountOfTodayFloat = parseFloat(rechargeCountOfToday / 100).toFixed(2); // 今日充值

    const CommissionOfAll = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.CommissionOfAll;
    }, 0);
    const CommissionOfToday = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.CommissionOfToday;
    }, 0);
    // 备注
    const agentNumberRemark = `(共${tableData.length}人)`; // 我的下级代理人数
    const CommissionOfAllRemark = `(共${CommissionOfAll}个)`; // 总提成

    const CommissionOfTodayRemark = `共(${CommissionOfToday}个)`; // 今日提成
    const columnsRemark = [agentNumberRemark, CommissionOfAllRemark, CommissionOfTodayRemark];
    const columns = this.powerArr();
    const columnsAddRemark = columns.map((item, i) => ({
      ...item,
      remark: columnsRemark[i],
    }));

    return (
      <div className={styles.container}>
        <Title>我收藏的代理</Title>
        <NavBar
          title="我收藏的代理"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<span onClick={this.navigateToSaveAgent}>添加</span>}
        />
        <SearchBar
          placeholder="请输入代理ID"
          maxLength={8}
          onChange={this.onSearchInputChange}
          value={searchVal}
          onCancelClick={this.onCancelClick}
        />
        {
          this.renderHeader(columns)
        }
        <ListViewTable
          tableData={filterTableData}
          columns={columnsAddRemark}
          ListEmptyComponent={this.renderRowData()}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(MySaveAgent);


/*
 renderHeader={() => <span>header</span>}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? 'Loading...' : 'Loaded'}
          </div>)}
          renderSectionHeader={sectionData => (
            <div>{`Task ${sectionData.split(' ')[1]}`}</div>
          )}
          className="fortest"
          style={{
            height: document.documentElement.clientHeight * 3 / 4,
            overflow: 'auto',
            border: '1px solid #ddd',
            margin: '0.1rem 0',
          }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          scrollEventThrottle={200}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
*/
