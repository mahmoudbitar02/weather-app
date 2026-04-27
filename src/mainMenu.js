import { displayWeather } from "./detail";
import { fetchWeatherForecastData } from "./fetching";
import { container } from "./main";
import { showSpinner } from "./spinner";

import { containerBackground, formatTemperature, getBackgroundStyle } from "./utils";

document.addEventListener("click", (e) => getMainEls(e));

export function renderMainHtml() {
  showSpinner("lade Übersicht");
  loadMain();
}

async function loadMain() {
  container.innerHTML = `
    <div class="main">
        ${renderMainHeader()}
        <div class="main-cards">
            ${await renderMainCards()} 
        </div>
    </div>
  `;
}

function renderMainHeader() {
  return `
    <div class="main-header">
        <div class="main-header__top">
        <div class="main-header__title">Wetter</div>
        <button class="main-header__btn">Bearbeiten</button>
        </div>
        <input type="text" placeholder="Nach Stadt suchen..." class="main-header__search" />
  </div>
  `;
}

async function renderMainCards() {
  const favoriteCities = ["Mannheim", "Buchen", "nyc", "Kuwait"];

  const allCitiesElement = [];

  for (let city of favoriteCities) {
    const weatherData = await fetchWeatherForecastData(city, 1);
    const { location, current, forecast } = weatherData;
    const cityCont = document.querySelectorAll(".city-card");

    const cityHtml = `
    <div class="city-card" data-city="${location.name}" style="${getBackgroundStyle(weatherData)}"> 
      <div class="city-card__left">
        <div class="city-card__left-main">
          <div class="city-card__title">${location.name}</div>
          <div class="city-card__location">${location.country}</div>
        </div>
        <div class="city-card__condition">${current.condition.text}</div>
      </div>
      <div class="city-card__right">
        <div class="city-card__temp">${formatTemperature(forecast.forecastday[0].day.maxtemp_c)}</div>
        <div class="city-card__temps">
          <span class="city-card__temp-heigt">H:${formatTemperature(forecast.forecastday[0].day.maxtemp_c)}</span>
          <span class="city-card__temp-low">T:${formatTemperature(forecast.forecastday[0].day.mintemp_c)}</span>
        </div>
      </div>
    </div>
  
    `;
    allCitiesElement.push(cityHtml);
  }
  const favoritCitiesElements = allCitiesElement.join("");
  return favoritCitiesElements;
}

function getMainEls(e) {
  const card = e.target.closest(".city-card");
  if (card) {
    const city = card.dataset.city;

    displayWeather(city);
  }
}
