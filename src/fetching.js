import { API_KEY } from "./keys.js";

const KEY = API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";

export async function fetchWeatherForecastData(city, day = 3) {
  const response = await fetch(`${BASE_URL}/forecast.json?key=${KEY}&q=${city}&lang=de&days=${day}`);
  const data = await response.json();
  console.log(data);
  return data;
}

export async function FetchSearchData(cityName = "berlin") {
  const response = await fetch(`${BASE_URL}/search.json?key=${KEY}&q=${cityName}`);
  const data = await response.json();
  return data;
}
