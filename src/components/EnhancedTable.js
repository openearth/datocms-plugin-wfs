import React, {useEffect} from 'react'

import Checkbox from '@mui/material/Checkbox'
import PropTypes from 'prop-types'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Table from '@mui/material/Table';
import MaUTable from '@mui/material/Table'
import CircularProgress from '@mui/material/CircularProgress';


const EnhancedTable = ({
  columns,
  tableData,
  updateIndexedRow,
  updateWormSelectedRow, 
  wormsPending,
}) => {


  const data = React.useMemo(() => tableData, [tableData]);
  const [firstTime, setFirstTime ] = React.useState(false)
  const [lastUpdatedWormRow, setLastUpdatedWormRow] = React.useState("")
  const [indexedRows, setIndexedRows] = React.useState([])
  const [wormSelectedRows, setWormSelectedRows] = React.useState([])

  if (tableData.length && !firstTime) {
    setFirstTime(true)
    setIndexedRows(tableData.map(({indexed})=> indexed))
    setWormSelectedRows((tableData.map(({worms})=> worms)))
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
    setLastUpdatedWormRow(id)
  }

/* <Checkbox defaultChecked={false} /> */
  // Render the UI for your table
  return (
    <TableContainer>
      {console.log('wormsPending', wormsPending)}
      <MaUTable>
      <TableHead>
        <TableRow>
          <TableCell >Indexed</TableCell>
          <TableCell  >Worms</TableCell>
          <TableCell  >Property</TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index)=> (
            <TableRow key={row.property}>
            <TableCell><Checkbox checked={indexedRows[index]} onChange={(e) => onUpdateIndexedRow(index, e.target.checked)}  /></TableCell>
            {(wormsPending && lastUpdatedWormRow === index) ? <TableCell><CircularProgress/></TableCell> : <TableCell><Checkbox checked={wormSelectedRows[index]}  onChange={(e) => onUpdateWormSelectedRow(index, e.target.checked)} /></TableCell>}
            <TableCell>{row.property}</TableCell>
          </TableRow>
          ))}
          
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
