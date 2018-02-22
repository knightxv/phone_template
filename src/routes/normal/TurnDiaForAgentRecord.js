import React from 'react';
import { connect } from 'dva';
// import { window } from 'global';
import moment from 'moment';
import classnames from 'classnames';
import styles from './ComRecordTable.less';
import SearchInput from '@/components/SearchInput';
import BaseComponent from '@/core/BaseComponent';
import Modal from '@/components/antdComponent/Modal';
import { Icon, NavBar, DatePicker } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';

// const imgSource = {
//   masonry: require('../../assets/zuanshi.png'),
//   wx: require('../../assets/wx.png'),
//   zfb: require('../../assets/zfb.png'),
//   yezf: require('../../assets/yezf.png'),
//   androidTip: require('../../assets/android_tip.png'),
//   iosTip: require('../../assets/ios_tip.png'),
// };

const size = 9;
class TurnDiaForAgentRecord extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectTimeMode: 'fast', // custom
      fastIndex: 0, // 快速选择模式中选中的索引
      startTime: null,
      endTime: null,
      customSelect: 'start', // end
      record: [],
      page: 0,
      searchVal: '',
    };
    const toDayFirstStamp = this.helps.getDayTimeStamp();
    const yestodayStartStamp = toDayFirstStamp - 86400000;
    this.fastSelectArr = [
      {
        timeLabel: '今天',
        startTimeStamp: toDayFirstStamp,
        endTimeStamp: toDayFirstStamp + 86400000,
      },
      {
        timeLabel: '昨天',
        startTimeStamp: yestodayStartStamp,
        endTimeStamp: toDayFirstStamp,
      },
      {
        timeLabel: '本月',
        startTimeStamp: this.helps.getMonthTimeStamp(),
        endTimeStamp: toDayFirstStamp + 86400000,
      },
      {
        timeLabel: '全部',
        startTimeStamp: null,
        endTimeStamp: null,
      },
    ];
  }
  componentWillMount() {
    this.getRecord();
  }
  getRecord = async () => {
    const res = await this.http.webHttp.get('/spreadApi/agentSellDiaRecord');
    if (res.isSuccess) {
      this.setState({
        record: res.data,
      });
    }
  }
  fastSelect = (index) => {
    this.setState({
      selectTimeMode: 'fast',
      fastIndex: index,
      page: 0,
      startTime: null,
      endTime: null,
    });
  }
  selectEndTime = (endTime) => {
    this.setState({
      endTime,
      selectTimeMode: 'custom',
      page: 0,
    });
  }
  selectStartTime = (startTime) => {
    this.setState({
      startTime,
      selectTimeMode: 'custom',
      page: 0,
    });
  }
  deleteOrder = async (orderId) => {
    const res = await this.http.webHttp.get('/spreadApi/deleteAgentSellDiaRecord', {
      orderId,
    });
    if (res.isSuccess) {
      this.getRecord();
      this.message.info('删除成功');
    } else {
      this.message.info(res.info || '删除失败');
    }
  }
  showdeleteOrderPicker = (orderId) => {
    Modal.alert('', '删除之后无法恢复这笔订单，您确定要删除这条订单吗？', [
      { text: '取消' },
      {
        text: '确定',
        onPress: () => this.deleteOrder(orderId),
      },
    ]);
  }
  orderDetail = (orderId) => {
    this.router.go('/turnDiaForAgentOrderDetail', {
      orderId,
    });
  }
  beforePage = () => {
    if (this.state.page <= 0) {
      this.message.info('没有上一页');
      return;
    }
    this.setState({
      page: this.state.page - 1,
    });
  }
  nextPage = (showRecordLength) => {
    const listLength = showRecordLength;
    const { page } = this.state;
    if (listLength <= page * size + size) {
      this.message.info('没有下一页');
      return;
    }
    this.setState({
      page: this.state.page + 1,
    });
  }
  render() {
    const { selectTimeMode, fastIndex, startTime, endTime, record, page, searchVal } = this.state;
    // 时间选择过滤
    let resultRecord = [];
    if (selectTimeMode === 'fast') {
      const { startTimeStamp, endTimeStamp } = this.fastSelectArr[fastIndex];
      resultRecord = record.filter((data) => {
        if (!startTimeStamp && !endTimeStamp) {
          return true;
        }
        return data.chargeTime >= startTimeStamp && data.chargeTime <= endTimeStamp;
      });
    } else if (selectTimeMode === 'custom') {
      if (startTime && !endTime) {
        const startTimeStamp = this.helps.getDayTimeStamp(startTime.valueOf());
        resultRecord = record.filter((data) => {
          return data.chargeTime >= startTimeStamp;
        });
      } else if (endTime && !startTime) {
        const endTimeStamp = this.helps.getDayTimeStamp(endTime.valueOf()) + 86400000;
        resultRecord = record.filter((data) => {
          return data.chargeTime <= endTimeStamp;
        });
      } else if (startTime && endTime) {
        const startTimeStamp = this.helps.getDayTimeStamp(startTime.valueOf());
        const endTimeStamp = this.helps.getDayTimeStamp(endTime.valueOf()) + 86400000;
        resultRecord = record.filter((data) => {
          if (!startTimeStamp && !endTimeStamp) {
            return true;
          }
          return data.chargeTime >= startTimeStamp && data.chargeTime <= endTimeStamp;
        });
      } else {
        resultRecord = record;
      }
    }
    // 玩家id筛选
    resultRecord = resultRecord.filter((data) => {
      if (!searchVal) {
        return true;
      }
      return String(data.agentId).indexOf(searchVal) > -1;
    });
    // 购钻总量
    const masonryCount = resultRecord.reduce((before, current) => {
      return before + current.chargeCount;
    }, 0);
    // 分页显示
    const showRecord = resultRecord.slice(page * size, (page + 1) * size);
    return (<div className={styles.container}>
      <Title>给代理充钻记录</Title>
      <NavBar
        title="给代理充钻记录"
        onClick={this.router.back}
      />
      <div className={styles.resultTitle}>统计结果</div>
      <div className={styles.countItemWrap}>
        <div className={styles.countRowItem}>
          <div className={styles.countLabel}>{ masonryCount }</div>
          <div className={styles.countTip}>购钻数量</div>
        </div>
      </div>
      <div className={styles.selectTimeItemWrap}>
        <div>快速选择时间：</div>
        {
          this.fastSelectArr.map((data, i) => (
            <div
              key={i}
              className={classnames({
                [styles.selectTimeItem]: true,
                [styles.selectTimeItemActive]: selectTimeMode === 'fast' && fastIndex === i,
              })}
              onClick={() => this.fastSelect(i)}
            >{ data.timeLabel }</div>
          ))
        }
      </div>
      <div className={styles.selectTimeItemWrap}>
        <DatePicker
          mode="date"
          title="选择开始日期"
          value={startTime || endTime || moment()}
          maxDate={endTime || moment()}
          onChange={this.selectStartTime}
        >
          <WrapDiv className={styles.timeSelectItem}>
            <span>{ startTime ? startTime.format('YYYY年MM月DD日') : '起始时间' }</span>
            <Icon type="down" />
          </WrapDiv>
        </DatePicker>
        <DatePicker
          mode="date"
          title="选择结束日期"
          value={endTime || moment()}
          minDate={startTime}
          maxDate={moment()}
          onChange={this.selectEndTime}
        >
          <WrapDiv className={styles.timeSelectItem}>
            <span>{ endTime ? endTime.format('YYYY年MM月DD日') : '结束时间' }</span>
            <Icon type="down" />
          </WrapDiv>
        </DatePicker>
        <div className={styles.searchInputWrap}>
          <SearchInput
            onChange={val => this.setState({ searchVal: val })}
            value={searchVal}
            type="number"
            placeholder="代理ID"
          />
        </div>
      </div>
      <div>
        <div className={styles.recordTitleWrap}>
          <div className={styles.recordTitleItem}>
            <span>订单时间</span>
          </div>
          <div className={styles.recordTitleItem}>
            <span>转出对象(代理ID)</span>
          </div>
          <div className={styles.recordTitleItem}>
            <span>钻石数量</span>
          </div>
          <div className={styles.recordTitleItemOption}>
            <span>操作</span>
          </div>
        </div>
        <div className={styles.recordContent}>
          {
            showRecord.map((data) => {
              const { orderId, agentId, chargeCount, chargeTime } = data;
              const dateDayLabel = new Date(chargeTime).format('yyyy-MM-dd');
              const dateHourLabel = new Date(chargeTime).format('hh:mm:ss');
              return (
                <div key={orderId} className={styles.recordRowItemWrap}>
                  <div className={styles.recordRowItem}>
                    <div className={styles.recordTimeDay}>{ dateDayLabel }</div>
                    <div className={styles.recordTimeHour}>{ dateHourLabel }</div>
                  </div>
                  <div className={classnames(styles.recordRowItem, styles.colorBase)}>
                    { agentId }
                  </div>
                  <div className={classnames(styles.recordRowItem, styles.colorBase)}>
                    { chargeCount }
                  </div>
                  <div className={styles.recordRowItemOption}>
                    <div className={styles.deleteBtn} onClick={() => this.showdeleteOrderPicker(orderId)}>删除</div>
                    <div className={styles.lookDetailBtn} onClick={() => this.orderDetail(orderId)}>查看详情</div>
                  </div>
                </div>
              );
            })
          }
          {
            showRecord.length === 0 &&
            <div className={styles.notDataWrap}>
              没有数据
            </div>
          }
        </div>
        <div className={styles.recordFooter}>
          <div>共{ resultRecord.length }条记录</div>
          <div className={styles.pageControllerWrap}>
            {
              page > 0 &&
              <div className={styles.pageController} onClick={this.beforePage}>上一页</div>
            }
            {
              resultRecord.length > (page * size + size) &&
              <div className={styles.pageController} onClick={() => this.nextPage(resultRecord.length)}>下一页</div>
            }
          </div>
        </div>
      </div>

    </div>);
  }
}

// 防止extra放在div报警告
const WrapDiv = ({ children, extra, ...props }) => {
  return (<div {...props}>{children}</div>);
};

const mapStateToProps = (state) => {
  return {
    ...state.agent,
  };
};

export default connect(mapStateToProps)(TurnDiaForAgentRecord);
