import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import moment from 'moment';
import BaseComponent from '@/core/BaseComponent';
import CloseModal from '@/components/Modal/CloseModal';
import { Button, DatePicker, Icon, NavBar } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import styles from './StepRebate.less';

const imgSource = {
  titleIcon: require('../../assets/fanli_icon.png'),
  chakan: require('../../assets/chakan.png'),
};
class StepRebate extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      achievement: 0, // 总业绩
      rebateRate: 0, // 返利比例
      myPurchase: 0, // 个人购卡
      rebateInfo: 0, // 返利信息
      underAgentPurchase: 0, // 旗下代理总购卡
      underAgentRebate: [], // 下级代理返利信息
      queryTime: moment(),
      page: 0,
      rebateStatuMap: [],
      rulePickerVisible: false,
    };
    this.size = 5;
  }
  async componentWillMount() {
    const monthFirstDayStamp = this.helps.getMonthTimeStamp();
    this.getRebateList(monthFirstDayStamp);
    this.getMonthRebateInfo(monthFirstDayStamp);

    // const rebateTextKey = this.Enum.htmlTextType.rebateText;
    const rebateStatuMapRes = await this.http.webHttp.get('/spreadApi/rebate/ruleStatu');
    if (rebateStatuMapRes.isSuccess) {
      this.setState({
        rebateStatuMap: rebateStatuMapRes.data,
      });
    }
  }
  toggleRulePicker = () => {
    this.setState({
      rulePickerVisible: !this.state.rulePickerVisible,
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
  nextPage = () => {
    const listLength = this.state.underAgentRebate.length;
    const { page } = this.state;
    const size = this.size;
    if (listLength <= page * size + size) {
      this.message.info('没有下一页');
      return;
    }
    this.setState({
      page: this.state.page + 1,
    });
  }
  // 选择时间
  selectDateTime = (momentTime) => {
    this.setState({
      queryTime: momentTime,
    });
    const monthFirstDayStamp = this.helps.getMonthTimeStamp(momentTime.valueOf());
    this.getRebateList(monthFirstDayStamp);
    this.getMonthRebateInfo(monthFirstDayStamp);
  }
  // 获取返利列表
  getRebateList = async (timeStamp) => {
    const underAgentRes = await this.http.webHttp.get('/spreadApi/rebate/monthUnderAgentRebate', {
      queryMonth: timeStamp,
    });
    if (underAgentRes.isSuccess) {
      const underAgentRebate = underAgentRes.data;
      this.setState({
        underAgentRebate,
      });
    }
  }
  // 获取月返利信息
  getMonthRebateInfo = async (timeStamp) => {
    const res = await this.http.webHttp.get('/spreadApi/rebate/monthRebateInfo', {
      queryMonth: timeStamp,
    });
    if (res.isSuccess) {
      this.setState({
        ...res.data,
      });
    }
  }
  render() {
    const { achievement, myPurchase, rebateRate, underAgentPurchase,
      underAgentRebate, page, queryTime, rebateStatuMap, diffMoneyToNext, nextRate,
      rulePickerVisible,
    } = this.state;
    const achievementLabel = this.helps.parseFloatMoney(achievement);
    const myPurchaseLabel = this.helps.parseFloatMoney(myPurchase);
    const underAgentPurchaseLabel = this.helps.parseFloatMoney(underAgentPurchase);
    const size = this.size;
    const limitUnderAgentRebate = underAgentRebate.slice(page * size, page * size + size);
    const underAgentAllCount = underAgentRebate.reduce((bef, cur) => {
      return bef + cur.rebateCount;
    }, 0);
    const myMonthRebeteCount = achievement * rebateRate / 100 - underAgentAllCount;
    let monthLabel = new Date().format('yyyy年MM月');
    if (queryTime) {
      monthLabel = queryTime.format('YYYY年MM月');
    }
    return (
      <div className={styles.container}>
        <Title>代理阶梯返利</Title>
        <NavBar
          title="代理阶梯返利"
          onClick={this.router.back}
          right={<div className={styles.headerRightWrap}>
            <DatePicker
              mode="month"
              title="选择日期"
              value={queryTime}
              maxDate={moment()}
              onChange={this.selectDateTime}
            >
              <WrapDiv>
                <div className={styles.monthTip}>{ monthLabel } <Icon size="xs" type="down" /></div>
              </WrapDiv>
            </DatePicker>
          </div>}
        />
        <div className={styles.headerWrap}>
          <div className={styles.titleItem}>
            <IconImg className={styles.titleIcon} src={imgSource.titleIcon} />
            <div>个人数据</div>
          </div>
          <div className={styles.rebateLabel}>￥{ this.helps.parseFloatMoney(myMonthRebeteCount) }</div>
          <div className={styles.monthRebateTip}>本月返利</div>
          <div className={styles.rebateTipAss}>(次月1日凌晨划入余额,每10分钟更新数据)</div>
          <div className={styles.rebateTip}>本月返利=本月总业绩*返利比例-下级返利总和</div>
          {/* 个人返利信息 */}
          <div className={styles.rebateInfo}>
            <div className={styles.rebateInfoItem}>
              <div className={styles.rebateMoneyTip}>￥{ achievementLabel }</div>
              <div className={styles.rebateTitleTip}>本月总业绩</div>
              <div className={styles.rebateTip2}>总业绩=个人购卡+旗下代理购卡</div>
            </div>
            <div className={styles.rebateInfoItem}>
              <div className={styles.rebateMoneyTip}>{ rebateRate }%</div>
              <div className={styles.rebateTitleTip}>返利比例</div>
              {
                diffMoneyToNext != 0 &&
                <div className={styles.rebateTip2}>
                  总业绩还差<span className={styles.count}>{this.helps.parseFloatMoney(diffMoneyToNext)}</span>元可提升至
                  <span className={styles.count}>{nextRate}</span>%
                </div>
              }
            </div>
            <div className={styles.rebateInfoItem}>
              <div className={styles.rebateMoneyTip}>￥{ myPurchaseLabel }</div>
              <div className={styles.rebateTitleTip}>个人购卡</div>
            </div>
            <div className={styles.rebateInfoItem}>
              <div className={styles.rebateMoneyTip}>￥{ underAgentPurchaseLabel }</div>
              <div className={styles.rebateTitleTip}>旗下代理总购卡</div>
            </div>
          </div>
        </div>
        {/* 下级返利列表 */}
        <div>
          <div className={styles.underAgentTitleWrap}>
            <IconImg className={styles.titleIcon} src={imgSource.chakan} />
            <div>直属下级情况</div>
          </div>
          <div className={styles.underAgentRebateListTitle}>
            <span className={styles.rebateListCount}>
            ￥{ this.helps.parseFloatMoney(underAgentAllCount) }</span>
            <span className={styles.rebateListTip}>下级返利总和</span>
          </div>
          <div className={styles.rebateList}>
            <div className={classnames(styles.rowItem, styles.rebateListRowList)}>
              <div className={styles.rebateListHeaderColItem}>直属下级代理</div>
              <div className={styles.rebateListHeaderColItem}>旗下代理数</div>
              <div className={styles.rebateListHeaderColItem}>今日业绩(元)</div>
              <div className={styles.rebateListHeaderColItem}>本月业绩(元)</div>
              <div className={styles.rebateListHeaderColItem}>返利比例</div>
              <div className={styles.rebateListHeaderColItem}>返利总值</div>
            </div>
            {
              limitUnderAgentRebate.map(rebateData => (
                <div className={classnames(styles.rowItem, styles.rebateListRowItem)} key={rebateData.agentId}>
                  <div className={classnames(styles.colItem, styles.rowBodyItem)}>
                    <div className={styles.rowAgentName}>{ rebateData.agentName }</div>
                    <div className={styles.rowAgentId}>{ rebateData.agentId }</div>
                  </div>
                  <div className={classnames(styles.colItem, styles.rowBodyItem)}>{ rebateData.underAgentCount }</div>
                  <div className={classnames(styles.colItem, styles.colcountItem)}>
                    { this.helps.parseIntMoney(rebateData.achievementToday) }
                  </div>
                  <div className={classnames(styles.colItem, styles.rowBodyItem, styles.colcountItem)}>
                    { this.helps.parseIntMoney(rebateData.achievementMonth) }
                  </div>
                  <div className={classnames(styles.colItem)}>{rebateData.rebateRate}%</div>
                  <div className={classnames(styles.colItem, styles.rowBodyItem, styles.colcountItem)}>
                    { this.helps.parseFloatMoney(rebateData.rebateCount) }
                  </div>
                </div>
              ))
            }
            <div className={styles.rebatePageWrap}>
              <div className={styles.rabatePageCount}>共{ underAgentRebate.length }条</div>
              <div className={styles.pageBtnWrap}>
                {
                  this.state.page > 0 &&
                  <Button className={styles.pageBtn} size="small" onClick={this.beforePage}>上一页</Button>
                }
                {
                  (underAgentRebate.length > page * size + size) &&
                  <Button className={styles.pageBtn} size="small" onClick={this.nextPage}>下一页</Button>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ruleBtnWrap} onClick={this.toggleRulePicker}>
          <Button>规则说明</Button>
        </div>
        {/* 返利规则说明 */}
        <CloseModal visible={rulePickerVisible} onClose={this.toggleRulePicker}>
          {
            rebateStatuMap && rebateStatuMap.length > 0 &&
            <div className={styles.tableWrap}>
              <div className={styles.tableRow}>
                <div className={styles.tableCol}>金额业绩</div>
                <div className={styles.tableCol}>返利比例</div>
              </div>
              {
                rebateStatuMap.map((statu, i) => (
                  <div className={styles.tableRow} key={`statu${i}`}>
                    <div className={styles.tableCol}>{ Math.floor(statu.achievement / 100) }+</div>
                    <div className={styles.tableCol}>{ statu.rate }%</div>
                  </div>
                ))
              }
            </div>
          }
          <div className={styles.rebateStatuWrap}>
            <div className={styles.rebateStatu}>
              ▶ 您总业绩 = 个人购卡 + 旗下代理购卡
            </div>
            <div className={styles.rebateStatu}>
              ▶ 您实际返利 = 您总业绩 * 对应提成比例 - 您各直属下级的业绩 * 对应提成比例
            </div>
            <div className={styles.rebateStatu}>
              ▶ 旗下代理购卡：您发展ABC,B发展DE，D发展FG,那么ABC是您的直属下级代理；A的业绩是A个人充值金额，
              B的业绩是BDEF充值金额总和，D的业绩是DFG充值金额总和；您的总业绩就是您个人充值金额+ABCDEFG充值金额总和
            </div>
            <div className={classnames(styles.rebateStatu, styles.rebateImporLabel)}>
            ▶ 所有数据每10分钟刷新一次，每月月底统计最终返利数值，并将返利金额添加到个人账号，可从返利提现中进行提取
            </div>
            {/* <div className={styles.rebateStatu}>
            ▶ 若有任何不明白，请咨询官方客服，或关注微信公众号【阿当游戏】
            </div> */}
          </div>
        </CloseModal>
      </div>
    );
  }
}

// 防止extra放在div报警告
const WrapDiv = ({ children, extra, ...props }) => {
  return (<div {...props}>{children}</div>);
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(StepRebate);
