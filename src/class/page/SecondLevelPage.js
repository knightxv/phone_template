import BaseComponent '@/helps/BaseComponent';

class SecondLevelPage extends BaseComponent {
    constructor(props) {
      super(props);
      const { code } = this.router.getQuery();
      this.code = code; // 上级代理的邀请码
      this.pid = ''; // 上级代理的id(pid)(暂时没什么用)
      this.hasCode = !!this.code;
      this.state = {
        phone: '',
        pCode: code, // 上级代理邀请码
        verifyCode: '', // 验证码
        agreenShow: false,
      };
    }
    render() {
      return (
        <div className={styles.container}>
          <Title>忘记密码</Title>
          <NavBar
            title="忘记密码"
            onClick={this.router.back}
          />
          <div className={styles.contentContainer}>
          </div>
        </div>
      );
    }
  }