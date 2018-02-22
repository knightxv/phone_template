import React from 'react';
import { connect } from 'dva';
// import { window } from 'global';
import moment from 'moment';
import classnames from 'classnames';
import styles from './ComRecordTable.less';

import BaseComponent from '@/core/BaseComponent';
import Modal from '@/components/antdComponent/Modal';
import { Icon, NavBar, DatePicker } from '@/components/lazyComponent/antd';
import { Title } from '@/components/styleComponent';
// import styles from './BuyMasonryRecord.less';

// const imgSource = {
//   masonry: require('../../assets/zuanshi.png'),
//   wx: require('../../assets/wx.png'),
//   zfb: require('../../assets/zfb.png'),
//   yezf: require('../../assets/yezf.png'),
//   androidTip: require('../../assets/android_tip.png'),
//   iosTip: require('../../assets/ios_tip.png'),
// };

const size = 9;
class BuyMasonryRecord extends BaseComponent {
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
    const res = await this.http.webHttp.get('/spreadApi/cashRecord');
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
    const res = await this.http.webHttp.get('/spreadApi/deleteCashRecord', {
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
  orderDetail = (orderInfo) => {
    const { createTime, orderid, resultTime, result, cardNumber, cardname, cashCount } = orderInfo;
    this.router.go('/cashOrderDetail', {
      orderid,
      createTime,
      resultTime,
      result,
      cardNumber,
      cardname,
      cashCount,
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
    const { selectTimeMode, fastIndex, startTime, endTime, record, page } = this.state;
    // 时间选择过滤
    let resultRecord = [];
    if (selectTimeMode === 'fast') {
      const { startTimeStamp, endTimeStamp } = this.fastSelectArr[fastIndex];
      resultRecord = record.filter((data) => {
        if (!startTimeStamp && !endTimeStamp) {
          return true;
        }
        return data.createTime >= startTimeStamp && data.createTime <= endTimeStamp;
      });
    } else if (selectTimeMode === 'custom') {
      if (startTime && !endTime) {
        const startTimeStamp = this.helps.getDayTimeStamp(startTime.valueOf());
        resultRecord = record.filter((data) => {
          return data.createTime >= startTimeStamp;
        });
      } else if (endTime && !startTime) {
        const endTimeStamp = this.helps.getDayTimeStamp(endTime.valueOf()) + 86400000;
        resultRecord = record.filter((data) => {
          return data.createTime <= endTimeStamp;
        });
      } else if (startTime && endTime) {
        const startTimeStamp = this.helps.getDayTimeStamp(startTime.valueOf());
        const endTimeStamp = this.helps.getDayTimeStamp(endTime.valueOf()) + 86400000;
        resultRecord = record.filter((data) => {
          if (!startTimeStamp && !endTimeStamp) {
            return true;
          }
          return data.createTime >= startTimeStamp && data.createTime <= endTimeStamp;
        });
      } else {
        resultRecord = record;
      }
    }
    // 申请金额
    const allCashCount = resultRecord.reduce((before, current) => {
      return before + current.cashCount;
    }, 0);
    const allCashCountLabel = this.helps.parseFloatMoney(allCashCount);
    // 未处理
    const noResolveCount = resultRecord.reduce((before, current) => {
      if (current.result == this.Enum.resolveStatus.waiting) {
        return before + current.cashCount;
      }
      return before;
    }, 0);
    const noResolveCountLabel = this.helps.parseFloatMoney(noResolveCount);
    // 已提现
    const passResolveCount = resultRecord.reduce((before, current) => {
      if (current.result == this.Enum.resolveStatus.pass) {
        return before + current.cashCount;
      }
      return before;
    }, 0);
    const passResolveCountLabel = this.helps.parseFloatMoney(passResolveCount);
    // 已驳回
    const failResolveCount = resultRecord.reduce((before, current) => {
      if (current.result == this.Enum.resolveStatus.fail) {
        return before + current.cashCount;
      }
      return before;
    }, 0);
    const failResolveCountLabel = this.helps.parseFloatMoney(failResolveCount);
    // 分页显示
    const showRecord = resultRecord.slice(page * size, (page + 1) * size);
    return (<div className={styles.container}>
      <Title>提现记录</Title>
      <NavBar
        title="提现记录"
        onClick={this.router.back}
      />
      <div className={styles.resultTitle}>统计结果</div>
      <div className={styles.countItemWrap}>
        <div className={styles.countRowItem}>
          <div className={styles.countLabel}>￥{ allCashCountLabel }</div>
          <div className={styles.countTip}>申请金额</div>
        </div>
        <div className={styles.countRowItem}>
          <div className={styles.countLabel}>￥{ noResolveCountLabel }</div>
          <div className={styles.countTip}>未处理</div>
        </div>
        <div className={styles.countRowItem}>
          <div className={styles.countLabel}>￥{ passResolveCountLabel }</div>
          <div className={styles.countTip}>已提现</div>
        </div>
        <div className={styles.countRowItem}>
          <div className={styles.countLabel}>￥{ failResolveCountLabel }</div>
          <div className={styles.countTip}>已驳回</div>
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
      </div>
      <div>
        <div className={styles.recordTitleWrap}>
          <div className={styles.recordTitleItem}>申请时间</div>
          <div className={styles.recordTitleItem}>提现金额</div>
          <div className={styles.recordTitleItem}>状态</div>
          <div className={styles.recordTitleItemOption}>操作</div>
        </div>
        <div className={styles.recordContent}>
          {
            showRecord.map((data) => {
              const { orderid, cashCount, createTime, result } = data;
              const dateDayLabel = new Date(createTime).format('yyyy-MM-dd');
              const dateHourLabel = new Date(createTime).format('hh:mm:ss');
              const cashCountLabel = this.helps.parseFloatMoney(cashCount);
              const resultLabel = this.Enum.resolveStatusLabel[result];
              return (
                <div key={orderid} className={styles.recordRowItemWrap}>
                  <div className={styles.recordRowItem}>
                    <div className={styles.recordTimeDay}>{ dateDayLabel }</div>
                    <div className={styles.recordTimeHour}>{ dateHourLabel }</div>
                  </div>
                  <div className={classnames(styles.recordRowItem, styles.colorMoney)}>
                    { cashCountLabel }
                  </div>
                  <div className={classnames(styles.recordRowItem, styles.colorGray)}>
                    <div
                      className={classnames({
                        [styles.colorGreen]: result == this.Enum.resolveStatus.pass,
                        [styles.colorFail]: result == this.Enum.resolveStatus.fail,
                        [styles.colorWait]: result == this.Enum.resolveStatus.waiting,
                      })}
                    >
                      { resultLabel }
                    </div>
                  </div>
                  <div className={styles.recordRowItemOption}>
                    <div className={styles.deleteBtn} onClick={() => this.showdeleteOrderPicker(orderid)}>删除</div>
                    <div className={styles.lookDetailBtn} onClick={() => this.orderDetail(data)}>查看详情</div>
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

export default connect(mapStateToProps)(BuyMasonryRecord);
