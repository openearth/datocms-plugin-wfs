export function ExtractInitialSelectedRowsObject(pluginProperties) {
  if (!pluginProperties.length) {
    return 
  }
  const indeces = pluginProperties.map(({index}) => {
    const selectedRow ={}
    selectedRow[index] = true
    return selectedRow
  })
  
  return {
    selectedRowIds: Object.assign({}, ...indeces)
  }  
}

export function ExtractInitialSelectedWormsValues(pluginProperties) {
    if (!pluginProperties.length) {
    return 
  }

  return pluginProperties.map(({worms}) => worms)
}

export function ExtractSelectedRowIds (selectedRowsObject) {
  if (!selectedRowsObject) {
    return []
  }
  const {selectedRowIds} = selectedRowsObject
  return selectedRowIds
}

export function ExtractIndexedPropertiesBoolean(data) {
  if (!data.length) {
    return []
  }
  return data.map(({indexed}) => indexed )
}


export function ExtractWormsKeywordsFromRecord(record) {
  if (!record) {
    return
  } 
  return [record.class, record.family, record.genus, record.kingdom, record.phylum, record.order]
}


