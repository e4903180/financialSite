import React from 'react';
import { useTable, useGlabalFilter, useAsyncDebounce, useFilters } from 'react-table'
import './customTable.css'
import GlobalFilter from './globalFilter'

function CustomTable(props) {
  function Table({ columns, data }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state,
      setGlobalFilter
    } = useTable({
      columns,
      data
    },useGlabalFilter)
  
    // Render the UI for your table
    return (
      <>
        <span>
          <GlobalFilter globalFilter = { state.globalFilter } setGlobalFilter = { setGlobalFilter } />
        </span>
        
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }

    return (
        <Table columns = { props.columns } data = { props.data } />
    );
}

export default CustomTable;