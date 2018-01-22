import React from 'react';
import { connect } from 'dva';
import CopyToClipboard from 'react-copy-to-clipboard';

import BaseComponent from '@/core/BaseComponent';
import Button from '@/components/antdComponent/Button';
import { WingBlank, WhiteSpace, FlexRow, FlexRowBetween, TitleIcon, Title } from '@/components/styleComponent';
import styles from './homePage.css';

import { Row, Col } from '../../helps/antdComponent';

class HomePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      notice: '',
    };
  }
  navigate = (routerName) => {
    this.router.go(routerName);
  }
  navigateToEditPas = () => {
    this.navigate('/general/editPsd');
  }
  // 登出
  navigateToQuit = async () => {
    await this.http.webHttp.get('/spreadApi/general/logout');
    this.navigate('/general/login');
  }
  // 查看我的代理
  navigateToLookMyAgents = () => {
    this.navigate('/general/myAgents');
  }
  navigateToInviteAgents = () => {
    this.navigate('/general/inviteAgent');
  }
  navigateToLookCommissionRecord = () => {
    this.navigate('/general/commissionRecord');
  }
  navigateToCashMoeny = () => {
    this.navigate('/general/cashMoeny');
  }
  navigateToCashMoenyRecord = () => {
    this.navigate('/general/cashRecord');
  }
  async componentWillMount() {
    const res = await this.http.webHttp.get('/spreadApi/general/getUserInfo');
    if (res.isSuccess) {
      this.props.dispatch({ type: 'general/updateInfo', payload: { ...res.data } });
    }
    const noticeRes = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', { type: 3 });
    if (noticeRes.isSuccess) {
      this.setState({
        notice: noticeRes.data.htmlText,
      });
    }
  }
  onCopy = (val, result) => {
    if (!result || this.helps.isWeixinBrowser()) {
      this.message.info('复制失败，请手动复制链接');
    } else {
      this.message.info('复制成功');
    }
  }
  render() {
    const {
      canCashCount, // 余额（元）
      inviteCode, // 邀请码
      commissionRate, // 当前提成比例
      prizeByExtension, // 推广人数奖励(元)
      openDay, // 开通天数
      commissionByAgent, // 代理充值提成（元）
      commissionOfToday, // 今日提成（元）
      commissionOfYesterDay,
     } = this.props;
    const canCashCountFloat = parseFloat(canCashCount / 100).toFixed(2);
    const commissionByAgentFloat = parseFloat(commissionByAgent / 100);
    const commissionOfTodayFloat = parseFloat(commissionOfToday / 100);
    const commissionOfYesterDayFloat = parseFloat(commissionOfYesterDay / 100);
    const prizeByExtensionFloat = parseFloat(prizeByExtension / 100);
    const { notice } = this.state;
    const noticeHtml = this.helps.createMarkup(notice);
    return (
      <div>
        <Title>合伙人</Title>
        <WingBlank className={`${styles.optionBtnWrap} borderBottom`}>
          <div className={styles.title}></div>
          <FlexRow>
            <div className={styles.optionBtn} onClick={this.navigateToEditPas}>修改密码</div>
            <div className={styles.optionBtn} onClick={this.navigateToQuit}>退出</div>
          </FlexRow>
        </WingBlank>
        {
          notice
          && <WingBlank className={`${styles.itemContainer}`}>
          <p className={styles.noticeTitle}>公告通知：</p>
          <p className={styles.notice} dangerouslySetInnerHTML={noticeHtml} />
          </WingBlank>
        }
        <WhiteSpace />
        <div className={`${styles.itemContainer}`}>
          <Row className={styles.inviteWrap}>
            <Col xs={24} sm={12} className={styles.inviteOptionWrap}>
              <FlexRowBetween className={styles.inviteCodeOptionWrap}>
                <WingBlank>邀请码:{inviteCode}</WingBlank>
                <WingBlank>
                  <CopyToClipboard
                    text={inviteCode}
                    onCopy={this.onCopy}
                  >
                    <Button className={styles.copyBtn}>复制</Button>
                  </CopyToClipboard>
                </WingBlank>
              </FlexRowBetween>
            </Col>
            <Col xs={24} sm={12} className={styles.inviteOptionWrap} style={{ border: 'none' }}>
              <FlexRow className={styles.agentOptionBtnWrap}>
                <div className={`${styles.agentOptionBtn} ${styles.phoneBorderRight}`} onClick={this.navigateToLookMyAgents}>我的下级代理</div>
                <div className={styles.agentOptionBtn} onClick={this.navigateToInviteAgents}>邀请成为代理</div>
              </FlexRow>
            </Col>
          </Row>
        </div>
        <WhiteSpace />
        <Row className={styles.itemContainer}>
          <Col xs={24} sm={12} className={styles.borderDashRight}>
            <WingBlank className={styles.prizeWrap}>
              <TitleIcon />代理充值提成
              <p><span className={styles.priceMoeny}>{commissionByAgentFloat}</span>元</p>
              <p className={styles.commissionTip}>
                当前提成比例：<span className={styles.commissionCountText}>{commissionRate}%</span>
                (开通天数：<span className={styles.commissionCountText}>{openDay}</span>天)
              </p>
            </WingBlank>
            <div className={styles.prizeWrap}>
              <FlexRow>
                <div className={styles.priceItem}>今日提成：<span className="moneyColor">{ commissionOfTodayFloat }元</span></div>
                <div className={styles.priceItem}>昨日提成：<span className="moneyColor">{ commissionOfYesterDayFloat }元</span></div>
                <div className={styles.priceItem} style={{ border: 'none' }}>
                  <Button onClick={this.navigateToLookCommissionRecord}>更多记录</Button>
                </div>
              </FlexRow>
            </div>
          </Col>
          <Col xs={24} sm={12} style={{ background: '#f8f8f8' }}>
            <WhiteSpace className={styles.priceWhiteSpace} />
            <WingBlank className={styles.priceModuleWrap}>
              <TitleIcon /><span>推广人数奖励</span>
              <p><span className={styles.priceMoeny}>{ prizeByExtensionFloat }</span>元</p>
            </WingBlank>
          </Col>
        </Row>
        <WhiteSpace />
        <Row className={styles.itemContainer}>
          <Col xs={24} sm={12}>
            <WingBlank>
              <FlexRowBetween className={styles.cashWrap}>
                <div>余额：<span className="moneyColor">{canCashCountFloat}元</span></div>
                <div style={{ marginLeft: 10 }}>
                  <Button className={styles.cashBtn} onClick={this.navigateToCashMoeny}>提现</Button>
                  <Button className={styles.cashBtn} onClick={this.navigateToCashMoenyRecord}>提现记录</Button>
                </div>
              </FlexRowBetween>
            </WingBlank>
          </Col>
        </Row>
        <WhiteSpace />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.general,
  };
}

export default connect(mapStateToProps)(HomePage);
