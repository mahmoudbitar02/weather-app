import { fetchWeatherForecastData } from "./fetching";
import { container } from "./main";
import { showSpinner } from "./spinner";
import { formatTemperature } from "./utils";

export async function displayWeather(city) {
  showSpinner(city);
  const data = await fetchWeatherForecastData(city);
  container.innerHTML = getWeatherHTML(data);
}

function getWeatherHTML(data) {
  const forcast = data.forecast.forecastday[0];
  return `
    <div class="city">
        <h2 class="city__name">${data.location.name}</h2>
        <p class="city__temp">${Math.round(data.current.temp_c)}°</p>
        <p class="city__desc">${data.current.condition.text}</p>
        <div class="city__temp-range">
          <span class="city__temp-high">H: ${formatTemperature(forcast.day.maxtemp_c)}</span>
          <span class="city__temp-low">L: ${formatTemperature(forcast.day.mintemp_c)}</span>
        </div> 
      </div>


  `;
}
