import axios from 'axios'

// instead of GetAphiaIDByName we use GetAphiaRecordsByMatchNames,
// because GetAphiaIDByName returns a negative ID when there are multiple results
export function GetAphiaIDByName({ keyword }) {
  const url = `https://marinespecies.org/rest/AphiaRecordsByMatchNames?scientificnames%5B%5D=${ keyword }&marine_only=false`;
  return axios.get(url)
    .then((response) => response.data)
    .then(([data]) => {
      const record = data.find((record) => record.status === 'accepted');

      return record.AphiaID;
    })
    .catch((error) => {
      console.error('Error getting AphiaID by name', error);
    });
}

export function GetAphiaVernacularsByAphiaID({ id }) {
  const url = `https://marinespecies.org/rest/AphiaVernacularsByAphiaID/${id}`;
  return axios.get(url).then((response) => response.data);
}

export async function GetAphiaRecordByAphiaID({ id }) {
  const url = `https://marinespecies.org/rest/AphiaRecordByAphiaID/${id}`;
  return axios.get(url).then((response) => response.data);
}
