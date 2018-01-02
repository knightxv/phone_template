import styled from 'styled-components';
import { ListView } from 'antd-mobile';


const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});
const RowSection = styled.div`
    display: flex;
    text-align: center;
    padding: 0.2rem 0;
    border-bottom: 1px solid #dedede;
  `;
  // const renderHeader = (columns) => { // dataIndex title
  //   return (
  //     <RowSection>
  //       {
  //         columns.map(({ title, dataIndex, remark, i }) => (
  //           <div
  //             key={dataIndex + i}
  //             style={{
  //               width: `${100 / columns.length}%`,
  //               display: 'flex',
  //               alignItems: 'center',
  //               flexDirection: 'column',
  //               justifyContent: 'center',
  //               color: '#000',
  //             }}
  //           >
  //             <p>{ title }</p>
  //             <p>{ remark }</p>
  //           </div>
  //         ))
  //       }
  //     </RowSection>
  //   );
  // };
const StyleListView = styled(ListView)`
  flex: 1;
  overflow: auto;
`;
const renderRow = (rowData, columns) => {
  return (
    <RowSection>
      {
        columns.map(({ dataIndex, render }, j) => (
          <div key={j} style={{ width: `${100 / columns.length}%`, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {
              render ? render(rowData) : rowData[dataIndex]
            }
          </div>
        ))
      }
    </RowSection>
  );
};

const ListViewWrapBody = (props) => {
  if (props.children.length === 0) {
    return (
      <div className="am-list-body my-body" style={{ textAlign: 'center', paddingTop: '5rem', background: 'rgb(242, 242, 242)' }}>
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

const DefaultListView = ({ tableData, columns, ListEmptyComponent, ...props }) => {
  return (
    <StyleListView
      dataSource={dataSource.cloneWithRows(tableData || [])}
      renderRow={rowData => renderRow(rowData, columns)}
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

export const DataSource = ListView.DataSource;


export default DefaultListView;
