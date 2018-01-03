import React from 'react';
import { connect } from 'dva';

// import { NoticeBar, WhiteSpace, Icon } from 'antd-mobile';
// import PropTypes from 'prop-types';
import BaseComponent from '@/helps/BaseComponent';
import NavBar from '@/helps/antdComponent/NavBar';
import NoticeBar from '@/helps/antdComponent/NoticeBar';
// import Icon from '@/helps/antdComponent/Icon';
import { Button, Icon } from '@/helps/antdComponent/index.js';
import { Title, WhiteSpace, FlexRowBetweenWingSpace, FlexRow, Avatar, IconImg } from '@/helps/styleComponent';
import styles from './HomePage.less';

// import { htmlTextType } from '../utils/typeDefine';
const IconSource = {
  buyDia: require('../../assets/buyDia.png'),
  turnDia_agent: require('../../assets/turnDia_agent.png'),
  turnDia_play: require('../../assets/turnDia_play.png'),
  invite: require('../../assets/invite.png'),
  bank: require('../../assets/bank.png'),
  fanli: require('../../assets/fanli.png'),
  notice: require('../../assets/gg.png'),
};

const rankingLimit = 50; // 控制排行是否显示

class HomePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isTipShow: false, // 是否显示提示
      noticeInfo: '', // 公告信息
      priceInfoVisible: false, // 奖励说明是否显示
    };
  }
  powerManage = () => {
    return {
      havePowerToBanlance: this.hasPowerSome('banlance'),
      havePowerToRechargeToPlayer: this.hasPowerSome('AgentTurnDiaToPlayerDirect', 'wechatPayForAgentTurnDiaToPlayer', 'AliPayForAgentTurnDiaToPlayer'),
      havePowerToRechargeToAgent: this.hasPower('iAgentTurnDiaToAgent'),
      havePowerToBuyDia: this.hasPowerSome('AgentBuyDiawechatPay', 'AgentBuyDiaAliPay', 'AgentBuyDiabanlancePay'), // 是否有购买钻石的权限
    };
  }
  async componentWillMount() {
    // const { powerList } = this.props;
    // 获取个人数据
    const res = await this.http.webHttp.get('/spreadApi/getUserInfo');
    if (res.isSuccess) {
      this.props.dispatch({ type: 'agent/updateAppInfo',
        payload: {
          ...res.data,
        } });
    } else {
      this.message.info(res.info);
      return;
    }
    const params = { type: this.Enum.htmlTextType.notice_normalAgency };
    // 获取首页额外数据
    const extraRes = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', params);
    if (extraRes.isSuccess) {
      // const { rankTipVisible, noticeVisible, noticeInfo } = res.data;
      this.setState({
        noticeInfo: extraRes.data.htmlText,
      });
    }
    // 获取奖励说明
    const priceStatu = this.Enum.htmlTextType.page_prizeExplain;
    const priceRes = await this.http.webHttp.get('/ddm/phone/api/getHtmlText', { type: priceStatu });
    if (priceRes.isSuccess && priceRes.data.htmlText) {
      this.setState({
        priceInfoVisible: true,
      });
    }
  }
  navigate = (touterName) => {
    this.router.go(touterName);
  }
  logout = async () => {
    await this.http.webHttp.get('/spreadApi/logout');
    this.navigate('/login');
  }
  // 跳转到公告详情
  navigateNotice = async () => {
    this.navigate('/noticeDetail');
  }
  editPas = () => {
    this.navigate('/EditAgencyPsd');
  }
  // 跳到我的玩家
  goToSelectGame = async (routerName) => {
    const res = await this.http.webHttp.get('/spreadApi/getGameList');
    if (res.isSuccess) {
      if (res.data && res.data.length === 1) {
        const serverid = res.data[0].serverid;
        this.router.go(routerName, {
          serverid,
        });
      } else {
        this.router.go('/selectGame', {
          redirect: routerName,
        });
      }
    }
  }
  render() {
    const { noticeInfo, priceInfoVisible } = this.state;
    const notiveInfoHtml = this.helps.createMarkup(noticeInfo);
    const noticeVisible = !!noticeInfo;
    const { inviteCode, canCashCount, ranking, masonry, saleDiamondsOfThisMonth,
    // balancePayToday, savePlayerCount, saveAgentCount, myUnderAgentCount, myPlayerCount,
    // masonryIncomeToday, masonryPayToday, balanceIncomeToday,
    // rechargeOfToday, rechargeOfYesterDay, cashCountlog,
    } = this.props;
    const isRankingShow = ranking && ranking <= rankingLimit; // 当排行小于50
    const unitCanCashCount = this.helps.parseFloatMoney(canCashCount); // 未提现(余额)
    // const unitRechargeOfToday = parseFloat(rechargeOfToday / 100); // 玩家今日充值
    // const unitRechargeOfYesterDay = parseFloat(rechargeOfYesterDay / 100); // 玩家昨日充值
    // const unitCashCountlog = parseFloat(cashCountlog / 100); // 已提现
    // const unitBalanceIncomeToday = this.helps.parseFloatMoney(balanceIncomeToday);
    // const unitBalancePayToday = this.helps.parseFloatMoney(balancePayToday);
    const power = this.powerManage();
    // 权限
    const {
      havePowerToRechargeToPlayer,
      havePowerToRechargeToAgent,
      havePowerToBuyDia,
      havePowerToBanlance,
    } = power;

    return (<div>
      <Title>代理中心</Title>
      <NavBar
        title="代理中心"
      />
      {
        noticeVisible
        && <NoticeBar
          onClick={this.navigateNotice}
        >
          <FlexRow>
            <span dangerouslySetInnerHTML={notiveInfoHtml} />
          </FlexRow>
        </NoticeBar>
      }
      <div className={styles.headerModule}>
        <FlexRowBetweenWingSpace>
          <div className={styles.titleWrap}>
              我的排名:<span className={styles.rankColor}>{ isRankingShow ? ranking : '未上榜'}</span>
          </div>
          {
            priceInfoVisible && <p className={styles.prizeLabel} onClick={() => this.navigate('/rankExplain')}>奖励规则</p>
          }
        </FlexRowBetweenWingSpace>
        <FlexRow className={styles.userInfoWrap}>
          <Avatar className={styles.userAvatar} />
          <div className={styles.userInfo}>
            <p className={styles.saleDiamondsOfThisMonthLabel}>
              本月销钻数量：<span className={styles.saleDiamondsLabel}>{saleDiamondsOfThisMonth || 0}</span>
            </p>
            <p>ID：{inviteCode}</p>
          </div>
        </FlexRow>
      </div>
      <div className={styles.countContainer}>
        <div className={styles.countWrap}>
          钻石：<span className={styles.countLabel}>{ masonry }</span>个
        </div>
        {
          havePowerToBanlance &&
          <div className={styles.countWrap}>
            余额：<span className={styles.countLabel}>{ unitCanCashCount }</span>元
          </div>
        }
      </div>
      <div className={styles.module}>
        {/* 购买钻石 */}
        {
          havePowerToBuyDia &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/agencyPay')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.buyDia} />
              <span>购买钻石</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
        }
        {/* 代理阶梯返利 */}
        {
          havePowerToBuyDia &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/stepRebate')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.fanli} />
              <span>代理阶梯返利</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
        }
        {/* 给玩家充钻 */}
        {
          havePowerToRechargeToPlayer &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('/turnDiaForPlayer')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.turnDia_play} />
              <span>给玩家充钻</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{savePlayerCount || 0}人</p>
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }
        {/* 给代理充钻 */}
        {
          havePowerToRechargeToAgent &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/turnDiaForAgent')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.turnDia_agent} />
              <span>给代理充钻</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{saveAgentCount || 0}人</p>
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }

        {/* 钻石变化记录 */}
        {/* {
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/masonryDerail')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.wanjiachongzhi} />
              <span>钻石变化记录</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
        } */}
      </div>
      { havePowerToBanlance && <WhiteSpace /> }
      { havePowerToBanlance &&
        <div className={styles.module}>
          {/* 提现 */}
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/cashMoney')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.bank} />
              <span>提现</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
        </div>
      }
      <WhiteSpace />
      <div className={styles.module}>
        {/* 邀请成为我的下级代理 */}
        <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/inviteToAgent')}>
          <FlexRow className={styles.navigateTitleWrap}>
            <IconImg className={styles.titleIconImg} src={IconSource.invite} />
            <span>邀请成为我的下级代理</span>
          </FlexRow>
          <Icon type="right" />
          {/* <FlexRow className={styles.titleWrap}>
            <Icon type="right" />
          </FlexRow> */}
        </FlexRowBetweenWingSpace>
        {/* 查看下级钻石抽成情况 */}
        {
          this.hasPower('underAgentPercentage') &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/myUnderAgent')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.fanli} />
              <span>查看下级钻石抽成情况</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{myUnderAgentCount}人</p>
              <Icon type="right" />
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }
      </div>
      <div className={styles.btnContainer}>
        <div className={styles.btnWrap}>
          <Button className={styles.optionEditBtn} onClick={this.editPas}>修改密码</Button>
        </div>
        <div className={styles.btnWrap}>
          <Button type="danger" className={styles.optionQuitBtn} onClick={this.logout}>退出</Button>
        </div>
      </div>

    </div>);
  }
}
HomePage.propTypes = {
};

// const TitleIcon = () => {
//   return <span className={styles.titleIcon} />;
// };

const mapStateToProps = (state) => {
  return {
    ...state.agent,
  };
};

export default connect(mapStateToProps)(HomePage);
