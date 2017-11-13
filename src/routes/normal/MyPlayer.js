import React from 'react';
import { connect } from 'dva';

import { NavBar, ListViewTable } from '@/helps/antdComponent';
import { Title, SearchBar } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
// import { FlexRow, Flex, BaseFont } from '../utils/styleComponent';
import styles from './MyPlayer.css';

class SecondaryAgencyRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      tableData: [],
      searchVal: '',
    };
    this.serchInput = null; // 搜索的内容
    this.serverid = null; // 游戏id
    const self = this;

    this.columns = [
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
        title: '最近登录时间',
        render(rowVal) {
          const transRowTieme = new Date(rowVal.recentlyLoginTime).format('MM-dd hh:mm');
          return <div>{transRowTieme}</div>;
        },
      },
      {
        title: '操作',
        render: (data) => {
          return (<div
            className={styles.rechargeBtn}
            onClick={() => self.payForMyPlayer(data.playerId)}
          >
          充值
          </div>);
        },
      },
    ];
  }
  async componentWillMount() {
    const { serverid } = this.helps.querystring.parse(this.props.location.search.substring(1));
    this.serverid = serverid;
    let res;
    if (serverid) {
      res = await this.helps.webHttp.get('/spreadApi/myPlayers', { serverid });
    } else {
      res = await this.helps.webHttp.get('/spreadApi/myPlayers');
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
  // 邀请玩家去玩游戏
  invitePlayerToPlayerGame = () => {
    // alert('请求配置，跳到游戏详情页');
    if (this.serverid) {
      window.location.href = `http://www.hulema.com/#gameDetail/${this.serverid}`;
    } else {
      window.location.href = 'http://www.hulema.com';
    }
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
  render() {
    const { searchVal, tableData } = this.state;
    const columns = this.columns;
    const filterTableData = tableData.filter((data) => {
      if (!searchVal) {
        return true;
      }
      return data.playerId.toString().indexOf(searchVal) !== -1 || data.playerName.indexOf(searchVal) !== -1;
    });
    const PalyCashAllCount = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.palyCashCount;
    }, 0);
    const masonrySurplusAllCount = tableData.reduce((beforeVal, currentVal) => {
      return beforeVal + currentVal.masonrySurplus;
    }, 0);
    const transPalyCashCount = this.parseFloatMoney(PalyCashAllCount);
    const columnsRemark = [`(共${tableData.length}人)`, `(共${masonrySurplusAllCount}个)`, `(共${transPalyCashCount}元)`];
    const columnsAddRemark = columns.map((item, i) => ({
      ...item,
      remark: columnsRemark[i],
    }));
    return (
      <div className={styles.container}>
        <Title>我的玩家</Title>
        <NavBar
          title="我的玩家"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={this.invitePlayerToPlayerGame}>邀请</div>}
        />
        <SearchBar
          placeholder="请输入玩家ID/昵称"
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
        />
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SecondaryAgencyRecord);
