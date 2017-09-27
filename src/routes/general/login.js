import { connect } from 'dva';
import styles from './login.css';
import BaseComponent from '../../helps/BaseComponent';
import { Input, Button } from '../../helps/antdComponent';
import { Title, IconImg, WhiteSpace } from '../../helps/styleComponent';

const logoSource = require('../../assets/adang_logo.png');

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loginLoading: false,
      loginID: '',
      password: '',
    };
  }
  // 登录
  login = async () => {
    const { loginID, password } = this.state;
    const params = {
      loginID,
      password,
    };
    this.setState({
      loginLoading: true,
    });
    const res = await this.helps.webHttp.get('/spreadApi/general/login', params);
    this.setState({
      loginLoading: false,
    });
    if (res.isSuccess) {
      this.props.dispatch(this.helps.routerRedux.push('/general/homePage'));
    } else {
      this.helps.toast(res.info);
    }
  }
  render() {
    const { loginLoading } = this.state;
    return (
      <div className="alignCenterContainer" style={{ maxWidth: 750 }}>
        <Title>合伙人登陆</Title>
        <div className="contentContainer">
          <div className={styles.logoWrap}>
            <IconImg className={styles.logo} src={logoSource} />
            <span className={styles.logoTitle}>阿当比鸡合伙人</span>
          </div>
          <div>
            <Input
              className={styles.loginInput}
              onChange={(event) => this.setState({ loginID: event.target.value })}
              placeholder="请输入账号名/姓名"
            />
            <Input
              className={styles.loginInput}
              type="password"
              placeholder="请输入密码"
              onPressEnter={this.login}
              onChange={(event) => this.setState({ password: event.target.value })}
            />
          </div>
          <WhiteSpace />
          <Button className={styles.loginBtn} loading={loginLoading} onClick={this.login}>登录</Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Login);
