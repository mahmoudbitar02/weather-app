import { displayWeather } from "./detail";
import { FetchSearchData, fetchWeatherForecastData } from "./fetching";
import { container } from "./main";
import { showSpinner } from "./spinner";
import { getCityFromLocalStorag, setCityToLocalStorag } from "./storage";

import { containerBackground, formatTemperature, getBackgroundStyle } from "./utils";

document.addEventListener("click", (e) => getMainEls(e));
document.addEventListener("click", (e) => searchedCity(e));

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
  searchInput();
}

function renderMainHeader() {
  return `
    <div class="main-header">
        <div class="main-header__top">
            <div class="main-header__title">Wetter</div>
            <button class="main-header__btn">Bearbeiten</button>
        </div>
        <input type="text" placeholder="Nach Stadt suchen..." class="main-header__search" />
        <div class="search"> </div>
  </div>
  `;
}

async function renderMainCards() {
  let favoriteCities = getCityFromLocalStorag();

  setCityToLocalStorag(favoriteCities);

  const allCitiesElement = [];

  for (let city of favoriteCities) {
    const weatherData = await fetchWeatherForecastData(city, 1);
    const { location, current, forecast } = weatherData;

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

async function searchInput() {
  const inputEl = document.querySelector(".main-header__search");
  const searchContainer = document.querySelector(".search");

  inputEl.addEventListener("input", async (e) => {
    const inputCity = e.target.value.trim();
    if (inputCity.length < 1) {
      searchContainer.innerHTML = "";
      return;
    }
    const results = await FetchSearchData(inputCity);
    console.log(results);
    console.log(results[0].id);

    renderSearchHtml(results);
  });
}

function renderSearchHtml(results) {
  const searchContainer = document.querySelector(".search");

  const CityElements = [];

  if (!results.length) {
    searchContainer.innerHTML = "<p>Keine Ergebnisse</p>";
    return;
  }
  const cityEl = results.forEach((city) => {
    const html = `
     <div class="search-item" data-id="${city.id}" data-name="${city.name}"
            data-lat="${city.lat}"
            data-lon="${city.lon}">
          <span class="search-item__city"> ${city.name},</span>
          <span class="search-item__city"> ${city.country},</span>
          <span class="search-item__city"> ${city.region}</span>

        </div>
   
    `;
    CityElements.push(html);
  });
  searchContainer.innerHTML = `<div class=searchd-city>${CityElements.join("")} </div>`;
}

function searchedCity(e) {
  const cityEl = e.target.closest(".search-item");
  if (cityEl) {
    const cityName = cityEl.dataset.name;

    console.log(cityName);

    displayWeather(cityName);
  }
}
