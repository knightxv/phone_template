
import { connect } from 'dva';
import { ActivityIndicator } from 'antd-mobile';

import BaseComponent from '../helps/BaseComponent';

class App extends BaseComponent {
  // async componentWillMount() {
    // const http = this.helps.webHttp;
    // const res = await http.get('/api/userInfo');
  // }
  render() {
    if (this.props.componentLoading) {
      return (<div style={{ display: 'flex', flexDirection: 'colunm', paddingTop: '3rem', justifyContent: 'center' }}>
        <ActivityIndicator text="Loading..." size="large"  />
      </div>);
    }
    return (
      <div id="container" className="routerContainer">
        {
          this.props.children
        }
      </div>
    );
  }
}

App.propTypes = {
};
const mapStateToProps = (state) => {
  return {
    ...state.app,
  };
};

export default connect(mapStateToProps)(App);
