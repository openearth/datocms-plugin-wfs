import _ from 'lodash'

export function ExtractWormsKeywordsFromRecord(record) {
  if (!record) {
    return
  } 
  return [record.class, record.family, record.genus, record.kingdom, record.phylum, record.order]
}


export function ExtractWormsKeywordsFromVernacularRecord(record) {
  if (!record.length) {
    return []
  }
  let langKeywords = []
  record.forEach(({language_code, vernacular}) => {
   if (language_code === 'eng' ||
           language_code === 'dan' ||
           language_code === 'fra' ||
           language_code === 'deu' ||
           language_code === 'dut') {
     langKeywords = [...langKeywords, vernacular]
   } 

})


return langKeywords
}
