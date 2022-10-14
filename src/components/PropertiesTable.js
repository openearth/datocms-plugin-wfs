import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, GetFeaturePropertyKeywords, ReadFeatureProperties, ReadKeywordsFromWfsResponse } from '../lib/wfs-helpers'
import { GetAphiaIDByName, GetAphiaRecordByAphiaID, GetAphiaVernacularsByAphiaID } from '../lib/request-helpers'
import { ExtractWormsKeywordsFromRecord, ExtractWormsKeywordsFromVernacularRecord } from '../lib/helpers'

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
  const [stringFormatTableData, setStringFormatTableData] = React.useState([])
  const [wormsPending, setWormsPending] = React.useState(false)
  const {download_layer, layer, url, indexable_wfs_properties} = formValues

 
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
    let aphiaId;
    try {
      aphiaId = await GetAphiaIDByName({ keyword });
    } catch(error) {
      aphiaId = null;
    }
    
    if (!aphiaId) {
      return []
    }

    let aphiaVernacularsKeywords; 
    try {
      aphiaVernacularsKeywords = await GetAphiaVernacularsByAphiaID({id: aphiaId});
    } catch (error) {
      aphiaVernacularsKeywords = {}
    }
    
    
    let aphiaRecord ;
    try {
      aphiaRecord = await GetAphiaRecordByAphiaID({ id: aphiaId });
    } catch (error) {
      aphiaRecord = {};
    }

    return [...ExtractWormsKeywordsFromRecord(aphiaRecord), ...ExtractWormsKeywordsFromVernacularRecord(aphiaVernacularsKeywords)];
  };
    
  
  async function updateWormskeywordsOfData (rowIndex, value, data) {
    
    const updatedData = [...data]
    if (value === false) {
      updatedData[rowIndex].worms = false
      updatedData[rowIndex].indexed = false
      updatedData[rowIndex].keywords = []
      return updatedData
    }
    setWormsPending(true)
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
    setWormsPending(false)
    return updatedData 

    }
  }
  
  const getProperties = () => {
    if (indexable_wfs_properties) {
      setTableData(JSON.parse(indexable_wfs_properties)) 
      setStringFormatTableData(indexable_wfs_properties) 
    }else {
      DescribeFeatureType({url, layer, downloadLayer:download_layer})
      .then(response => ReadFeatureProperties(response.data))
      .then(updatedData => {
        setTableData(updatedData)
        setStringFormatTableData(JSON.stringify(updatedData))
      })
      .catch(() => undefined) 
    }
  }
  useEffect(() => {
    getProperties()
  }, [])


  async function updateWormSelectedRow (index, value)  {
    const updatedData = await updateWormskeywordsOfData(index, value, tableData)
    setTableData(updatedData)
    setStringFormatTableData(JSON.stringify(updatedData))
    updateSavedData(tableData)
  }

  const updateIndexedRow = (index, value) => {
    const updatedData = updateWfsKeywordsOfData(index, value, tableData)
    setTableData(updatedData)
    setTimeout(()=> setStringFormatTableData(JSON.stringify(updatedData)), 1000)
    updateSavedData(tableData)
  }
  
  

  return <div> 
      <CssBaseline />
      {/* {console.log(tableData)} */}
        <EnhancedTable
          columns={columns}
          tableData={tableData}
          updateIndexedRow={updateIndexedRow}
          updateWormSelectedRow={updateWormSelectedRow}
          wormsPending={wormsPending}
      />
      <div>
        <h1>
          Stored keywords
        </h1>
      <p>
        {stringFormatTableData}
      </p>
      </div>
    
      </div>
}
export default PropertiesTable
