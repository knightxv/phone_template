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
  zuanshi: require('../../assets/czzs.png'),
  xiajiguanli: require('../../assets/gwjcz.png'),
  wanjiachongzhi: require('../../assets/tx.png'),
  tixian: require('../../assets/xjdl.png'),
  notice: require('../../assets/gg.png'),
};

const rankingLimit = 50; // 控制排行是否显示

class HomePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isTipShow: false, // 是否显示提示
      gameList: [],
      loaded: false,
      noticeInfo: '', // 公告信息
      priceInfoVisible: false, // 奖励说明是否显示
      navbarRightPickerShow: false, // 右边的导航栏picker是否显示
    };
  }
  powerManage = () => {
    return {
      havePowerToRecharge: this.hasPower('proxySDKCharge'), // 代理第三方充值(是否有购买钻石的权限)
      havePowerToSavePlayer: this.hasPower('playerSave'), // 玩家收藏
      havePowerToSaveAgent: this.hasPower('agentSave'), // 代理收藏
      hasPowerToUnderPlayer: this.hasPower('myPlayer'), // 我的玩家
      hasPowerToUnderAgent: this.hasPower('myAgent'), // 我的代理
      hasPowerToBanlance: this.hasPower('banlance'), // 账户余额
      hasPowerToRechargeForUnderAgent: this.hasPower('iAgentGiveForAgent'), // 是否可以给下级代理充值
      hasPowerToiAgentGiveForUnderAgent: this.hasPower('iAgentGiveForUnderAgent'), // 是否可以给下级代理充值(囤卡模式)
      
    };
  }
  async componentWillMount() {
    // const { powerList } = this.props;
    // 获取个人数据
    const res = await this.helps.webHttp.get('/spreadApi/getUserInfo');
    if (res.isSuccess) {
      this.props.dispatch({ type: 'agent/updateAppInfo', payload: res.data });
      this.setState({
        loaded: true,
      });
    } else {
      this.helps.toast(res.info);
      return;
    }
    const params = { type: this.TypeDefine.htmlTextType.notice_normalAgency }; // htmlTextType.notice_normalAgency
    // 获取首页额外数据
    const extraRes = await this.helps.webHttp.get('/ddm/phone/api/getHtmlText', params);
    if (extraRes.isSuccess) {
      // const { rankTipVisible, noticeVisible, noticeInfo } = res.data;
      this.setState({
        noticeInfo: extraRes.data.htmlText,
      });
    }
    // 获取奖励说明
    const priceStatu = this.TypeDefine.htmlTextType.page_prizeExplain;
    const priceRes = await this.helps.webHttp.get('/ddm/phone/api/getHtmlText', { type: priceStatu });
    if (priceRes.isSuccess && priceRes.data.htmlText) {
      this.setState({
        priceInfoVisible: true,
      });
    }
  }
  navigate = (touterName) => {
    this.props.dispatch(this.helps.routerRedux.push(touterName));
  }
  logout = async () => {
    await this.helps.webHttp.get('/spreadApi/logout');
    this.props.dispatch(this.helps.routerRedux.push('/login'));
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
    const res = await this.helps.webHttp.get('/spreadApi/getGameList');
    if (res.isSuccess) {
      if (res.data && res.data.length === 1) {
        const serverid = res.data[0].serverid;
        this.props.dispatch(this.helps.routerRedux.push({
          pathname: routerName,
          query: {
            serverid,
          },
        }));
      } else {
        this.props.dispatch(this.helps.routerRedux.push({
          pathname: '/selectGame',
          query: {
            redirect: routerName,
          },
        }));
      }
    }
  }
  render() {
    const { loaded, noticeInfo, navbarRightPickerShow, priceInfoVisible } = this.state;
    const notiveInfoHtml = this.helps.createMarkup(noticeInfo);
    const noticeVisible = !!noticeInfo;
    const { inviteCode, canCashCount, ranking, myUnderAgentCount,
    myPlayerCount, saleDiamondsOfThisMonth, balanceIncomeToday,
    balancePayToday, savePlayerCount, saveAgentCount, masonry, // 钻石
    // masonryIncomeToday, masonryPayToday,
    // rechargeOfToday, rechargeOfYesterDay, cashCountlog,
    } = this.props;
    if (!loaded) {
      return null;
    }
    const isRankingShow = ranking && ranking <= rankingLimit; // 当排行小于50
    // const unitRechargeOfToday = parseFloat(rechargeOfToday / 100); // 玩家今日充值
    // const unitRechargeOfYesterDay = parseFloat(rechargeOfYesterDay / 100); // 玩家昨日充值
    // const unitCashCountlog = parseFloat(cashCountlog / 100); // 已提现
    const unitCanCashCount = this.parseFloatMoney(canCashCount); // 未提现
    const unitBalanceIncomeToday = this.parseFloatMoney(balanceIncomeToday);
    const unitBalancePayToday = this.parseFloatMoney(balancePayToday);
    const power = this.powerManage();
    // 权限
    const {
      havePowerToRecharge,
      havePowerToSavePlayer,
      havePowerToSaveAgent,
      hasPowerToUnderPlayer,
      hasPowerToUnderAgent,
      hasPowerToBanlance,
      hasPowerToRechargeForUnderAgent,
      hasPowerToiAgentGiveForUnderAgent,
    } = power;

    return (<div style={{ position: 'relative' }}>
      <Title>代理中心</Title>
      <NavBar
        title="代理中心"
        className={styles.homePageHeader}
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
          钻石：{ masonry }个
        </div>
        {
          hasPowerToBanlance &&
          <div className={styles.countWrap}>
            余额：{ unitCanCashCount }元
          </div>
        }
      </div>
      <div className={styles.module}>
        {/* 向系统购买钻石 */}
        {
          (havePowerToRecharge || hasPowerToBanlance)
          ? <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/agencyPay')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.zuanshi} />
              <span>向系统购买钻石</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
          : null
        }
        {/* 帮玩家充值钻石 */}
        {
          hasPowerToUnderPlayer &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('MyPlayer')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.wanjiachongzhi} />
              <span>帮玩家充值钻石</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{myPlayerCount}人</p>
              <Icon type="right" />
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }
        
        {/* 给代理转钻 */}
        {
          havePowerToSaveAgent &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('/mySaveAgent')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.xiajiguanli} />
              <span>给代理转钻</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{saveAgentCount || 0}人</p>
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }
        {/* 给下级代理转钻(囤卡模式) */}
        {
          hasPowerToiAgentGiveForUnderAgent &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('/myUnderAgent_transfer')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.xiajiguanli} />
              <span>给下级代理转钻</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{saveAgentCount || 0}人</p>
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }
        {/* 给玩家转钻 */}
        {
          havePowerToSavePlayer &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('/mySavePlayer')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.wanjiachongzhi} />
              <span>给玩家转钻</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{savePlayerCount || 0}人</p>
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }
        {/* 钻石变化记录 */}
        {
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/masonryDerail')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.wanjiachongzhi} />
              <span>钻石变化记录</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <Icon type="right" />
            </FlexRow> */}
          </FlexRowBetweenWingSpace>
        }
      </div>
      { hasPowerToBanlance && <WhiteSpace /> }
      {
        hasPowerToBanlance &&
        <div className={styles.module}>
          {/* 余额申请提现 */}
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/cashMoney')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.tixian} />
              <span>余额申请提现</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
          {/* 余额提现记录 */}
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/cashChangeRecord')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.tixian} />
              <span>余额提现记录</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
          {/* 余额变化记录 */}
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/cashMoneyRecord')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.tixian} />
              <span>余额变化记录</span>
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
            <IconImg className={styles.titleIconImg} src={IconSource.xiajiguanli} />
            <span>邀请成为我的下级代理</span>
          </FlexRow>
          <Icon type="right" />
          {/* <FlexRow className={styles.titleWrap}>
            <Icon type="right" />
          </FlexRow> */}
        </FlexRowBetweenWingSpace>
        {/* 查看下级钻石抽成情况 */}
        {
          hasPowerToUnderAgent &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/myUnderAgent')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.xiajiguanli} />
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
