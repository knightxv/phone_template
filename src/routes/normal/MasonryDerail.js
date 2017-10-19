
import { connect } from 'dva';

// import styles from './IndexPage.css';
import BaseComponent from '@/helps/BaseComponent';

class MasonryDetail extends BaseComponent {
  async componentWillMount() {
    // const http = this.helps.webHttp;
    // const res = await http.get('/api/userInfo');
  }
  render() {
    return (
      <div>
        MasonryDetail
      </div>
    );
  }
}

MasonryDetail.propTypes = {
};

export default connect()(MasonryDetail);
