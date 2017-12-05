import React from 'react';
import { connect } from 'dva';

import { NavBar, Icon } from '@/helps/antdComponent';
import { Title, WhiteSpace, FlexRowBetweenWingSpace, FlexRow, NetImg } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './SelectGame.less';


class SelectGame extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      gameList: [],
    };
  }
  async componentWillMount() {
    // alert(window.devicePixelRatio)
    // alert(window.devicePixelRatio * document.documentElement.offsetWidth)
    // alert(window.getComputedStyle(document.documentElement)['font-size'])
    const res = await this.helps.webHttp.get('/spreadApi/getGameList');
    if (res.isSuccess) {
      this.setState({
        gameList: res.data,
      });
    }
  }
  // 选择游戏跳转
  selectGame = (serverid) => {
    const { redirect } = this.helps.querystring.parse(this.props.location.search.substring(1));
    this.props.dispatch(this.helps.routerRedux.push({
      pathname: redirect,
      query: {
        serverid,
      },
    }));
  }
  render() {
    const { gameList } = this.state;
    return (
      <div>
        <Title>选择游戏</Title>
        <NavBar
          title="选择游戏"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
        />
        <WhiteSpace />
        <div>
          {
            gameList.map(game => (
              <FlexRowBetweenWingSpace
                key={game.serverid}
                className={styles.rowSection}
                onClick={() => this.selectGame(game.serverid)}
              >
                <FlexRow>
                  <NetImg src={game.gameIcon} className={styles.gameIcon} />
                  <div>{game.gameName}</div>
                </FlexRow>
                <FlexRow>
                  <div>{game.gameNumber}人</div>
                  <Icon type="right" />
                </FlexRow>
              </FlexRowBetweenWingSpace>
            ))
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(SelectGame);
