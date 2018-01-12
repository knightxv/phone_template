import React from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';

// import InputItem from '@/helps/antdComponent/InputItem';
import NavBar from '@/helps/antdComponent/NavBar';
import BaseComponent from '@/helps/BaseComponent';
import { Title } from '@/helps/styleComponent';
import styles from './PcWechatLogin.less';

class PcWechatLogin extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loginLink: '',
      linkSrc: '',
    };
  }
  setStateAsync = (state) => {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }
  componentDidMount() {
    const imgData = this.canvasNode._canvas.toDataURL('image/png');
    this.setState({
      linkSrc: imgData,
    });
  }
  render() {
    const { loginLink, linkSrc } = this.state;
    return (
      <div className={styles.container}>
        <Title>微信登录</Title>
        <NavBar
          title="微信登录"
          onClick={this.router.back}
        />
        <div className={styles.contentContainer}>
          <div>
            <img width={300} height={300} src={linkSrc} />
            <div style={{ display: 'none' }}>
              <QRCode
                ref={(node) => { this.canvasNode = node; }}
                size={160}
                value={loginLink}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    ...state.agent,
  };
}

export default connect(mapStateToProps)(PcWechatLogin);
