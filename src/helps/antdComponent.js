// npm dev antd
// yarn add antd styled-components
import React from 'react';

import { Icon } from 'antd-mobile';

import 'antd/lib/pagination/style/css';

import Table from 'antd/lib/table';
import 'antd/lib/table/style/css';

import Select from 'antd/lib/select';
import 'antd/lib/select/style/css';

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


export default {
  Row,
  Col,
  Input: TextInput,
  Table: DefalutTable,
  Select,
  Icon,
};
