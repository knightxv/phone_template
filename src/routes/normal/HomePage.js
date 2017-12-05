import React from 'react';
import { connect } from 'dva';

// import { NoticeBar, WhiteSpace, Icon } from 'antd-mobile';
// import PropTypes from 'prop-types';
import BaseComponent from '@/helps/BaseComponent';
import { NavBar, NoticeBar, Icon } from '@/helps/antdComponent';
import { Title, WhiteSpace, FlexRowBetweenWingSpace, FlexRow, Avatar, IconImg } from '@/helps/styleComponent';
import styles from './HomePage.css';

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
      hasPowerToBanlance: this.hasPower('proxySDKCharge'), // 账户余额
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
  pickerToggle = () => {
    this.setState({
      navbarRightPickerShow: !this.state.navbarRightPickerShow,
    });
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
    const { inviteCode, masonry, canCashCount, ranking, myUnderAgentCount,
    myPlayerCount, saleDiamondsOfThisMonth, masonryIncomeToday, masonryPayToday,
    balanceIncomeToday, balancePayToday, savePlayerCount, saveAgentCount,
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
    } = power;
    
    return (<div style={{ position: 'relative' }}>
      <Title>代理中心</Title>
      <NavBar
        title="代理中心"
        right={<Icon type='ellipsis' onClick={this.pickerToggle} />}
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
      <WhiteSpace />
      <div className={styles.module}>
        <FlexRowBetweenWingSpace className={styles.borderBottom}>
          <div className={styles.titleWrap}>
            我的排名:<span className={styles.colorBlue}>{ isRankingShow ? ranking : '未上榜'}</span>
          </div>
          {
            priceInfoVisible && <p className={styles.colorBlue} onClick={() => this.navigate('/rankExplain')}>奖励规则</p>
          }
        </FlexRowBetweenWingSpace>
        <FlexRow className={styles.userInfoWrap}>
          <Avatar className={styles.userAvatar} />
          <div className={styles.userInfo}>
            <p className={styles.saleDiamondsOfThisMonthLabel}>
              本月销钻数量：<span className={styles.saleDiamondsLabel}>{saleDiamondsOfThisMonth || 0}</span>
            </p>
            <p>邀请码：{inviteCode}</p>
          </div>
        </FlexRow>
<<<<<<< HEAD
        <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/myUnderAgent')}>
          <FlexRow className={styles.navigateTitleWrap}>
            <IconImg className={styles.titleIconImg} src={IconSource.xiajiguanli} />
            <span>我的下级代理</span>
          </FlexRow>
          <FlexRow className={styles.titleWrap}>
            <p>{myUnderAgentCount}人</p>
            <Icon type="right" />
          </FlexRow>
        </FlexRowBetweenWingSpace>
        <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/MyPlayer')}>
          <FlexRow className={styles.navigateTitleWrap}>
            <IconImg className={styles.titleIconImg} src={IconSource.wanjiachongzhi} />
            <span>我的玩家</span>
          </FlexRow>
          <FlexRow className={styles.titleWrap}>
            <p>{myPlayerCount}人</p>
            <Icon type="right" />
          </FlexRow>
        </FlexRowBetweenWingSpace>
=======
        {/* 我的代理功能 */}
        {
          hasPowerToUnderAgent &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/myUnderAgent')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.xiajiguanli} />
              <span>我的下级代理</span>
            </FlexRow>
            <FlexRow className={styles.titleWrap}>
              <p>{myUnderAgentCount}人</p>
              <Icon type="right" />
            </FlexRow>
          </FlexRowBetweenWingSpace>
        }
        {
          havePowerToSaveAgent &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('/mySaveAgent')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.xiajiguanli} />
              <span>我收藏的代理</span>
            </FlexRow>
            <FlexRow className={styles.titleWrap}>
              <p>{saveAgentCount || 0}人</p>
              <Icon type="right" />
            </FlexRow>
          </FlexRowBetweenWingSpace>
        }
        {/* 我的玩家 */}
        {
          hasPowerToUnderPlayer &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('MyPlayer')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.wanjiachongzhi} />
              <span>我的玩家</span>
            </FlexRow>
            <FlexRow className={styles.titleWrap}>
              <p>{myPlayerCount}人</p>
              <Icon type="right" />
            </FlexRow>
          </FlexRowBetweenWingSpace>
        }
        {/* 收藏玩家功能 */}
        {
          havePowerToSavePlayer &&
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.goToSelectGame('/mySavePlayer')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.wanjiachongzhi} />
              <span>我收藏的玩家</span>
            </FlexRow>
            <FlexRow className={styles.titleWrap}>
              <p>{savePlayerCount || 0}人</p>
              <Icon type="right" />
            </FlexRow>
          </FlexRowBetweenWingSpace>
        }
        
>>>>>>> 2.0.2
      </div>
      <WhiteSpace />
      <div className={styles.module}>
        <FlexRowBetweenWingSpace className={styles.titleWrap}>
          <FlexRow><TitleIcon /><span>钻石数量</span></FlexRow>
          <div className={styles.colorBlue} onClick={() => this.navigate('/masonryDerail')}>交易明细</div>
        </FlexRowBetweenWingSpace>
        <div className={styles.masonryCountLable}>
          <FlexRow>
            <span className={styles.count}>{masonry}</span>
            <span>(个)</span>
          </FlexRow>
          <div className={styles.masonryInfoWrap}>
            <p className={styles.masonryInfo}>今日收入:<span className={styles.count}>{masonryIncomeToday}</span>个</p>
            <p className={styles.masonryInfo}>今日支出:<span className={styles.count}>{masonryPayToday}</span>个</p>
          </div>
        </div>
        {
          havePowerToRecharge
          ? <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/agencyPay')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.zuanshi} />
              <span>购买钻石</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
          : null
        }
      </div>
      <WhiteSpace />
      {/* 账户余额 */}
      {
        hasPowerToBanlance &&
        <div className={styles.module}>
          <FlexRowBetweenWingSpace className={styles.titleWrap}>
            <FlexRow><TitleIcon /><span>账户余额</span></FlexRow>
            <div className={styles.colorBlue} onClick={() => this.navigate('/cashMoneyRecord')}>交易明细</div>
          </FlexRowBetweenWingSpace>
          <div className={styles.masonryCountLable}>
            <div>
              <span className={styles.countLabel}>￥:</span><span className={styles.count}>{unitCanCashCount}</span>
            </div>
            <div className={styles.masonryInfoWrap}>
              <p className={styles.masonryInfo}>
                今日收入￥<span className={styles.count}>{unitBalanceIncomeToday}</span>
              </p>
              <p className={styles.masonryInfo}>
                今日支出￥<span className={styles.count}>{unitBalancePayToday}</span>
              </p>
            </div>
          </div>
          <FlexRowBetweenWingSpace className={styles.borderBottom} onClick={() => this.navigate('/cashMoney')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.tixian} />
              <span>提现</span>
            </FlexRow>
            <Icon type="right" />
          </FlexRowBetweenWingSpace>
        </div>
      }
      {
        navbarRightPickerShow && <div className={styles.pickerWrap} onClick={this.pickerToggle}>
          <div className={styles.navbarOption}>
            <div className={styles.navbarOptionItem} onClick={this.editPas}>修改密码</div>
            <div className={styles.navbarOptionItem} onClick={this.logout}>退出</div>
          </div>
        </div>
      }
    </div>);
  }
}
HomePage.propTypes = {
};

const TitleIcon = () => {
  return <span className={styles.titleIcon} />;
};

const mapStateToProps = (state) => {
  return {
    ...state.agent,
  };
};

export default connect(mapStateToProps)(HomePage);

/*

*/
