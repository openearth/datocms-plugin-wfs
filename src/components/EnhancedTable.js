import React from 'react'

import Checkbox from '@mui/material/Checkbox'
import MaUTable from '@mui/material/Table'
import PropTypes from 'prop-types'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'


import {
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'

const inputStyle = {
  padding: 0,
  margin: 0,
  border: 0,
  background: 'transparent',
}


const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id }, 
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }


  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <input
      style={inputStyle}
      value={value}
      onChange={onChange}
    />
  )
}

EditableCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.any.isRequired,
  }),
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }),
  column: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}


const EnhancedTable = ({
  columns,
  tableData,
  updateIndexedRow,
  updateWormSelectedRow, 
}) => {


  const data = React.useMemo(() => tableData, [tableData]);
  const [firstTime, setFirstTime ] = React.useState(false)
  const [indexedRows, setIndexedRows] = React.useState([])
  const [wormSelectedRows, setWormSelectedRows] = React.useState([])

  if (tableData.length && !firstTime) {
    setFirstTime(true)
    setIndexedRows(tableData.map(({indexed})=> indexed))
  }
  
  const onUpdateIndexedRow = (id, checked) => {
    updateIndexedRow(id, checked)
    let updatedCheckedData = [...indexedRows]
    updatedCheckedData[id] = !updatedCheckedData[id]
    setIndexedRows(updatedCheckedData)
  }

  const onUpdateWormSelectedRow = (id, checked) => {
    updateWormSelectedRow(id, checked)
    let updatedData = [...wormSelectedRows]
    updatedData[id] = !updatedData[id]
    setWormSelectedRows(updatedData)
  }

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
    {
      columns,
      //initialState: tableData,
      data,
      //initialState: indexedProperties,
      defaultColumn,
    },
    
    useSortBy,
    usePagination,
    hooks => {
      hooks.allColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox. 
          Header: 'Indexed',
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (     
            <div>
              <Checkbox defaultChecked={indexedRows[row.id]} onChange={(e)=> onUpdateIndexedRow(row.id, e.target.checked)}/>
            </div>
          ),
        },
        {
          id: 'wormsSelection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox. 
          Header:'Worms',
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <Checkbox defaultChecked={wormSelectedRows[row.id]} onChange={(e) => onUpdateWormSelectedRow(row.id, e.target.checked)}/>
            </div>
          ),
        },
        ...columns,

      ])
    }
  )

  // Render the UI for your table
  return (
    <TableContainer>
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell
                  {...(column.id === 'selection'
                    ? column.getHeaderProps()
                    : column.getHeaderProps(column.getSortByToggleProps()))}
                >
                  {column.render('Header')}
                  {column.id !== 'selection' ? (
                    <TableSortLabel
                      active={column.isSorted}
                      // react-table has a unsorted state which is not treated here
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>

    
      </MaUTable>
    </TableContainer>
  )
}

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
}

export default EnhancedTable
