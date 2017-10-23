// npm dev antd
// yarn add antd styled-components
import React from 'react';

import 'antd/lib/pagination/style/css';

import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';

import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';

import Input from 'antd/lib/input/Input';
import 'antd/lib/input/style/css';

import Row from 'antd/lib/row';
import 'antd/lib/row/style/css';
import Col from 'antd/lib/col';
import 'antd/lib/col/style/css';

import styled from 'styled-components';

import { Icon, Toast, NoticeBar, Picker, List, ListView, InputItem, DatePicker } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '../assets/css/antdSelf.css';
// import DatePicker from 'antd/lib/date-picker';
// import 'antd/lib/date-picker/style/css';
// const InputContainer = styled.div`
// `;

const DefaultButton = (props) => {
  return (
    <Button type="primary" size="large" {...props} />
  );
};

const InputWrap = styled.div`
  flex: 1;
  display: flex;
`;
const TextInput = (props) => {
  return (
    <InputWrap>
      <Input {...props} />
    </InputWrap>
  );
};

const DefaultIcon = (props) => {
  return (
    <Icon size="md" {...props} />
  );
};

// 表格
const PaginationItemWrap = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border: 1px solid #dedede;
  border-radius: 3px;
`;
const itemRender = (current, type, originalElement) => {
  if (type === 'prev') {
    return (<PaginationItemWrap>
      <Icon size="sm" type="left" />
    </PaginationItemWrap>);
  } else if (type === 'next') {
    return (<PaginationItemWrap style={{ marginRight: 10 }}>
      <Icon size="sm" type="right" />
    </PaginationItemWrap>);
  }
  return originalElement;
};

const DefalutTable = ({ dataSource, columns, ...props }) => {
  const resolveDataSource = dataSource.map((item, i) => ({ key: i, ...item }));
  return (
    <Table
      pagination={{
        itemRender,
      }}
      dataSource={resolveDataSource}
      columns={columns.map(item => ({ ...item, className: 'tableCol' }))}
      {...props}
    />
  );
};

const NavBarWrap = styled.div`
  display: flex;
  height: .7rem;
  padding-left: .1rem;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #fff;
`;

const DefaultNavbar = ({ title, onClick, right }) => {
  return (
    <NavBarWrap>
      <DefaultIcon
        type="left"
        color="#108ee9"
        onClick={onClick}
      />
      <div>{title}</div>
      <div style={{ width: 36 }}>
        { right }
      </div>
    </NavBarWrap>
  );
};

const IconSource = {
  notice: require('../assets/gg.png'),
};

const NoticeImg = styled.img`
  width: .3rem;
  height: .3rem;
  margin: 0 .06rem;
`;

const DefaultNotice = (props) => {
  return (
    <NoticeBar
      mode="link"
      marqueeProps={{ loop: true, style: { color: '#f1781e', fontSize: '.2rem' } }}
      icon={<NoticeImg src={IconSource.notice} />}
      {...props}
    />
  );
};

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});
const RowSection = styled.div`
  display: flex;
  text-align: center;
  padding: 0.1rem 0;
`;
const renderHeader = (columns) => { // dataIndex title
  return (
    <RowSection>
      {
        columns.map(({ title, dataIndex, remark, i }) => (
          <div
            key={dataIndex + i}
            style={{
              width: `${100 / columns.length}%`,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p>{ title }</p>
            <p>{ remark }</p>
          </div>
        ))
      }
    </RowSection>
  );
};

const renderRow = (tableData, columns) => {
  return (
    <div>
      {
        tableData.map((data, i) => (
          <RowSection key={i}>
            {
              columns.map(({ dataIndex, render }, j) => (
                <div key={j} style={{ width: `${100 / columns.length}%`, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  {
                    render ? render(data) : data[dataIndex]
                  }
                </div>
              ))
            }
          </RowSection>
        ))
      }
    </div>
  );
};

const StyleListView = styled(ListView)`
  flex: 1;
  overflow: auto;
  background: #fff;
`;

const DefaultListView = ({ tableData, columns, ...props }) => {
  return (
    <StyleListView
      dataSource={dataSource.cloneWithRows(tableData || [])}
      renderRow={() => renderRow(tableData, columns)}
      renderHeader={() => renderHeader(columns)}
      className="fortest"
      pageSize={10}
      scrollRenderAheadDistance={500}
      scrollEventThrottle={200}
      onEndReachedThreshold={10}
      {...props}
    />
  );
};
// DefaultListView = Object.assign(ListView);

export default {
  Row,
  Col,
  Input: TextInput,
  Button: DefaultButton,
  Table: DefalutTable,
  Select,
  Icon: DefaultIcon,
  Toast,
  NavBar: DefaultNavbar,
  NoticeBar: DefaultNotice,
  List,
  SelectPicker: Picker,
  Notice: DefaultNotice,
  ListViewTable: DefaultListView,
  ListView,
  InputItem,
  DatePicker,
};
