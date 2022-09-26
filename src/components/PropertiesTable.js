import React, {useEffect} from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import EnhancedTable from './EnhancedTable'
import { DescribeFeatureType, ReadFeatureProperties } from '../lib/wfs-helpers'

export default function PropertiesTable() {
  const columns = 
     [
      {
        Header: 'Property',
        accessor: 'property',
      },
      {
        Header: 'Keywords',
        accessor: 'keywords',
      },

  ]


  //call describeFeatureType from wfs-helpers

  const url = "https://marineprojects.openearth.eu/geoserver/ihm_etl/ows"
  const layer = "ihm_etl:biologie"
  const [properties, setProperties] = React.useState({})
  const getProperties = () => {
    
    DescribeFeatureType(url, layer)
      .then(response => {
        setProperties(ReadFeatureProperties(response.data))
      })
      .catch(() => undefined) 
  }
  useEffect(() => {
    getProperties()
  }, [])
  const [data, setData] = React.useState( [{property: "biotaxon", keywords: ["Chaetoceros lorenzianus", "Micracanthodinium"]}, {property: "Sample", keywords: ["key1", "key2"]}])
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
  return <div> 
      <CssBaseline />
      {console.log(properties)}
        <EnhancedTable
          columns={columns}
          data={data}
          setData={setData}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
      /></div>
}
