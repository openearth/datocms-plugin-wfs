export function ExtractSelectedRowIds(indexableProperties) {
  if (!indexableProperties.length) {
    return 
  }
  const indeces = indexableProperties.map(({index}) => {
    const selectedRow ={}
    selectedRow[index] = true
    return selectedRow
  })
  
  return {
    selectedRowIds: Object.assign({}, ...indeces)
  }  
}

