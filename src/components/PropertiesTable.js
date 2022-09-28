import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, GetFeaturePropertyKeywords, ReadFeatureProperties } from '../lib/wfs-helpers'
import { ExtractSelectedRowIds } from '../lib/helpers'

export default function PropertiesTable({ formValues } ) {
  // defaultValues should be retrieved from the formValues.
  // for testing purposes I have a sample

  const columns = 
     [
      {
        Header: 'Property',
        accessor: 'property',
      },
  


  ]




  const {download_layer, layer, url, indexable_wfs_properties} = formValues

  const initialSelectedRows = ExtractSelectedRowIds(JSON.parse(indexable_wfs_properties))
  
  const [data, setData] = React.useState([])
  const getProperties = () => {
    
    DescribeFeatureType({url, layer, downloadLayer:download_layer})
      .then(response => {
        setData(ReadFeatureProperties(response.data))
      })
      .catch(() => undefined) 
  }
  useEffect(() => {
    getProperties()
  }, [])
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const updateSelectedRowIds = (selectedRowIds) => {
    console.log(selectedRowIds)
    const selectedRowsIdsArray = Object.keys(selectedRowIds)
    console.log(selectedRowsIdsArray)
    data.forEach((dataRow, index) => {
      const {property} = dataRow
     
      if (selectedRowsIdsArray.includes(index.toString())) {
        console.log(dataRow)
        
        GetFeaturePropertyKeywords({url, layer, downloadLayer:download_layer, propertyName: property})
          .then(response => console.log(response.data))
      }
    })
    //console.log('updateSelectedRowIds function material that I have')
    //console.log('selectedRowIds change after user checks', selectedRowIds)
    //console.log('data from describeCoverage as they are passed to the table', data)
    
  }
  const updateWormChoice = (wormChoice) => {
    //console.log('wormChoice', wormChoice)
  }

  return <div> 
      <CssBaseline />
        <EnhancedTable
          columns={columns}
          data={data}
          setData={setData}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
          defaultIndexableProperties= {initialSelectedRows}
          updateSelectedRowIds={updateSelectedRowIds}
          updateWormChoice={updateWormChoice}
      /></div>
}
