import { API_KEY } from "./keys.js";

const KEY = API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";

export async function fetchWeatherForecastData(city = "Mannheim") {
  const response = await fetch(`${BASE_URL}/forecast.json?key=${KEY}&q=${city}&lang=de&days=3`);
  const data = await response.json();
  console.log(data);
  return data;
}
