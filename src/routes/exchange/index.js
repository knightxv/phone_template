import { connect } from 'dva';

import { NavBar, InputItem } from '@/helps/antdComponent';
import { Title, WhiteSpace, FlexRowBetweenWingSpace, FlexRow, IconImg } from '@/helps/styleComponent';
import BaseComponent from '@/helps/BaseComponent';
import styles from './index.less';

class Exchange extends BaseComponent {
  async componentWillMount() {
    const webHttp = this.helps.webHttp;
    // const res = await webHttp.get('/api/userInfo');
    const query = this.router.getQuery();
    // const { token, serverid, pid, itemType = 'fastCard', balance = 0 } = query;
    this.query = query;
    this.state = {
      phone: '',
    };
  }
  goToOrderRecord = () => {
    this.router.go('/exchangeRecord');
  }
  phoneChange = (phone) => {
    this.setState({
      phone
    });
  }
  render() {
    const { phone } = this.state;
    return (
      <div>
        <Title>充值中心</Title>
        <NavBar
          title="充值中心"
          onClick={() => this.props.dispatch(this.helps.routerRedux.goBack())}
          right={<div onClick={this.goToOrderRecord}>充值记录</div>}
        />
        <WhiteSpace />
        <div className={styles.rowItem}>
          <div>钻石d</div>
          <div>999个</div>
        </div>
        <WhiteSpace />
        <div className={styles.inputWrap}>
          <InputItem
            value={phone}
            onChange={this.phoneChange}
            clear
            type="phone"
            placeholder="请输入手机号码"
          />
        </div>
      </div>
    );
  }
}

Exchange.propTypes = {
};

export default connect()(Exchange);
