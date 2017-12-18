import React from 'react';
import { connect } from 'dva';

import NavBar from '@/helps/antdComponent/NavBar';
// import ListViewTable from '@/helps/antdComponent/ListView';
import { Icon, ListViewTable } from '@/helps/antdComponent/index.js';
import SearchBar from '@/helps/antdComponent/SearchBar';
import { Title } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
// import { FlexRow, Flex, BaseFont } from '../utils/styleComponent';
import styles from './MyPlayer.css';

class MySavePlayer extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      tableData: [],
      searchVal: '',
      isSort: false, // 是否进行排序
    };
    this.serchInput = null; // 搜索的内容
    this.serverid = null; // 游戏id
    // 是否是正序排序
    this.sortState = {
      masonrySurplus: {
        isSortUp: false, // 是否正序排序
        isSort: false, // 是否在排序
      },
      recentlyLoginTime: {
        isSortUp: false, // 是否正序排序
        isSort: false, // 是否在排序
      },
    };
    // this.forceUpdate();
  }
  // 切换排序
  toggleSort = (sortType) => {
    if (!this.state.isSort) {
      this.sortState[sortType].isSort = true;
      this.setState({
        isSort: true,
      });
      return false;
    }
    for (const attr in this.sortState) {
      if (this.sortState[attr]) {
        // const element = object[key];
        if (attr === sortType) {
          if (this.sortState[attr].isSort) {
            this.sortState[attr].isSortUp = !this.sortState[attr].isSortUp;
          }
          this.sortState[attr].isSort = true;
        } else {
          this.sortState[attr].isSort = false;
        }
      }
    }
    this.forceUpdate();
  }
  powerToControllColumns = () => {
    const self = this;
    const columns = [
      {
        dataIndex: 'playerId',
        title: '玩家',
        render: (data) => {
          return (<div>
            <p>{data.playerName}</p>
            <p style={{ color: '#999' }}>ID:{data.playerId}</p>
          </div>);
        },
      },
      {
        dataIndex: 'masonrySurplus',
        title: '账户钻石',
        render(rowVal) {
          return <div className="countNor">{rowVal.masonrySurplus}</div>;
        },
      },
      {
        dataIndex: 'recentlyLoginTime',
        title: '最近登录',
        render(rowVal) {
          const transRowTieme = new Date(rowVal.recentlyLoginTime).format('MM-dd hh:mm');
          return <div>{transRowTieme}</div>;
        },
      },
    ];
    const hasPowerToRecharge = this.hasPower('playerSDKCharge') || this.hasPower('agentGiveForPlayer');
    if (hasPowerToRecharge) {
      columns.push({
        title: '操作',
        render: (data) => {
          return (<div
            className={styles.rechargeBtn}
            onClick={() => self.payForMyPlayer(data.playerId)}
          >
          充值
          </div>);
        },
      });
    }
    return columns;
  }
  async componentWillMount() {
    const { serverid } = this.router.getQuery();
    this.serverid = serverid;
    let res;
    if (serverid) {
      res = await this.helps.webHttp.get('/spreadApi/mySavePlayer', { serverid });
    } else {
      res = await this.helps.webHttp.get('/spreadApi/mySavePlayer');
    }
    if (res.isSuccess) {
      this.setState({
        tableData: res.data,
      });
    }
  }
  payForMyPlayer = (playerId) => {
    this.props.dispatch(this.helps.routerRedux.push({ pathname: '/pay', query: { playerId, serverid: this.serverid || '' } }));
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
  // 添加收藏的玩家
  navigateToSavePlayer = () => {
    this.props.dispatch(this.helps.routerRedux.push({ pathname: '/savePlayer', query: { serverid: this.serverid || '' } }));
  }
  renderRowData = () => {
    const { searchVal } = this.state;
    if (searchVal) {
      return (
        <div style={{ margin: '0.5rem auto', textAlign: 'center' }}>
          没有搜索到相关玩家
        </div>
      );
    }
    return (
      <div style={{ margin: '0.5rem auto', textAlign: 'center' }}>
        您还没有玩家哦~赶紧去<span onClick={this.navigateToSavePlayer} className="color_base">添加</span>
      </div>
    );
  }
  renderHeader = (columnsData) => { // dataIndex title
    const { isSort } = this.state;
    return (
      <div className={styles.rowSection}>
        {
          columnsData.map(({ title, dataIndex, remark, i }) => {
            const sortInfo = this.sortState[dataIndex];
            let sortIcon = null;
            // console.log(sortInfo);
            if (isSort && sortInfo && sortInfo.isSort) {
              // console.log(sortInfo)
              if (sortInfo.isSortUp) {
                sortIcon = <Icon type="up" size="xs" />;
              } else {
                sortIcon = <Icon type="down" size="xs" />;
              }
            }
            return (
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
                <p className={styles.tableTilteWrap} onClick={() => this.toggleSort(dataIndex)}>
                  <span>{ title }</span>{sortIcon}
                </p>
                <p>{ remark }</p>
              </div>
            );
          })
        }
      </div>
    );
  }
  render() {
    const { searchVal, tableData, isSort } = this.state;
    const columns = this.powerToControllColumns();
    let sortTableData = tableData;
    if (isSort) {
      for (const attr in this.sortState) {
        if (this.sortState[attr] && this.sortState[attr].isSort) {
          if (this.sortState[attr].isSortUp) {
            sortTableData = sortTableData.sort((item1, item2) => {
              return item1[attr] - item2[attr];
            });
          } else {
            sortTableData = sortTableData.sort((item1, item2) => {
              return item2[attr] - item1[attr];
            });
          }
        }
      }
      // const sortType = sortTypeArr[0];
    }
    const filterTableData = sortTableData.filter((data) => {
      if (!searchVal) {
        return true;
      }
      return data.playerId.toString().indexOf(searchVal) !== -1 || data.playerName.indexOf(searchVal) !== -1;
    });
    // const PalyCashAllCount = tableData.reduce((beforeVal, currentVal) => {
    //   return beforeVal + currentVal.palyCashCount;
    // }, 0);
    // const masonrySurplusAllCount = tableData.reduce((beforeVal, currentVal) => {
    //   return beforeVal + currentVal.masonrySurplus;
    // }, 0);
    // const transPalyCashCount = this.parseFloatMoney(PalyCashAllCount);
    // const columnsRemark = [`(共${tableData.length}人)`, `(共${masonrySurplusAllCount}个)`, `(共${transPalyCashCount}元)`];
    // const columnsAddRemark = columns.map((item, i) => ({
    //   ...item,
    //   remark: columnsRemark[i],
    // }));
    // const columnsAddRemark = columns.map(item => ({
    //   ...item,
    //   title: 'sdds'
    // }));
    return (
      <div className={styles.container}>
        <Title>给玩家转钻</Title>
        <NavBar
          title="给玩家转钻"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={this.navigateToSavePlayer}>添加</div>}
        />
        <SearchBar
          placeholder="输入玩家的ID/名称"
          onChange={this.onSearchInputChange}
          value={searchVal}
          onCancelClick={this.onCancelClick}
        />
        {
          this.renderHeader(columns)
        }
        <ListViewTable
          tableData={filterTableData}
          columns={columns}
          sort={this.state.isSort}
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

export default connect(mapStateToProps)(MySavePlayer);
