import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import BaseComponent from '@/core/BaseComponent';
import { NavBar } from '@/components/lazyComponent/antd';
import { Title, IconImg } from '@/components/styleComponent';
import styles from './StepRebateAdded.less';

const imgSource = {
  look: require('../../assets/chakan.png'),
};

class StepRebateAdded extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      addedRebate: '-', // 额外收益
      stepRebate: '-', // 阶梯返利
      addedRebateRate: '-', // 阶梯比例
      page: 0,
      record: [
      ],
    };
    this.showItemLength = 6;
  }
  async componentWillMount() {
    const res = await this.http.webHttp.get('/spreadApi/rebate/agentAddedRebateInfo');
    if (!res.isSuccess) {
      return;
    }
    this.setState({
      ...res.data,
    });
    const recordRes = await this.http.webHttp.get('/spreadApi/rebate/addedRebateRecord');
    if (recordRes.isSuccess) {
      this.setState({
        record: recordRes.data,
      });
    }
  }
  // 上一页
  prePage = () => {
    const { page } = this.state;
    if (page <= 0) {
      this.message.info('没有上一页了');
      return;
    }
    this.setState({
      page: page - 1,
    });
  }
  // 下一页
  nextPage = () => {
    const { page, record } = this.state;
    const showItemLength = this.showItemLength;
    if ((page + 1) * showItemLength >= record.length) {
      this.message.info('没有下一页了');
      return;
    }
    this.setState({
      page: page + 1,
    });
  }
  render() {
    const { record, page, addedRebate, stepRebate, addedRebateRate } = this.state;
    const showItemLength = this.showItemLength;
    const limitRecord = record.slice(page * showItemLength, (page + 1) * showItemLength);
    const addedRebateLabel = this.helps.parseFloatMoney(addedRebate);
    const stepRebateLabel = this.helps.parseFloatMoney(stepRebate);
    const rebateAllCount = record.reduce((before, current) => {
      return before + current.addedProfit;
    }, 0);
    const rebateAllCountLabel = this.helps.parseFloatMoney(rebateAllCount);
    return (
      <div className={styles.container}>
        <Title>返利额外返点</Title>
        <NavBar
          title="返利额外返点"
          onClick={this.router.back}
        />
        <div className={styles.headerWrap}>
          <div className={styles.headerLabelTip}>
            本月额外收益（元）
          </div>
          <div className={styles.rebateAddedMoney}>
            { addedRebateLabel || '-' }
          </div>
          <div className={styles.headerLabelAssistTip}>
            注：本月额外收益=本月阶梯返利 * 额外返点比例
          </div>
        </div>
        <div className={styles.rebateAddedInfo}>
          <div className={styles.rebateInfoItem}>
            <div>{ stepRebateLabel || '-' }元</div>
            <div className={styles.rebateInfoTip}>本月阶梯返利</div>
          </div>
          <div className={styles.rebateInfoItem}>
            <div>{ addedRebateRate }%</div>
            <div className={styles.rebateInfoTip}>额外返点比例</div>
          </div>
        </div>
        {/* 额外返利记录 */}
        <div>
          <div className={styles.rebateAddedRecordTitleWrap}>
            <IconImg className={styles.lookIcon} src={imgSource.look} /><span>额外返利记录</span>
          </div>
          <div className={styles.rebateAddedRecordInfoWrap}>
            <div className={styles.rebateAllCountLabel}>{ rebateAllCountLabel }元</div>
            <div className={styles.rebateAddedRecordInfoTip}>累积额外收益(元)</div>
          </div>
          <div>
            <div className={styles.recordItemWrap}>
              <div className={styles.recordItem}>时间</div>
              <div className={classnames(styles.recordItem, styles.recordItemEvent)}>额外收益</div>
              <div className={styles.recordItem}>阶梯返利</div>
              <div className={classnames(styles.recordItem, styles.recordItemEvent)}>返点比例</div>
            </div>
            {
              limitRecord.length > 0
              ? (limitRecord.map((data, i) => {
                const { countTime, addedProfit, monthRebate, stepRebateAddedRate } = data;
                const timeLabel = new Date(countTime).format('yyyy-MM');
                const addedProfitLabel = this.helps.parseFloatMoney(addedProfit);
                const rebateLabel = this.helps.parseFloatMoney(monthRebate);
                const stepRebateAddedRateLabel = `${stepRebateAddedRate}%`;
                return (
                  <div className={styles.recordItemWrap} key={i}>
                    <div className={styles.recordItemRow}>{ timeLabel }</div>
                    <div className={classnames(styles.recordItemRow, styles.recordItemRowAdded)}>{ addedProfitLabel }</div>
                    <div className={classnames(styles.recordItemRow, styles.recordItemRowStepMoney)}>{ rebateLabel }</div>
                    <div className={styles.recordItemRow}>{ stepRebateAddedRateLabel }</div>
                  </div>
                );
              }))
              : (<div className={styles.recordNoDataTip}>没有数据</div>)
            }
            <div className={styles.pageControllerWrap}>
              <div className={styles.pageController} onClick={this.prePage}>上一页</div>
              <div className={styles.pageController} onClick={this.nextPage}>下一页</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(StepRebateAdded);
