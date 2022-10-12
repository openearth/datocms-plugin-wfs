import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, GetFeaturePropertyKeywords, ReadFeatureProperties, ReadKeywordsFromWfsResponse } from '../lib/wfs-helpers'
import { GetAphiaIDByName, GetAphiaRecordByAphiaID } from '../lib/request-helpers'
import { ExtractWormsKeywordsFromRecord } from '../lib/helpers'

import _ from 'lodash';

const PropertiesTable = ({ formValues, updateSavedData } ) =>  {
  // defaultValues should be retrieved from the formValues.
  const columns = 
     [
      {
        Header: 'Property',
        accessor: 'property',
      },
  ]
   //STATE
  const [tableData, setTableData] = React.useState([])
  const {download_layer, layer, url, indexable_wfs_properties} = formValues
  
  //Initial properties as saved in DatoCMS
  /*   initialSelectedRows example:  {'selectedRowIds': {
                                                          2:true 
                                                          4: true   }}
   */
  
  const defaultTableData = JSON.parse(indexable_wfs_properties)
  console.log('defaultTableData', defaultTableData)
  const setDefaultTableData = () => {
    setTableData(defaultTableData)
  }
  
  useEffect(() => {
    setDefaultTableData()
  }, [])
  
 
  const updateWfsKeywordsOfData = (rowIndex, value, data) => {

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

  const GetWormsRecordKeywords = async function (keyword) {

    const aphiaId = await GetAphiaIDByName({ keyword });
    let aphiaRecord;
    try {
      aphiaRecord = await GetAphiaRecordByAphiaID({ id: aphiaId });
    } catch (error) {
      aphiaRecord = {};
    }
    return ExtractWormsKeywordsFromRecord(aphiaRecord);
  };
    
  
  async function updateWormskeywordsOfData (rowIndex, value, data) {
    
    const updatedData = [...data]
    if (value === false) {
      updatedData[rowIndex].worms = false
      //need a function to clean the keywords from the worms
      //updatedData[rowIndex].keywords = []
      return updatedData
    }
    
    const keywords = _.get(updatedData[rowIndex], 'keywords')
    
    let wormsKeywords = []
    if (keywords.length) {
    for await (const keyword of keywords) {
      const recordKeywords = await GetWormsRecordKeywords(keyword);
      
      wormsKeywords = [...wormsKeywords, ...recordKeywords];
     
    }
    const updatedKeywords = [...keywords, ...wormsKeywords]
    updatedData[rowIndex].worms = true
    updatedData[rowIndex].keywords = [ ...new Set(updatedKeywords)] 
    return updatedData 

    }
  }
  
  const getProperties = () => {
    if (tableData) {
      return
    }
    DescribeFeatureType({url, layer, downloadLayer:download_layer})
      .then(response => ReadFeatureProperties(response.data))
      .then(updatedData => setTableData(updatedData))
      .catch(() => undefined) 
  }
  useEffect(() => {
    getProperties()
  }, [])


  async function updateWormSelectedRow (index, value)  {
    const updatedData = await updateWormskeywordsOfData(index, value, tableData)
    setTableData(updatedData)
    updateSavedData(tableData)
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
      />
      <div>
        <h1>
          Stored keywords
        </h1>
      <p>
        {JSON.stringify(tableData)}
      </p>
      </div>
    
      </div>
}
export default PropertiesTable
