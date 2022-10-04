import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, GetFeaturePropertyKeywords, ReadFeatureProperties, ReadKeywordsFromWfsResponse } from '../lib/wfs-helpers'
import { ExtractInitialSelectedRowsObject, ExtractInitialSelectedWormsValues, ExtractSelectedRowIds } from '../lib/helpers'


export default function PropertiesTable({ formValues } ) {
  // defaultValues should be retrieved from the formValues.
  // for testing purposes I have a sample

  const columns = 
     [
      {
        Header: 'Property',
        accessor: 'property',
      }
  ]

  const {download_layer, layer, url, indexable_wfs_properties} = formValues
  //Default properties as saved in DatoCMS
  const initialPluginProperties = JSON.parse(indexable_wfs_properties)
  
  //Default indexed rows
  /*   initialSelectedRows example:  {'selectedRowIds': {
                                                          2:true 
                                                          4: true   }}
   */

  const initialSelectedRows = ExtractInitialSelectedRowsObject(initialPluginProperties)   
  const initialSelectedWorms = ExtractInitialSelectedWormsValues(initialPluginProperties)

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

  // set in the data the worms=true values
  const initialSelectedRowIds = ExtractSelectedRowIds(initialSelectedRows)
  data.forEach((dataRow, index)=>{
    if (Object.keys(initialSelectedRowIds).includes(index.toString())){   
      dataRow.worms = initialSelectedRowIds[index]
    }
  
  })

  const updateSelectedRowIds = (selectedRowIds) => {
    const selectedRowsIdsArray = Object.keys(selectedRowIds)
    data.forEach((dataRow, index) => {
      const {property} = dataRow
     
      if (selectedRowsIdsArray.includes(index.toString())) {
        GetFeaturePropertyKeywords({url, layer, downloadLayer:download_layer, propertyName: property})
          .then(response => ReadKeywordsFromWfsResponse(response.data, property ))
          .then(keywords => dataRow.keywords = keywords)
          .then(() => dataRow)
      }
      
    })
    
    
  }
  const updateWormChoice = (wormsChoice) => {
    console.log('wormsChoice as it was chosen from the user', wormsChoice)
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
