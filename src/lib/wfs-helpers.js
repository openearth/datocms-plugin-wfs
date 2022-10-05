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
 
  const { featureTypes } = describeFeatureTypeResponse
  const properties = featureTypes[0].properties
  
  const filteredProperties = properties.filter((property)=> 
                                property.type.includes('xsd:string'))
                                .map(({ name })=>  { return { property: name, indexed: false, worms: false, keywords: [] }})
                                                                                    
  return filteredProperties
  
}

/* 
  Function that creates the describeFeatureType request
*/
export async function DescribeFeatureType ({url, layer, downloadLayer}) {
  
  const geoServerUrl = await BuildGeoServerUrl({
    url,
    request: 'describeFeatureType',
    service: 'WFS',
    outputFormat: 'application/json',
    typenames: downloadLayer ? downloadLayer : layer,
  })

  return axios.get(geoServerUrl)
}

/* 
  Function that creates the getFeature request based on the propertyName
*/
export async function GetFeaturePropertyKeywords ({url, layer, downloadLayer, propertyName}) {
  
  const geoServerUrl = await BuildGeoServerUrl({
    url,
    request: 'getFeature',
    service: 'WFS',
    outputFormat: 'application/json',
    typenames: downloadLayer ? downloadLayer : layer,
    propertyName,
  })

  return axios.get(geoServerUrl)
}

/* 
  Function that reads the resposne of the GetFeature property
  Returns an array with the unique keywords of the property
*/
export function ReadKeywordsFromWfsResponse(response, property) {
  
  if (!response) {
    return []
  }
  const {features} = response
  const keywords  = features.map(({properties}) => {
  return properties[property]
  }) 
  return [ ...new Set(keywords) ]
}
