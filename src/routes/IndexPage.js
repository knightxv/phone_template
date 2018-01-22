
import { connect } from 'dva';

import styles from './IndexPage.css';
import BaseComponent from '../core/BaseComponent';

class IndexPage extends BaseComponent {
  async componentWillMount() {
    const http = this.helps.webHttp;
    const res = await http.get('/api/userInfo');
  }
  render() {
    return (
      <div>
        dd
      </div>
    );
  }
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
