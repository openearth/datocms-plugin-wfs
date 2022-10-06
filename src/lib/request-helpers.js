import axios from 'axios'
import { stringify } from 'query-string'

export async function GetAphiaIDByName({keyword}) {
  const url =  await `https://marinespecies.org/rest/AphiaIDByName/${keyword}?marine_only=false`
  return axios.get(url)
}

export async function GetAphiaVernacularsByAphiaID({id}) {
  const url = await `https://marinespecies.org/rest/AphiaVernacularsByAphiaID/${id}`
  return axios.get(url)
}

export async function GetAphiaRecordByAphiaID ({id}) {
   const url = await `https://marinespecies.org/rest/AphiaRecordByAphiaID/${id}`
   return axios.get(url)
}




