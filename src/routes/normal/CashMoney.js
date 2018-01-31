import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';

import ScrollTop from '@/components/ScrollTop';
import { List } from 'antd-mobile';
import { region } from '@/data/region';
import { ScrollListView } from '@/components/lazyComponent/ScrollListView';
import { StickyContainer, Sticky } from '@/components/lazyComponent/ReactSticky';
import { InputItem, Button, SelectPicker, NavBar } from '@/components/lazyComponent/antd';
import { FlexRow, Flex, WhiteSpace, Title } from '@/components/styleComponent';
import bankData from '@/data/bank';
import LongPress from '@/components/LongPress';

import styles from './CashMoney.less';


class AgencyExtractMoney extends BaseComponent {
  constructor(props) {
    super(props);
    const {
      wechatacc, // 提现所用的微信号
      positionName, // 位置
      cardNumber, // 银行卡号
      bankCardName, // 名字
      bankName, // 银行
      bankOfDeposit, // 开户银行
     } = props;
    //  const positionName = 'df';
    this.bankDataSelect = bankData.map(val => ({
      label: val,
      value: val,
    }));
    this.positionDataSelect = region;
    // 查看所填的城市是否在列表里，否则就选择默认的
    let defaultPosition = [this.positionDataSelect[0].value, this.positionDataSelect[0].children[0].value];
    if (positionName) {
      const positionArr = positionName.split(' ');
      if (positionArr.length === 2) {
        const pro = positionArr[0];
        const city = positionArr[1];
        this.positionDataSelect.some((position) => {
          if (position.value === pro) {
            position.children.some((cityPos) => {
              if (cityPos.value === city) {
                defaultPosition = [pro, city];
                return true;
              }
              return false;
            });
            return true;
          }
          return false;
        });
      }
      // defaultPosition = positionArr;
    }
    // 查看所填的银行是否在所填的范围内，否则就选择默认的
    let defaultBankName = this.bankDataSelect[0].value;
    this.bankDataSelect.some((bank) => {
      if (bank.value === bankName) {
        defaultBankName = bankName;
        return true;
      } else {
        return false;
      }
    });
    this.state = {
      wechat_acc: wechatacc || '', // 提现所用的微信号
      cardNumber, // 银行卡号
      bankCardName, // 名字
      bankName: [defaultBankName], // 银行
      bankOfDeposit, // 开户银行
      cashCount: '',
      positionSelect: defaultPosition,
      record: [],
    };
  }
  // 提现
  cashMoeny = async () => {
    const { wechat_acc, positionSelect, cardNumber, bankCardName, bankName, bankOfDeposit, cashCount } = this.state;
    const positionName = positionSelect.join(' ');
    const params = {
      bankName: bankName[0],
      userName: bankCardName,
      cardNumber,
      bankOfDeposit,
      positionName,
      wechatNumber: wechat_acc,
      cashCount,
    };
    if (!cardNumber || !bankCardName) {
      this.message.info('卡号和姓名不能为空');
      return;
    }
    if (!cashCount || isNaN(cashCount) || !/^\d+(\.\d{1,2})?$/.test(cashCount)) {
      this.message.info('输入的提现金额格式错误');
      return false;
    }
    const res = await this.http.webHttp.get('/spreadApi/cash', params);
    if (res.isSuccess) {
      this.message.info(res.info || '提现成功');
      this.router.back();
    } else {
      this.message.info(res.info);
      // 更新用户数据
      const updateRes = await this.http.webHttp.get('/spreadApi/getUserInfo');
      if (updateRes.isSuccess) {
        this.props.dispatch({ type: 'agent/updateAppInfo', payload: { ...updateRes.data } });
      }
    }
  }
  // 选择银行
  selectBankChange = (val) => {
    this.setState({
      bankName: val,
    });
  }
  // 选择城市
  selectCityChange = (val) => {
    this.setState({
      positionSelect: val,
    });
  }
  deleteOrder = async (orderId) => {
    const isComfirm = confirm('确认删除订单');
    if (isComfirm) {
      const res = await this.http.webHttp.get('/spreadApi/deleteCashRecord', {
        orderId,
      });
      if (!res.isSuccess) {
        this.message.info(res.info || '删除订单失败');
        return;
      }
      this.message.info(res.info || '删除订单成功');
      const newRecord = this.state.record.filter((record) => {
        return record.id !== orderId;
      });
      this.setState({
        record: newRecord,
      });
    }
  }
  renderRow = (rowData) => {
    const timeLabel = new Date(rowData.createTime).format('yyyy-MM-dd hh:mm');
    const cashCount = this.helps.parseFloatMoney(rowData.cashCount);
    let statuLabel = '待审核';
    if (rowData.result == 1) {
      statuLabel = '已通过';
    } else if (rowData.result == 2) {
      statuLabel = '已拒绝';
    }
    return (<LongPress className={styles.itemWrap} onLongPress={() => this.deleteOrder(rowData.id)}>
      <div>
        <div>余额-转出银行卡</div>
        <div className={styles.timeLabel}>{ timeLabel }</div>
      </div>
      <div className={`${styles.orderStatuWrap} ${rowData.result === 2 ? styles.fail : styles.success}`}>
        <span>{ cashCount }</span>
        <span className={styles.fkh}>（</span>
        <span>{ statuLabel }</span>
        <span className={styles.fkh}>）</span>
      </div>
    </LongPress>);
  }
  async componentWillMount() {
    // const { selectTime, selectType } = this.state;
    // const type = selectType[0];
    const res = await this.http.webHttp.get('/spreadApi/cashRecord');
    if (res.isSuccess) {
      this.setState({
        record: res.data || [],
      });
    } else {
      this.message.info(res.info || '请求错误');
    }
  }
  scrollTop = () => {
    const scrollNode = this.scroll;
    if (scrollNode) {
      scrollNode.scrollTo && scrollNode.scrollTo(0, 0);
    }
  }
  render() {
    const { wechat_acc: wechatAcc, cardNumber, bankCardName, positionSelect,
      bankName, bankOfDeposit, cashCount, record,
    } = this.state;
    const { canCashCount } = this.props;
    const canCashCountFloat = parseFloat(canCashCount / 100).toFixed(2);

    let monthCash = 0;
    let allCash = 0;
    record.forEach((data) => {
      if (data.result == 1) {
        if (data.createTime >= this.helps.getMonthTimeStamp()) {
          monthCash += data.cashCount;
        }
        allCash += data.cashCount;
      }
    });
    const monthCashLabel = this.helps.parseFloatMoney(monthCash);
    const allCashLabel = this.helps.parseFloatMoney(allCash);
    return (
      <div>
        <Title>提现</Title>
        <NavBar
          title="提现"
          onClick={this.router.back}
        />
        <WhiteSpace />
        <SelectPicker
          value={bankName}
          data={this.bankDataSelect}
          title="选择交易类型"
          onChange={this.selectBankChange}
          cols={1}
        >
          <List.Item arrow="horizontal" className={styles.itemWrap}>银行</List.Item>
        </SelectPicker>
        <WhiteSpace />
        <SelectPicker
          value={positionSelect}
          data={this.positionDataSelect}
          title="选择城市"
          onChange={this.selectCityChange}
          cols={2}
        >
          <List.Item arrow="horizontal" className={styles.itemWrap}>城市</List.Item>
        </SelectPicker>
        <WhiteSpace />
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入银行卡号"
            onChange={val => this.setState({ cardNumber: val })}
            value={cardNumber}
          >
            <div>卡号</div>
          </InputItem>
        </div>
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入微信号"
            onChange={value => this.setState({ wechat_acc: value })}
            value={wechatAcc}
          >
            <div>微信号</div>
          </InputItem>
        </div>
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入姓名"
            onChange={val => this.setState({ bankCardName: val })}
            value={bankCardName}
          >
            <div>姓名</div>
          </InputItem>
        </div>
        <div className={styles.inputRowItem}>
          <InputItem
            placeholder="请输入开户银行"
            onChange={val => this.setState({ bankOfDeposit: val })}
            value={bankOfDeposit}
          >
            <div>开户银行</div>
          </InputItem>
        </div>
        <WhiteSpace />
        <div className={styles.itemCashWrap}>
          <p className={styles.label}>提现金额</p>
          <FlexRow>
            <p className={styles.moenyPreLabel}>￥:</p>
            <InputItem
              placeholder="请输入提现金额"
              onChange={val => this.setState({ cashCount: val })}
              value={cashCount}
            />
          </FlexRow>
          <p className={styles.tip}>
            账号金额<span className={styles.moneyCount}>{canCashCountFloat}元</span>(金额低于100元不可提取)
          </p>
        </div>
        <Flex>
          <Button
            className={styles.cashBtn}
            onClick={this.cashMoeny}
          >
          确认提取
          </Button>
        </Flex>
        <p className={styles.countTip}>每天最多提现一次,工作日24小时内到账,节假日可能会延期</p>
        <StickyContainer>
          <Sticky>
            {
              ({
              style,
                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight
              }) => {
                return (
                  <div className={styles.listWrap} style={style}>
                    <div style={{ height: '1rem' }} />
                    <div className={styles.recordHeader}>
                      <div>
                        本月成功提现金额:<span className={styles.moneyCount}>{ monthCashLabel }</span>元
                      </div>
                      <div>
                      提现成功总金额:<span className={styles.moneyCount}>{ allCashLabel }</span>元
                      </div>
                    </div>
                    <ScrollListView
                      data={record}
                      renderRow={this.renderRow}
                      getNode={(node) => { this.scroll = node; }}
                    />
                    {
                      wasSticky && <ScrollTop onClick={this.scrollTop} />
                    }
                  </div>
                );
              }
            }
          </Sticky>
        </StickyContainer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(AgencyExtractMoney);
