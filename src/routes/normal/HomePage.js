import React from 'react';
import { connect } from 'dva';

// import PropTypes from 'prop-types';
import BaseComponent from '@/helps/BaseComponent';
import { NavTitle, BaseFont, Title } from '@/helps/styleComponent';
import styles from './HomePage.css';

// import { htmlTextType } from '../utils/typeDefine';

const funcList = [
  {
    router: '/PlayerPayManage',
    name: '下线充值管理',
  },
  {
    router: '/PlayerMoneyRecord',
    name: '会员充值记录',
  },
  {
    router: '/AgencyPay',
    name: '钻石充值',
  },
  {
    router: '/AgencyMoneyRecord',
    name: '充值记录',
  },
  {
    router: '/AgencyExtractMoney',
    name: '余额提现',
  },
  {
    router: '/AgencyExtractMoneyRecord',
    name: '余额提现记录',
  },
  {
    router: '/SecondaryAgencyRecord',
    name: '我的下级代理',
  },
  {
    router: '/EditAgencyPsd',
    name: '修改密码',
  },
];

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
    };
  }
  async componentWillMount() {
    // 获取个人数据
    const res = await this.helps.webHttp.get('/spreadApi/getUserInfo');
    if (res.isSuccess) {
      this.props.dispatch({ type: 'agent/updateAppInfo', payload: res.data });
      this.setState({
        loaded: true,
      });
    } else {
      this.helps.toast(res.info);
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
  render() {
    const { loaded, noticeInfo, priceInfoVisible } = this.state;
    const noticeVisible = !!noticeInfo;
    const { inviteCode, masonry, rechargeOfToday, rechargeOfYesterDay, canCashCount, cashCountlog, ranking } = this.props;
    if (!loaded) {
      return null;
    }
    const isRankingShow = ranking && ranking <= rankingLimit; // 当排行小于50
    const unitRechargeOfToday = parseFloat(rechargeOfToday / 100);
    const unitRechargeOfYesterDay = parseFloat(rechargeOfYesterDay / 100);
    const unitCashCountlog = parseFloat(cashCountlog / 100);
    const unitCanCashCount = parseFloat(canCashCount / 100);
    return (<div>
      <Title>阿当代理中心</Title>
      <NavTitle
        className="G_borderBottom"
        style={{ position: 'fixed', background: '#fff', width: '100%' }}
      >
        您的邀请码：<span style={{ color: 'red', fontSize: '26px' }}>{inviteCode}</span>
      </NavTitle>
      <div style={{ height: 50 }} />
      {
        (<BaseFont className={styles.navInfoTip}>
          {
          isRankingShow
          ? (<span>月销钻<span className={styles.rankTip}>排名为第{ranking}名</span></span>)
          : (<span>当月销钻石<span className={styles.rankTip}>排名为50名之后</span></span>)
        }
        {
          priceInfoVisible && (<a href="javascript:;" onClick={() => this.navigate('/RankExplain')}>（点击查看奖励说明）</a>)
        }
        </BaseFont>
        )
      }
      {
        noticeVisible
        && (
          <BaseFont className={styles.notice} dangerouslySetInnerHTML={this.helps.createMarkup(noticeInfo)} />
        )
      }
      {
        funcList.map((item, i) => {
          return (<BaseFont
            key={i}
            className={styles.funItem}
            onClick={() => this.navigate(item.router)}
          >
            {item.name}
          </BaseFont>
          );
        })
      }
      <BaseFont className={styles.funItem}>钻石:<Count>{masonry}</Count></BaseFont>
      <BaseFont className={styles.funItem}>玩家今日充值:<Count>{unitRechargeOfToday}</Count></BaseFont>
      <BaseFont className={styles.funItem}>玩家昨日充值:<Count>{unitRechargeOfYesterDay}</Count></BaseFont>
      <BaseFont className={styles.funItem}>已提现:<Count>{unitCashCountlog}</Count></BaseFont>
      <BaseFont className={styles.funItem}>未提现:<Count>{unitCanCashCount}</Count></BaseFont>
      <BaseFont className={styles.funItem} onClick={this.logout}>退出</BaseFont>
    </div>);
  }
}
HomePage.propTypes = {
};

const Count = ({ children }) => {
  return <span style={{ color: 'red' }}>{children}</span>;
};

const mapStateToProps = (state) => {
  return {
    ...state.agent,
  };
};

export default connect(mapStateToProps)(HomePage);

/*

*/
