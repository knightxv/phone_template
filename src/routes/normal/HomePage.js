import React from 'react';
import { connect } from 'dva';

import BaseComponent from '@/core/BaseComponent';
import { ActionSheet } from 'antd-mobile';
import querystring from 'querystring';
// import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import NoticeBar from '@/components/antdComponent/NoticeBar';
import { Button, Icon, Modal, NavBar } from '@/components/lazyComponent/antd';
// import {} from ''
import Avatar from '@/components/Avatar';
import { Title, FlexRowBetweenWingSpace, FlexRow, IconImg } from '@/components/styleComponent';
import styles from './HomePage.less';
import wechatSdkManage from '../../extends/wechatSdk';


// import { htmlTextType } from '../utils/typeDefine';
const IconSource = {
  buyDia: require('../../assets/buyDia.png'),
  turnDia_agent: require('../../assets/turnDia_agent.png'),
  turnDia_play: require('../../assets/turnDia_play.png'),
  invite: require('../../assets/invite.png'),
  invite_player: require('../../assets/invite_player.png'),
  bank: require('../../assets/bank.png'),
  fanli: require('../../assets/fanli.png'),
  xjfl: require('../../assets/xjfl.png'),
  notice: require('../../assets/gg.png'),
  sys: require('../../assets/share_code.png'),
  link: require('../../assets/share_link.png'),
  share: require('../../assets/share_friend.png'),
  shareAgent: require('../../assets/shareAgent.png'),
  sharePlayer: require('../../assets/sharePlayer.png'),
  ewfl: require('../../assets/ewfl.png'),
};

class HomePage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isTipShow: false, // 是否显示提示
      noticeInfo: '', // 公告信息
      priceInfoVisible: false, // 奖励说明是否显示
      shareAgentVisible: false, // 分享代理的图片
      sharePlayerVisible: false, // 分享玩家的图片
      isShowNotice: false, // 是否显示公告
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
    // 连接socket
    this.socketManage.sendMsg(res.data.inviteCode);
    this.socketManage.on(this.socketManage.EventType.ReLoadAgentInfo, async () => {
      const updateRes = await this.http.webHttp.get('/spreadApi/getUserInfo');
      if (updateRes.isSuccess) {
        this.props.dispatch({ type: 'agent/updateAppInfo',
          payload: {
            ...updateRes.data,
          },
        });
      }
    });
    // 获取首页额外数据
    const params = { type: this.Enum.htmlTextType.notice_normalAgency };
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
    this.socketManage.off(this.socketManage.EventType.ReLoadAgentInfo);
    await this.http.webHttp.get('/spreadApi/logout');
    this.navigate('/login');
  }
  // // 跳转到公告详情
  // navigateNotice = async () => {
  //   this.navigate('/noticeDetail');
  // }
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
  copyResult = (text, result) => {
    if (result && !this.helps.isWechat) {
      this.message.info('复制成功');
    } else {
      this.message.info('复制失败，当前浏览器不支持复制');
    }
  }
  showShareAgentAction = () => {
    const { inviteCode } = this.props;
    const winLoc = window.location;
    const origin = winLoc.origin;
    const pathname = winLoc.pathname;
    const inviteLink = `${origin}${pathname}#/inviteAgentMiddle?pCode=${inviteCode}`;
    const dataList = [
      {
        icon: <img
          className={styles.shareIcon}
          onClick={() => this.navigate('/inviteToAgent')}
          src={IconSource.sys}
        />,
        title: '查看二维码',
      },
      {
        icon: <CopyToClipboard
          text={inviteLink}
          onCopy={this.copyResult}
        >
          <img className={styles.shareIcon} src={IconSource.link} />
        </CopyToClipboard>,
        title: '复制链接',
      },
    ];
    if (this.helps.isWeixinBrowser()) {
      dataList.push({
        icon: <img onClick={this.shareAgentLink} className={styles.shareIcon} src={IconSource.share} />,
        title: '分享链接',
      });
    }
    ActionSheet.showShareActionSheetWithOptions({
      options: dataList,
      // title: 'title',
      message: '邀请下级代理',
    });
  }
  // 分享代理链接
  shareAgentLink = async () => {
    let serverInfo = this.props.serverInfo;
    const { inviteCode } = this.props;
    if (!serverInfo || serverInfo.length < 1) {
      const res = await this.http.webHttp.get('/spreadApi/getPlatformInfo');
      if (res.isSuccess) {
        serverInfo = res.data.serverInfo;
      } else {
        this.message.info('网络异常,请重试');
      }
      if (!serverInfo || serverInfo.length < 1) {
        this.message.info('没有可选的游戏');
        this.router.go('/login');
        return;
      }
    }
    const gameInfo = serverInfo[0];
    const { accountServerIP, accountServerPort, weChatMPID, serverID } = gameInfo;
    const gameListRes = await this.http.webHttp.get('/spreadApi/getGameList');
    if (!gameListRes.isSuccess) {
      this.message.info('获取游戏失败');
      return;
    }
    let gameName = '';
    const isFindGame = gameListRes.data.some((game) => {
      if (game.serverid == serverID) {
        gameName = game.gameName;
        return true;
      }
      return false;
    });
    if (!isFindGame && gameListRes.data[0]) {
      gameName = gameListRes.data[0].gameName;
    }
    if (!gameName) {
      this.message.info('没有可选的游戏');
      return;
    }
    const origin = window.location.origin;
    const noPortOrigin = origin.replace(/:\d+/, '');
    const inviteLink = `http://${accountServerIP}:${accountServerPort}/WeChatAuthorize?ddmmp=${weChatMPID}&redirect=${origin}/generalManage/wechat.html&reqdeleInviter=${inviteCode}&actionType=inviteProxy`;
    const queryLink = {
      redirect: inviteLink,
    };
    const linkQueryStr = querystring.stringify(queryLink);
    const shareInfo = {
      title: `${gameName}诚招代理`,
      link: `${noPortOrigin}/generalManage/redirect.html?${linkQueryStr}`,
      imgUrl: `${noPortOrigin}/generalManage/static/adang_logo.jpg`,
      desc: '高收入、零成本做代理，年薪百万不是梦',
    };
    await wechatSdkManage.shareLink(shareInfo);
    this.toggleShareAgentImg();
  }
  // 分享玩家链接
  sharePlayerLink = async () => {
    const { inviteCode } = this.props;
    let serverInfo = this.props.serverInfo;
    if (!serverInfo || serverInfo.length < 1) {
      const res = await this.http.webHttp.get('/spreadApi/getPlatformInfo');
      if (res.isSuccess) {
        serverInfo = res.data.serverInfo;
      } else {
        this.message.info('网络异常,请重试');
      }
      if (!serverInfo || serverInfo.length < 1) {
        this.message.info('没有可选的游戏');
        return;
      }
    }
    const origin = window.location.origin;
    const noPortOrigin = origin.replace(/:\d+/, '');
    const gameInfo = serverInfo[0];
    const { accountServerIP, accountServerPort, appDownLoadUrl, weChatMPID, gameID, serverID } = gameInfo;
    const inviteLink = `http://${accountServerIP}:${accountServerPort}/WeChatAuthorize?ddmmp=${weChatMPID}&redirect=${appDownLoadUrl}?gameID=${gameID}&reqdeleInviter=${inviteCode}&actionType=invitePlayer`;
    const queryLink = {
      redirect: inviteLink,
    };
    const linkQueryStr = querystring.stringify(queryLink);
    const gameListRes = await this.http.webHttp.get('/spreadApi/getGameList');
    if (!gameListRes.isSuccess) {
      this.message.info('获取游戏失败');
      return;
    }
    let gameName = '';
    let gameIcon = '';
    const isFindGame = gameListRes.data.some((game) => {
      if (game.serverid == serverID) {
        gameName = game.gameName;
        gameIcon = game.gameIcon;
        return true;
      }
      return false;
    });
    if (!isFindGame && gameListRes.data[0]) {
      gameName = gameListRes.data[0].gameName;
      gameIcon = gameListRes.data[0].gameIcon;
    }
    if (!gameName) {
      this.message.info('没有可选的游戏');
      return;
    }
    const shareInfo = {
      title: `快来玩${gameName}吧~`,
      link: `${noPortOrigin}/generalManage/redirect.html?${linkQueryStr}`,
      imgUrl: gameIcon || `${noPortOrigin}/generalManage/static/adang_logo.jpg`,
      desc: '平台稳定绝无外挂',
    };
    await wechatSdkManage.shareLink(shareInfo);
    this.toggleSharePlayertImg();
    // const query = querystring.stringify(shareQuery);
    // window.location.href = `http://res.ddmh5.com:81/wechatShare/index.html?${query}`;
  }
  showSharePlayerAction = async () => {
    const { inviteCode } = this.props;
    let serverInfo = this.props.serverInfo;
    if (!serverInfo || serverInfo.length < 1) {
      const res = await this.http.webHttp.get('/spreadApi/getPlatformInfo');
      if (res.isSuccess) {
        serverInfo = res.data.serverInfo;
      } else {
        this.message.info('网络异常,请重试');
      }
      if (!serverInfo || serverInfo.length < 1) {
        this.message.info('没有可选的游戏');
        return;
      }
    }
    const gameInfo = serverInfo[0];
    const { accountServerIP, accountServerPort, appDownLoadUrl, weChatMPID, gameID } = gameInfo;
    const inviteLink = `http://${accountServerIP}:${accountServerPort}/WeChatAuthorize?ddmmp=${weChatMPID}&redirect=${appDownLoadUrl}?gameID=${gameID}&reqdeleInviter=${inviteCode}&actionType=invitePlayer`;
    const dataList = [
      {
        icon: <img
          className={styles.shareIcon}
          onClick={() => this.navigate('/inviteToPlayer')}
          src={IconSource.sys}
        />,
        title: '查看二维码',
      },
      {
        icon: <CopyToClipboard
          text={inviteLink}
          onCopy={this.copyResult}
        >
          <img className={styles.shareIcon} src={IconSource.link} />
        </CopyToClipboard>,
        title: '复制链接',
      },
    ];
    if (this.helps.isWeixinBrowser()) {
      dataList.push({
        icon: <img onClick={this.sharePlayerLink} className={styles.shareIcon} src={IconSource.share} />,
        title: '分享链接',
      });
    }
    ActionSheet.showShareActionSheetWithOptions({
      options: dataList,
      // title: 'title',
      message: '邀请下级玩家',
    });
  }
  toggleShareAgentImg = () => {
    this.setState({
      shareAgentVisible: !this.state.shareAgentVisible,
    });
  }
  toggleSharePlayertImg = () => {
    this.setState({
      sharePlayerVisible: !this.state.sharePlayerVisible,
    });
  }
  toggleShowNotice = () => {
    this.setState({
      isShowNotice: !this.state.isShowNotice,
    });
  }
  render() {
    const { noticeInfo, priceInfoVisible, shareAgentVisible, sharePlayerVisible, isShowNotice } = this.state;
    const notiveInfoHtml = this.helps.createMarkup(noticeInfo);
    const noticeVisible = !!noticeInfo;
    const { inviteCode, canCashCount, masonry, userName, avatar, stepRebateAddedRate,
    // balancePayToday, savePlayerCount, saveAgentCount, myUnderAgentCount, myPlayerCount,
    // masonryIncomeToday, masonryPayToday, balanceIncomeToday, saleDiamondsOfThisMonth,
    // rechargeOfToday, rechargeOfYesterDay, cashCountlog, ranking,
    } = this.props;
    const unitCanCashCount = this.helps.parseFloatMoney(canCashCount); // 未提现(余额)
    // const isRankingShow = ranking && ranking <= rankingLimit; // 当排行小于50
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
          onClick={this.toggleShowNotice}
        >
          {/* <FlexRow>
            <span className={styles.noticeLabel} dangerouslySetInnerHTML={notiveInfoHtml} />
          </FlexRow> */}
          <div className={styles.noticeLabel} dangerouslySetInnerHTML={notiveInfoHtml} />
        </NoticeBar>
      }
      <div className={styles.headerModule}>
        <div className={styles.userInfoContainer}>
          <div className={styles.userInfoWrap}>
            <Avatar src={avatar} className={styles.userAvatar} />
            <div className={styles.userInfo}>
              <p className={styles.userNameLabel}>
                { userName || '昵称' }
              </p>
              <p>邀请码：{inviteCode}</p>
            </div>
          </div>
          <div>
            {/* <Icon type="right" /> */}
          </div>
        </div>
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
      <div className={styles.blockContainer}>
        {/* 购买钻石 */}
        {
          havePowerToBuyDia &&
          <div className={styles.itemModule} onClick={() => this.navigate('/agencyPay')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.buyDia} />
              <span>购买钻石</span>
            </FlexRow>
            <Icon type="right" />
          </div>
        }
        {/* 给玩家充钻 */}
        {
          havePowerToRechargeToPlayer &&
          <div className={styles.itemModule} onClick={() => this.goToSelectGame('/turnDiaForPlayer')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.turnDia_play} />
              <span>替玩家购钻</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{savePlayerCount || 0}人</p>
            </FlexRow> */}
          </div>
        }
        {/* 给代理充钻 */}
        {
          havePowerToRechargeToAgent &&
          <div className={styles.itemModule} onClick={() => this.navigate('/turnDiaForAgent')}>
            <FlexRow className={styles.navigateTitleWrap}>
              <IconImg className={styles.titleIconImg} src={IconSource.turnDia_agent} />
              <span>给代理充钻</span>
            </FlexRow>
            <Icon type="right" />
            {/* <FlexRow className={styles.titleWrap}>
              <p>{saveAgentCount || 0}人</p>
            </FlexRow> */}
          </div>
        }
      </div>
      <div className={styles.blockContainer}>
        {/* 邀请成为我的下级代理 */}
        <div className={styles.itemModule} onClick={this.showShareAgentAction}>
          <FlexRow className={styles.navigateTitleWrap}>
            <IconImg className={styles.titleIconImg} src={IconSource.invite} />
            <span>邀请下级代理</span>
          </FlexRow>
          <Icon type="right" />
        </div>
        {/* 邀请成为我的下级玩家 */}
        <div className={styles.itemModule} onClick={this.showSharePlayerAction}>
          <FlexRow className={styles.navigateTitleWrap}>
            <IconImg className={styles.titleIconImg} src={IconSource.invite_player} />
            <span>邀请下级玩家</span>
          </FlexRow>
          <Icon type="right" />
        </div>
      </div>
      {/* 代理阶梯返利 */}
      {
        (this.hasPower('stepRebate') || this.hasPower('underAgentPercentage')) &&
        <div className={styles.blockContainer}>
          {
            this.hasPower('stepRebate') &&
            <div>
              <div className={styles.itemModule} onClick={() => this.navigate('/stepRebate')}>
                <FlexRow className={styles.navigateTitleWrap}>
                  <IconImg className={styles.titleIconImg} src={IconSource.fanli} />
                  <span>代理阶梯返利</span>
                </FlexRow>
                <Icon type="right" />
              </div>
              {
                stepRebateAddedRate != 0 &&
                (<div className={styles.itemModule} onClick={() => this.navigate('/stepRebateAdded')}>
                  <FlexRow className={styles.navigateTitleWrap}>
                    <IconImg className={styles.titleIconImg} src={IconSource.ewfl} />
                    <span>代理阶梯返利额外返点</span>
                  </FlexRow>
                  <Icon type="right" />
                </div>)
              }
            </div>
          }
          {
            this.hasPower('underAgentPercentage') &&
            <div className={styles.itemModule} onClick={() => this.navigate('/myUnderAgent')}>
              <FlexRow className={styles.navigateTitleWrap}>
                <IconImg className={styles.titleIconImg} src={IconSource.xjfl} />
                <span>查看下级钻石抽成情况</span>
              </FlexRow>
              <Icon type="right" />
            </div>
          }
        </div>
        }
      {/* 提现 */}
      {
        havePowerToBanlance &&
        (<div>
          <div className={styles.blockContainer}>
            <div className={styles.itemModule} onClick={() => this.navigate('/cashMoney')}>
              <FlexRow className={styles.navigateTitleWrap}>
                <IconImg className={styles.titleIconImg} src={IconSource.bank} />
                <span>提现</span>
              </FlexRow>
              <Icon type="right" />
            </div>
          </div>
        </div>)
      }
      <div className={styles.btnContainer}>
        <div className={styles.btnWrap}>
          <Button className={styles.optionEditBtn} onClick={this.editPas}>修改密码</Button>
        </div>
        <div className={styles.btnWrap}>
          <Button type="danger" className={styles.optionQuitBtn} onClick={this.logout}>安全退出</Button>
        </div>
      </div>
      {/* 分享代理 */}
      <Modal
        transparent
        maskClosable
        className={styles.payModal}
        visible={shareAgentVisible}
        onClose={this.toggleShareAgentImg}
      >
        <div onClick={this.toggleShareAgentImg} className={styles.payPicker}>
          <img className={styles.shareImg} src={IconSource.shareAgent} />
        </div>
      </Modal>
      {/* 分享玩家 */}
      <Modal
        transparent
        maskClosable
        className={styles.payModal}
        visible={sharePlayerVisible}
        onClose={this.toggleSharePlayertImg}
      >
        <div onClick={this.toggleSharePlayertImg} className={styles.sharePicker}>
          <img className={styles.shareImg} src={IconSource.sharePlayer} />
        </div>
      </Modal>
      {/* 公告 */}
      <Modal
        transparent
        maskClosable
        className={styles.payModal}
        visible={isShowNotice}
        onClose={this.toggleShowNotice}
      >
        <div className={styles.sharePicker}>
          <div className={styles.noticeContainer}>
            <div className={styles.noticeWrap}>
              <div dangerouslySetInnerHTML={notiveInfoHtml} />
            </div>
            <Button type="danger" className={styles.optionQuitBtn} onClick={this.toggleShowNotice}>
              关闭
            </Button>
          </div>
        </div>
      </Modal>
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
    ...state.app,
  };
};

export default connect(mapStateToProps)(HomePage);
