// import styled from 'styled-components';
import { ListView } from 'antd-mobile';


const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

const ListViewWrapBody = (props) => {
  if (props.children.length === 0) {
    return (
      <div className="am-list-body my-body" style={{ textAlign: 'center', background: 'rgb(242, 242, 242)' }}>
        {props.ListEmptyComponent || '没有数据'}
      </div>
    );
  }
  return (
    <div className="am-list-body my-body">
      {props.children}
    </div>
  );
};

const DefaultListView = ({ data, ListEmptyComponent = null, ...props }) => {
  return (
    <ListView
      dataSource={dataSource.cloneWithRows(data || [])}
      initialListSize={15}
      pageSize={1}
      scrollRenderAheadDistance={500}
      scrollEventThrottle={200}
      onEndReachedThreshold={10}
      style={{ background: '#f2f2f2' }}
      renderBodyComponent={() => <ListViewWrapBody ListEmptyComponent={ListEmptyComponent} />}
      {...props}
      />
    );
  };
export default DefaultListView; 