/*
const columns = [
  {
    key: 'timeTick',
    title: '充值时间',
    dataFormat: (cell) => {
      if (isNaN(cell)) {
        return cell;
      }
      const resolveTime = new Date(cell);
      return resolveTime.format('yyyy/MM/dd');
    },
  },
];
<BootStrapTable
  data={sortTableData}
  columns={columns}
/>

*/

import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const renderPaginationPanel = (props) => {
  return (
    <div style={{ marginLeft: 20 }}>{ props.components.pageList }</div>
  );
};

const defaultOptions = {
  hideSizePerPage: true,
  paginationShowsTotal: false,
  noDataText: '没有数据',
  paginationPanel: renderPaginationPanel,
};
// minWidth: columns.length * 180
const Table = ({ columns, options, ...props }) => {
  const tableOptions = { ...defaultOptions, options };
  return (
    <div>
      <BootstrapTable
        {...props}
        striped
        hover
        search
        pagination
        tableStyle={{ overflow: 'auto' }}
        headerStyle={{ minWidth: columns.length * 120 }}
        bodyStyle={{ minWidth: columns.length * 120 }}
        options={tableOptions}
      >
        {
          columns.map(({ key, isKey, title, ...column }, i) => (
            <TableHeaderColumn
              key={i}
              {...column}
              dataField={key}
              isKey={!!isKey}
              dataAlign="center"
              condensed
              exportCSV
              thStyle={{ whiteSpace: 'normal' }}
              tdStyle={{ whiteSpace: 'normal' }}
              searchPlaceholder="查找"
            >
              {title}
            </TableHeaderColumn>
          ))
        }
      </BootstrapTable>
    </div>
  );
};

export default Table;

/*
thStyle={{ whiteSpace: 'normal' }}
tdStyle={{ whiteSpace: 'normal' }}
*/
