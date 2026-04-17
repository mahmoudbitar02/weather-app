import { fetchWeatherForecastData } from "./fetching";
import { container } from "./main";
import { showSpinner } from "./spinner";
import { formatTemperature } from "./utils";

export async function displayWeather(city) {
  showSpinner(city);
  const data = await fetchWeatherForecastData(city);

  getWeatherHTML(data);
  getTodayForcastHTML(data);
}

async function getTodayForcastHTML(data) {
  console.log("hallo " + data.location.name);

  const now = new Date(data.location.localtime);
  console.log(now);
  const forcastDayOne = data.forecast.forecastday[0].hour;
  const forcastDayTwo = data.forecast.forecastday[1].hour;

  const forcastCondition = data.forecast.forecastday[0].day.condition.text;
  const maxWindPerKm = data.forecast.forecastday[0].day.maxwind_kph;

  const allHours = [...forcastDayOne, ...forcastDayTwo];
  const nextHours = allHours
    .filter((hour) => {
      const hourTime = new Date(hour.time);
      return hourTime >= now - 1 * 60 * 60 * 1000;
    })
    .slice(0, 24);

  renderTodayForcastHeader(forcastCondition, maxWindPerKm);

  AppendHourlyForcastToContainet(nextHours, forcastCondition, maxWindPerKm);
}

function getWeatherHTML(data) {
  const forcast = data.forecast.forecastday[0];
  const html = `
    <div class="city">
        <h2 class="city__name">${data.location.name}</h2>
        <p class="city__temp">${Math.round(data.current.temp_c)}°</p>
        <p class="city__desc">${data.current.condition.text}</p>
        <div class="city__temp-range">
          <span class="city__temp-high">H: ${formatTemperature(forcast.day.maxtemp_c)}</span>
          <span class="city__temp-low">L: ${formatTemperature(forcast.day.mintemp_c)}</span>
        </div> 
        <div class="city">
    
  `;
  container.innerHTML = html;
}

function renderHoursAndTemp(hour, temp, icon) {
  return `
  <div class="today-forcast__item">
              <span class="today-forcast__time">${hour} </span>
              <img class="today-forcast__icon" src="https:${icon}" alt="Weather icon" />
              <span class="today-forcast__temp">${formatTemperature(temp)}</span>
            </div>
    
  `;
}

function renderTodayForcastHeader(condition, maxWind) {
  return `
        <div class="today-forcast__header">
            <span class="today-forcast__condation">Heute ${condition}.</span>
            <span class="today-forcast__wind">Wind bis zu ${maxWind} km/h</span>
        </div>
    `;
}

function AppendHourlyForcastToContainet(nextHours, forcastCondition, maxWindPerKm) {
  const itemsHTML = nextHours
    .map((hour, index) => {
      const hourTime = hour.time.split(" ")[1].split(":")[0];
      const hourTemp = hour.temp_c;
      const hourIcon = hour.condition.icon;

      const hourTimeLabel = index === 0 ? "Jetzt" : `${hourTime} Uhr`;
      return renderHoursAndTemp(hourTimeLabel, hourTemp, hourIcon);
    })
    .join("");

  const html = `
        <div class="today-forcast">
            ${renderTodayForcastHeader(forcastCondition, maxWindPerKm)}
            <div class="today-forcast__data">
                ${itemsHTML}
            </div>
        </div>
    `;
  container.innerHTML += html;
}
