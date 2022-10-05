import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, GetFeaturePropertyKeywords, ReadFeatureProperties, ReadKeywordsFromWfsResponse } from '../lib/wfs-helpers'
import { ExtractInitialSelectedRowsObject, ExtractInitialSelectedWormsValues, ExtractSelectedRowIds, ExtractIndexedPropertiesBoolean } from '../lib/helpers'
import _ from 'lodash';

const PropertiesTable = ({ formValues, updateSavedData } ) =>  {
  // defaultValues should be retrieved from the formValues.
  const columns = 
     [
      {
        Header: 'Property',
        accessor: 'property',
      }
  ]

  const {download_layer, layer, url, indexable_wfs_properties} = formValues
  
  //Initial properties as saved in DatoCMS
  /*   initialSelectedRows example:  {'selectedRowIds': {
                                                          2:true 
                                                          4: true   }}
   */
  
  //const initialPluginProperties = JSON.parse(indexable_wfs_properties)
  //const initialSelectedRows = ExtractInitialSelectedRowsObject(initialPluginProperties)   
  const initialSelectedRows = {}

/* 

data state: 
    [{property: nameOfProperty , worms: boolean, keywords: []}]
    getProperties: Sets the original data
    Based on initialPluginProperties: data are changing


*/    


  //Function to be called when we want to update the WfsKeywords
  //InputsL selectedRowIds, tableData to be updated

  const updateWfsKeywordsOfData = (rowIndex, value, data) => {
//perhaps can be done without map function
    const updatedData = [...data]
    if (value === false) {
      updatedData[rowIndex].indexed = false
      updatedData[rowIndex].keywords = []
      return updatedData
    }
  
  GetFeaturePropertyKeywords({url, layer, downloadLayer:download_layer, propertyName: updatedData[rowIndex].property})
          .then(response => ReadKeywordsFromWfsResponse(response.data, updatedData[rowIndex].property ))
          .then(keywords => {
            updatedData[rowIndex].indexed = true
            updatedData[rowIndex].keywords = keywords
          })
  return updatedData
  }
    
   
  
/*   const updateWormsBoolean = (selectedRowIds, data, ) => {
    const selectedRowsIdsArray = Object.keys(selectedRowIds)
    const updatedData = data.map((dataRow, index) => {
      if (selectedRowsIdsArray.includes(index.toString()) {
        dataRow.worms = 
      }
    })
  } */


  
  //STATE
  const [tableData, setTableData] = React.useState([])
 /*  const [indexedProperties, setIndexedProperties] = React.useState([]) */
  //1. Update state
  const getProperties = () => {
    
    DescribeFeatureType({url, layer, downloadLayer:download_layer})
      .then(response => ReadFeatureProperties(response.data))
      //.then(data => updateWfsKeywordsOfData(_.get(initialSelectedRows,'selectedRowIds'), data))
      .then(updatedData => setTableData(updatedData))
      .catch(() => undefined) 
  }
  useEffect(() => {
    getProperties()
  }, [])


  const updateWormSelectedRow = (index, value) => {
    console.log(index, value)
  }

  const updateIndexedRow = (index, value) => {
    console.log(index,value)
    setTableData(updateWfsKeywordsOfData(index, value, tableData))
    updateSavedData(tableData)
  }
  
  return <div> 
      <CssBaseline />
      {console.log(tableData)}
        <EnhancedTable
          columns={columns}
          data={tableData}
          setData={setTableData}
          updateIndexedRow={updateIndexedRow}
          updateWormSelectedRow={updateWormSelectedRow}
      /></div>
}
export default PropertiesTable
