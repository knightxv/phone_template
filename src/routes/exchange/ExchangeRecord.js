import { connect } from 'dva';

import { NavBar } from '@/helps/antdComponent';
import { Title, WhiteSpace, FlexRowBetweenWingSpace, FlexRow, IconImg } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './ExchangeRecord.less';

class OrderRecord extends BaseComponent {
  async componentWillMount() {
    const webHttp = this.helps.webHttp;
    const query = this.router.getQuery();
    // const { token, serverid, pid, itemType = 'fastCard', balance = 0 } = query;
    this.query = query;
    this.state = {

    };
  }
  chooseType = () => {
    // this.go('/exchangeRecord');
  }
  render() {
    return (
      <div>
        <Title>充值记录</Title>
        <NavBar
          title="充值记录"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={this.chooseType}>筛选</div>}
        />
        充值记录
      </div>
    );
  }
}

OrderRecord.propTypes = {
};

export default connect()(OrderRecord);
