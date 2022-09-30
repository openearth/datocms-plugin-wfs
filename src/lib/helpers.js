export function ExtractSelectedRowIds(pluginProperties) {
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

export function ExtractInitialSelectedWorms(pluginProperties) {
    if (!pluginProperties.length) {
    return 
  }

  return pluginProperties.map(({worms}) => worms)
}



