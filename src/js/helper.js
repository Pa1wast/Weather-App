export const API_KEY = 'ecdfbd386d04459d8a9100346231710';

export async function fetchApi(latitude, longitude, API_KEY, requestType) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/${requestType}.json?key=${API_KEY}&q=${latitude},${longitude}&days=${3}aqi=no`
  );

  const data = await response.json();

  console.log({data});
  return data;
}

export function getCoords(position, state) {
  state.position.latitude = position.coords.latitude;
  state.position.longitude = position.coords.longitude;
}
