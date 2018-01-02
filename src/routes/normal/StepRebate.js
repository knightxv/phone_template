import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import BaseComponent from '@/helps/BaseComponent';
import { Button, DatePicker } from '@/helps/antdComponent/index.js';
// import Button from '@/helps/antdComponent/Button';
import NavBar from '@/helps/antdComponent/NavBar';
import { Title } from '@/helps/styleComponent';
import styles from './StepRebate.less';

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
      queryTime: null,
      page: 0,
      priceTableHtmlText: '',
    };
    this.size = 5;
  }
  async componentWillMount() {
    const monthFirstDayStamp = this.helps.getMonthTimeStamp();
    this.getRebateList(monthFirstDayStamp);
    this.getMonthRebateInfo(monthFirstDayStamp);
    
    // const rebateTextKey = this.Enum.htmlTextType.rebateText;
    const htmlTextRes = await this.http.webHttp.get('/spreadApi/rebate/ruleStatu');
    if (htmlTextRes.isSuccess) {
      this.setState({
        priceTableHtmlText: htmlTextRes.data.htmlText,
      });
    }
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
    if (listLength < this.size || listLength.length <= 0) {
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
    const { achievement, myPurchase, rebateInfo, rebateRate, underAgentPurchase,
      underAgentRebate, page, queryTime, priceTableHtmlText,
    } = this.state;
    const achievementLabel = this.helps.parseFloatMoney(achievement);
    const myPurchaseLabel = this.helps.parseFloatMoney(myPurchase);
    const underAgentPurchaseLabel = this.helps.parseFloatMoney(underAgentPurchase);
    const size = this.size;
    const limitUnderAgentRebate = underAgentRebate.slice(page * size, size);
    const underAgentAllCount = underAgentRebate.reduce((bef, cur) => {
      return bef + cur.rebateCount;
    }, 0);
    const myMonthRebeteCount = achievement * rebateRate / 100 - underAgentAllCount;
    let monthLabel = new Date().format('yyyy-MM');
    if (queryTime) {
      monthLabel = queryTime.format('YYYY-MM');
    }
    return (
      <div className={styles.container}>
        <Title>代理阶梯返利</Title>
        <NavBar
          title="代理阶梯返利"
          onClick={this.router.back}
        />
        <div className={styles.headerWrap}>
          <div className={styles.headerLeftWrap}>
            <div>本月返利(元)</div>
            <div className={styles.rebateLabel}>{ this.helps.parseFloatMoney(myMonthRebeteCount) }</div>
            <div className={styles.rebateTip}>(次月1日凌晨划入余额)=本月总业绩*返利比例-下级总返利</div>
          </div>
          <div className={styles.headerRightWrap}>
            <div className={styles.monthTip}>{ monthLabel }</div>
            <DatePicker
              mode="month"
              title="选择日期"
              value={queryTime}
              onChange={this.selectDateTime}
            >
              <WrapDiv>
                <Button size="small">选择月份</Button>
              </WrapDiv>
            </DatePicker>
          </div>
        </div>
        {/* 个人返利信息 */}
        <div className={styles.rebateInfo}>
          <div className={styles.rowItem}>
            <div className={styles.colItem}>本月总业绩<br />元</div>
            <div className={styles.colItem}>返利比例</div>
            <div className={styles.colItem}>个人购卡<br />元</div>
            <div className={styles.colItem}>旗下代理总购卡<br />元</div>
          </div>
          <div className={styles.rowItem}>
            <div className={classnames(styles.colItem, styles.colcountItem)}>{ achievementLabel }</div>
            <div className={classnames(styles.colItem, styles.colcountItem)}>{ rebateRate }%</div>
            <div className={classnames(styles.colItem, styles.colcountItem)}>{ myPurchaseLabel }</div>
            <div className={classnames(styles.colItem, styles.colcountItem)}>{ underAgentPurchaseLabel }</div>
          </div>
          <div className={styles.userRebateTipWrap}>
            <div className={styles.userRebateTip}>{ rebateInfo }</div>
            <div className={styles.userRebateTip}>本月总业绩=个人购卡+旗下代理购卡</div>
          </div>
        </div>
        {/* 下级返利列表 */}
        <div>
          <div className={styles.rebateListTitle}>
            下级返利<span className={styles.count}>
            { this.helps.parseFloatMoney(underAgentAllCount) }</span>元
            (<span className={styles.assTip}>需扣除,等于返利总值之和</span>)
          </div>
          <div className={styles.rebateList}>
            <div className={classnames(styles.rowItem, styles.rebateListRowList)}>
              <div className={styles.colItem}>直属下级代理</div>
              <div className={styles.colItem}>旗下代理数</div>
              <div className={styles.colItem}>今日业绩</div>
              <div className={styles.colItem}>本月业绩</div>
              <div className={styles.colItem}>返利比例</div>
              <div className={styles.colItem}>返利总值</div>
            </div>
            {
              limitUnderAgentRebate.map(rebateData => (
                <div className={classnames(styles.rowItem, styles.rebateListRowItem)} key={rebateData.agentId}>
                  <div className={classnames(styles.colItem)}>
                    {/* { rebateData.agentName }<br /> */}
                    { rebateData.agentId }
                  </div>
                  <div className={classnames(styles.colItem)}>{ rebateData.underAgentCount }</div>
                  <div className={classnames(styles.colItem, styles.colcountItem)}>
                    { this.helps.parseFloatMoney(rebateData.achievementToday) }
                  </div>
                  <div className={classnames(styles.colItem, styles.colcountItem)}>
                    { this.helps.parseFloatMoney(rebateData.achievementMonth) }
                  </div>
                  <div className={classnames(styles.colItem)}>{ rebateData.rebateRate }</div>
                  <div className={classnames(styles.colItem, styles.colcountItem)}>
                    { this.helps.parseFloatMoney(rebateData.rebateCount) }
                  </div>
                </div>
              ))
            }
            <div className={styles.rebatePageWrap}>
              <div>共{ underAgentRebate.length }条</div>
              <div className={styles.pageBtnWrap}>
                <Button className={styles.pageBtn} size="small" onClick={this.beforePage}>上一页</Button>
                <Button className={styles.pageBtn} size="small" onClick={this.nextPage}>下一页</Button>
              </div>
            </div>
          </div>
        </div>
        {/* 返利规则说明 */}
        <div>
          <div className={styles.rebateTitle}>返利规则说明</div>
          <div className={styles.rebateHtmlTextWrap} dangerouslySetInnerHTML={this.helps.createMarkup(priceTableHtmlText)} />
          <div className={styles.rebateStatuWrap}>
            <div className={styles.rebateStatu}>
              ▶ 您总业绩=个人购卡+旗下代理购卡
            </div>
            <div className={styles.rebateStatu}>
              ▶ 您实际返利 = 您总业绩 * 对应提成比例 - 您各直属下级的业绩 * 对应提成比例
            </div>
            <div className={styles.rebateStatu}>
              ▶ 旗下所有业绩：您发展ABC,B发展DE，D发展FG,那么ABC是您的直属下级代理；A的业绩是A个人充
              值金额，B的业绩是BDEF充值金额总和，D的业绩是DFG充值金额总和；您的总业绩就是您个人充值金额+ABCDEFG充值金额总和
            </div>
            <div className={classnames(styles.rebateStatu, styles.rebateImporLabel)}>
            ▶ 每月月底统计最终返利数值,并将返利金额添加到个人账号,可从返利提现中进行提取
            </div>
            <div className={styles.rebateStatu}>
            ▶ 若有任何不明白，请咨询官方客服，或关注微信公众号【阿拉游戏中心】
            </div>
          </div>
        </div>
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
