import axios from 'axios'

export function GetAphiaIDByName({ keyword }) {
  const url = `https://marinespecies.org/rest/AphiaIDByName/${keyword}?marine_only=false`;
  return axios.get(url).then((response) => response.data);
}

export function GetAphiaVernacularsByAphiaID({ id }) {
  const url = `https://marinespecies.org/rest/AphiaVernacularsByAphiaID/${id}`;
  return axios.get(url).then((response) => response.data);
}

export async function GetAphiaRecordByAphiaID({ id }) {
  const url = `https://marinespecies.org/rest/AphiaRecordByAphiaID/${id}`;
  return axios.get(url).then((response) => response.data);
}





