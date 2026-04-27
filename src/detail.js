import { getConditionImagePath } from "./conditions";
import { fetchWeatherForecastData } from "./fetching";
import { container } from "./main";
import { showSpinner } from "./spinner";
import { containerBackground, formatTemperature, getDeutschlandTime, getState } from "./utils";

export async function displayWeather(city) {
  showSpinner(`lade Wetter für ${city} ...`);
  const data = await fetchWeatherForecastData(city);

  containerBackground(data, container);
  getWeatherHTML(data);
  getTodayForcastHTML(data);
  appendForecast3Days(data);
  renderMiniCard(data);
}

function getTodayForcastHTML(data) {
  console.log("hallo " + data.location.name);

  const now = new Date(data.location.localtime);
  const forecastDayOne = data.forecast.forecastday[0].hour;
  const forecastDayTwo = data.forecast.forecastday[1].hour;

  // Data day 1
  const forcastCondition = data.forecast.forecastday[0].day.condition.text;
  const maxWindPerKm = data.forecast.forecastday[0].day.maxwind_kph;

  const allHours = [...forecastDayOne, ...forecastDayTwo];

  const nextHours = allHours
    .filter((hour) => {
      const hourTime = new Date(hour.time);

      return hourTime >= now - 1 * 60 * 60 * 1000;
    })
    .slice(0, 24);

  appendHourlyForecastToContainer(nextHours, forcastCondition, maxWindPerKm);
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
    </div>
    
  `;
  container.innerHTML = getBackBtn() + html;
}

function getBackBtn() {
  const backIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
`;

  return `
    <div class="action">
      <div class="action__back">${backIcon} </div>
    </div>
  `;
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

function appendHourlyForecastToContainer(nextHours, forcastCondition, maxWindPerKm) {
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
  container.insertAdjacentHTML("beforeend", html);
}

function appendForecast3Days(data) {
  const days = data.forecast.forecastday.slice(0, 3);
  console.log(days);

  const innerHtml = days
    .map((day, index) => {
      const title =
        index === 0
          ? "Heute"
          : new Date(day.date).toLocaleDateString("de-DE", {
              weekday: "short",
            });

      return `
  
    <div class="days-forecast-card">
      <h3 class="days-forecast-card__title">${title}</h3>
      <img src="https:${day.day.condition.icon}" alt="" class="days-forecast-card__icon" />
      <span class="days-forecast-card__maxtemp">H:${formatTemperature(day.day.maxtemp_c)}</span>
      <span class="days-forecast-card__mintemp">T:${formatTemperature(day.day.mintemp_c)}</span>
      <p class="days-forecast-card__wind">${day.day.maxwind_kph} km/h</p>
    </div>
  
  `;
    })
    .join("");

  const html = `
    <div class="days-forecast">
      <h3 class="days-forecast__title">Vorhersage für die nächsten 3 Tage</h3>
      ${innerHtml}
    </div>
  `;

  container.insertAdjacentHTML("beforeend", html);
}

function renderMiniCard(data) {
  const weiterStatistic = getState(data)
    .map((state) => {
      return `
      <div class="mini-card-item">
        <p class="mini-card-item__title">${state.title}</p>
        <p class="mini-card-item__value">${state.value}</p>
      </div>
    `;
    })
    .join("");

  const html = `
    <div class="mini-card">
    ${weiterStatistic}
    </div>
    `;

  container.insertAdjacentHTML("beforeend", html);
}
