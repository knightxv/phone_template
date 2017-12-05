import React from 'react';
import { connect } from 'dva';
// import classnames from 'classnames';

import { Button, InputItem, Icon } from '@/helps/antdComponent';
import BaseComponent from '@/helps/BaseComponent';
// import { Title } from '@/helps/styleComponent';
import styles from './save.less';
import { FlexRow } from '../../helps/styleComponent';

class SaveAgent extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      agentInviteCode: '',
      playerInfo: null,
      isNotFind: false,
    };
    const { serverid } = this.helps.querystring.parse(this.props.location.search.substring(1));
    this.serverid = serverid;
    this.searchTime = null;
  }
  onSearch = (value) => {
    this.setState({ agentInviteCode: value });
    window.clearTimeout(this.searchTime);
    this.searchTime = window.setTimeout(async () => {
      if (value.length >= 6 && !isNaN(value)) {
        const res = await this.helps.webHttp.get('/spreadApi/getAgentInfoByInviteCode', { agentInviteCode: value, serverid: this.serverid });
        if (res.isSuccess) {
          this.setState({
            isNotFind: false,
            playerInfo: {
              ...res.data,
              agentInviteCode: value,
            },
          });
        } else {
          this.setState({
            isNotFind: true,
            playerInfo: null,
          });
        }
      } else {
        this.setState({
          playerInfo: null,
          isNotFind: false,
        });
      }
    }, 300);
  }
  toggleSave = async () => {
    const { playerInfo } = this.state;
    const { agentInviteCode, isSave } = playerInfo || {};
    let res;
    if (isSave) {
      res = await this.helps.webHttp.get('/spreadApi/cancelSaveAgent', { agentInviteCode, serverid: this.serverid });
    } else {
      res = await this.helps.webHttp.get('/spreadApi/saveAgent', { agentInviteCode, serverid: this.serverid });
    }
    if (res.isSuccess) {
      if (isSave) {
        this.helps.toast(res.info || '收藏成功');
      } else {
        this.helps.toast(res.info || '收藏成功');
      }
      this.setState({
        playerInfo: {
          ...playerInfo,
          isSave: !isSave,
        },
      });
      this.props.dispatch(this.helps.routerRedux.goBack());
    } else {
      this.helps.toast(res.info || '操作失败');
    }
  }
  render() {
    const { agentInviteCode, isNotFind, playerInfo } = this.state;
    return (
      <div>
        <FlexRow className={styles.headerWrap}>
          <Icon
            type="left"
            size="lg"
            onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          />
          <FlexRow className={styles.searchInputWrap}>
            <Icon type="search" size="xs" />
            <InputItem
              value={agentInviteCode}
              onChange={this.onSearch}
              placeholder="请输入代理邀请码"
            />
          </FlexRow>
        </FlexRow>
        {
          playerInfo &&
          <div className={styles.rowItem}>
            <div>{playerInfo.agentInviteCode}</div>
            <Button size="default" onClick={this.toggleSave}>{playerInfo.isSave ? '取消收藏' : '收藏'}</Button>
          </div>
        }
        {
          isNotFind &&
          <div className={styles.tip}>
            没有找到该代理哦~
          </div>
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(SaveAgent);
