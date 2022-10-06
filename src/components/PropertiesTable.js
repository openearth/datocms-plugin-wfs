import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, GetFeaturePropertyKeywords, ReadFeatureProperties, ReadKeywordsFromWfsResponse } from '../lib/wfs-helpers'
import { GetAphiaIDByName, GetAphiaRecordByAphiaID } from '../lib/request-helpers'

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
    
  const updateWormskeywordsOfData = (rowIndex, value, data) => {
    console.log('was called')
    const updatedData = [...data]
    if (value === false) {
      updatedData[rowIndex].worms = false
      //need a function to clean the keywords from the worms
      //updatedData[rowIndex].keywords = []
      return updatedData
    }
    console.log(updatedData[rowIndex])
    const keywords = _.get(updatedData[rowIndex], 'keywords')
    
    if (keywords.length) {
      keywords.forEach(keyword => {
        GetAphiaIDByName({keyword})
          .then(response => GetAphiaRecordByAphiaID({id:response.data}))
      })
    }
  }
  

  
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
    updateWormskeywordsOfData(index, value, tableData)
    //updateSavedData(tableData)
  }

  const updateIndexedRow = (index, value) => {
    setTableData(updateWfsKeywordsOfData(index, value, tableData))
    updateSavedData(tableData)
  }
  
  return <div> 
      <CssBaseline />
        <EnhancedTable
          columns={columns}
          tableData={tableData}
          updateIndexedRow={updateIndexedRow}
          updateWormSelectedRow={updateWormSelectedRow}
      /></div>
}
export default PropertiesTable
