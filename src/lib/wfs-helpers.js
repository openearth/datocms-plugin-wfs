/* 
  Function that implements the DescribeFeatureType operation of the WFS protocol
  Return a json with all the attributes of the feature
*/
import axios from 'axios'
import { stringify } from 'query-string'

function BuildGeoServerUrl({ url, service, request, encode = true, width = 256, height = 256, ...rest }) {
  if (!service || !request) {
    return undefined
  }

  const params = stringify({ service, request, width, height, ...rest }, { encode, sort: false })

  return `${ url }?${ params }`
}

/* 
  Function that reads the DescribeFeatureType response and returns the available attributes to filter and their type
  excludes geom
*/
export function ReadFeatureProperties(describeFeatureTypeResponse) {
  console.log('describeFeatureTypeResponse', describeFeatureTypeResponse)
  const { featureTypes } = describeFeatureTypeResponse
  const properties = featureTypes[0].properties
  
  const filteredProperties = properties.filter((property)=> 
                                property.type.includes('xsd')).map(({ name, type })=>  {
                                                                  return { name, type }
})
                                                                                      

  return filteredProperties
  
}
export async function DescribeFeatureType (url, layer) {
  
  const geoServerUrl = await BuildGeoServerUrl({
    url,
    request: 'describeFeatureType',
    service: 'WFS',
    outputFormat: 'application/json',
    typenames: layer,
  })

  return axios.get(geoServerUrl)
}
