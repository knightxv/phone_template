import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import Banner from '../components/Banner';
import http from '../utils/http';
import { BackgroundContainer, FlexRow, IconImg, NetImg } from '../utils/styleComponent';
import styles from './ApplyCenter.css';

const iconSource = {
  iconRecommend: require('../resource/recico.png'),
  iconStart: require('../resource/x5.png'),
};

class ApplyCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameList: [],
    };
    this.imgUrlPrefix = window.httpConfig;
  }
  async componentWillMount() {
    const res = await http.get('/ddm/phone/api/games', null, { type: 'WEB2' });
    if (res.isSuccess) {
      this.setState({
        gameList: res.data,
      });
    }
    // console.log(res);
  }
  navigateToGameCenter = (gameId) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/GameCenter',
      query: {
        gameId,
      },
    }));
  }
  render() {
    const { gameList } = this.state;
    return (
      <BackgroundContainer className={styles.normal}>
        <Banner />
        <div className={styles.gameItemContainer}>
          {
            gameList.map((item, i) => (
              <FlexRow className={styles.gameItemWrap} key={`gameItem${i}`}>
                <NetImg className={styles.gameIcon} src={`${item.gameIcon}`} />
                <div className={styles.gameInfoWrap}>
                  <FlexRow>
                    <IconImg className={styles.recommendIcon} src={iconSource.iconRecommend} />
                    <a href="javascript:;" onClick={() => this.navigateToGameCenter(item.gameId)} className={styles.gameName}>进入[{item.gameName}]官网</a>
                  </FlexRow>
                  <IconImg className={styles.startIcon} src={iconSource.iconStart} />
                  <div className={styles.gameInfo}>{item.gameInfo}</div>
                </div>
              </FlexRow>
            ))
          }
        </div>
      </BackgroundContainer>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(ApplyCenter);
