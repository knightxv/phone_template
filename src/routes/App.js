
import { connect } from 'dva';
import { ActivityIndicator } from 'antd-mobile';

import BaseComponent from '@/core/BaseComponent';

class App extends BaseComponent {
  render() {
    if (this.props.componentLoading) {
      return (<div style={{ display: 'flex', flexDirection: 'colunm', paddingTop: '3rem', justifyContent: 'center' }}>
        <ActivityIndicator text="Loading..." size="large" />
      </div>);
    }
    return (
      <div id="container">
        {
          this.props.children
        }
      </div>
    );
  }
}

App.propTypes = {
};
// const mapStateToProps = (state) => {
//   return {
//     ...state.app,
//   };
// };

export default connect()(App);
