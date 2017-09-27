// npm dev antd
// yarn add antd styled-components
import React from 'react';
import { system } from './help';
import { Icon, Toast, NavBar } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';

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

// import DatePicker from 'antd/lib/date-picker';
// import 'antd/lib/date-picker/style/css';
// const InputContainer = styled.div`
// `;

const DefaultButton = (props) => {
  return (
    <Button type="primary" {...props} />
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
    <Icon size="lg" {...props} />
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
const DefaultNavbar = ({ title, ...props }) => {
  const sys = system();
  if (sys === 'PC') {
    return null;
  }
  return (
    <div>
      <NavBar
        mode="light"
        {...props}
      >{title}</NavBar>
    </div>
  );
};

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
};
