import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, ReadFeatureProperties } from '../lib/wfs-helpers'


export default function PropertiesTable({ formValues } ) {
  const columns = 
     [
      {
        Header: 'Property',
        accessor: 'property',
      },
      {
        Header: 'Worth',
        accessor: 'worth',
      },
      {
        Header: 'Keywords',
        accessor: 'keywords',
      },

  ]


  //call describeFeatureType from wfs-helpers

  const {download_layer, layer, url} = formValues
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
  //const [data, setData] = React.useState( [{property: "biotaxon", keywords: ["Chaetoceros lorenzianus", "Micracanthodinium"]}, {property: "Sample", keywords: ["key1", "key2"]}])
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  console.log(data)
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
  return <div> 
      <CssBaseline />
        <EnhancedTable
          columns={columns}
          data={data}
          setData={setData}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
      /></div>
}
