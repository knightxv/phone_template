import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import http from '../utils/http';
import { Toast } from '../utils/help';
import { BackgroundContainer, FlexRow, IconImg, NetImg } from '../utils/styleComponent';
import Banner from '../components/Banner';
import styles from './GameCenter.css';

const iconSource = {
  iconRecommend: require('../resource/recico.png'),
  iconStart: require('../resource/x5.png'),
};


class GameCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: null,
      // {
      //   start: 5, // 5星评价
      //   gameName: '当当比鸡',
      //   gameInfo: '当当比鸡微信/QQ客服：336767',
      //   applyTipInfo: '小伙伴们，成为代理邀请好友，可获得充值提成呦！',
      //   iosShopDownLink: '', // ios苹果id
      //   androidDownLink: '', // 安卓下载链接
      //   iosDownLink: '',
      // }
    };
  }
  async componentWillMount() {
    const gameId = this.props.location.query.gameId;
    const res = await http.get('/ddm/phone/api/gamesList', { gameId }, { type: 'WEB2' });
    if (res.isSuccess) {
      const gameInfo = res.data;
      this.setState({
        gameInfo,
      });
    } else {
      Toast.info(res.message || '游戏不存在');
    }
  }
  // 跳转登录
  navigateTologin = () => {
    this.props.dispatch(routerRedux.push('/login'));
  }
  // 跳转申请
  navigateToRegister = () => {
    this.props.dispatch(routerRedux.push('/register'));
  }
  render() {
    const { gameInfo } = this.state;
    return (
      <BackgroundContainer>
        <Banner />
        {
            gameInfo &&
            (
              <div className={styles.gameItemContainer}>
                {
                  gameInfo.iosShopDownLink
                  ? (
                    <FlexRow className={styles.gameItemWrap}>
                      <NetImg className={styles.gameIcon} src={gameInfo.gameIcon} />
                      <div className={styles.gameInfoWrap}>
                        <FlexRow>
                          <IconImg className={styles.recommendIcon} src={iconSource.iconRecommend} />
                          <a
                            href={gameInfo.iosShopDownLink}
                            className={styles.gameName}
                          >
                            {gameInfo.gameName}[苹果版]
                          </a>
                        </FlexRow>
                        <IconImg className={styles.startIcon} src={iconSource.iconStart} />
                        <div className={styles.gameInfo}>{gameInfo.gameInfo}</div>
                      </div>
                    </FlexRow>
                  )
                  : null
                }
                {
                  gameInfo.androidDownLink
                  ? (
                    <FlexRow className={styles.gameItemWrap}>
                      <NetImg className={styles.gameIcon} src={gameInfo.gameIcon} />
                      <div className={styles.gameInfoWrap}>
                        <FlexRow>
                          <IconImg className={styles.recommendIcon} src={iconSource.iconRecommend} />
                          <a
                            href={gameInfo.androidDownLink}
                            onClick={this.navigateToGameCenter}
                            className={styles.gameName}
                          >
                            {gameInfo.gameName}[安卓版]
                          </a>
                        </FlexRow>
                        <IconImg className={styles.startIcon} src={iconSource.iconStart} />
                        <div className={styles.gameInfo}>{gameInfo.gameInfo}</div>
                      </div>
                    </FlexRow>
                  )
                  : null
                }
                {
                  gameInfo.iosDownLink
                  ? (
                    <FlexRow className={styles.gameItemWrap}>
                      <NetImg className={styles.gameIcon} src={gameInfo.gameIcon} />
                      <div className={styles.gameInfoWrap}>
                        <FlexRow>
                          <IconImg
                            className={styles.recommendIcon}
                            src={iconSource.iconRecommend}
                          />
                          <a
                            href={gameInfo.iosDownLink}
                            onClick={this.navigateToGameCenter}
                            className={styles.gameName}
                          >
                            {gameInfo.gameName}[无苹果ID下载版]
                          </a>
                        </FlexRow>
                        <IconImg className={styles.startIcon} src={iconSource.iconStart} />
                        <div className={styles.gameInfo}>{gameInfo.gameInfo}</div>
                      </div>
                    </FlexRow>
                  )
                  : null
                }
                <FlexRow className={styles.gameItemWrap}>
                  <NetImg className={styles.gameIcon} src={gameInfo.gameIcon} />
                  <div className={styles.gameInfoWrap}>
                    <FlexRow>
                      <IconImg className={styles.recommendIcon} src={iconSource.iconRecommend} />
                      <a
                        href="javascript:;"
                        onClick={this.navigateTologin}
                        className={styles.gameName}
                      >
                        代理中心登录
                      </a>
                    </FlexRow>
                    <IconImg className={styles.startIcon} src={iconSource.iconStart} />
                    <div className={styles.gameInfo}>{gameInfo.applyTipInfo}</div>
                  </div>
                </FlexRow>
                <FlexRow className={styles.gameItemWrap}>
                  <NetImg className={styles.gameIcon} src={gameInfo.gameIcon} />
                  <div className={styles.gameInfoWrap}>
                    <FlexRow>
                      <IconImg className={styles.recommendIcon} src={iconSource.iconRecommend} />
                      <a
                        href="javascript:;"
                        onClick={this.navigateToRegister}
                        className={styles.gameName}
                      >
                        代理自助申请
                      </a>
                    </FlexRow>
                    <IconImg className={styles.startIcon} src={iconSource.iconStart} />
                    <div className={styles.gameInfo}>{gameInfo.applyTipInfo}</div>
                  </div>
                </FlexRow>
              </div>
            )
          }
      </BackgroundContainer>

    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(GameCenter);
