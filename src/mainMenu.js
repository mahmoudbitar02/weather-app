import { displayWeather } from "./detail";
import { FetchSearchData, fetchWeatherForecastData } from "./fetching";
import { showSpinner } from "./spinner";
import { formatTemperature } from "./utils";

import { deleteCityFromLocalStorage, getCityFromLocalStorag, setCityToLocalStorag } from "./storage";
import { container } from "./main";
import { getConditionImagePath } from "./conditions";
import debounce from "debounce";

function registerEventListeners() {
  document.removeEventListener("click", showCityDetails);
  document.removeEventListener("click", searchedCity);
  document.removeEventListener("click", deleteCard);
  document.removeEventListener("click", handelBodyClick);

  document.addEventListener("click", showCityDetails);
  document.addEventListener("click", searchedCity);
  document.addEventListener("click", deleteCard);
  document.addEventListener("click", handelBodyClick);
}

export function renderMainHtml() {
  container.classList.remove("show-background");

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
  handleEditButton();
  registerEventListeners();
}

function renderMainHeader() {
  return `
    <div class="main-header">
        <div class="main-header__top">
            <div class="main-header__title">Wetter</div>
            <button class="main-header__btn">Bearbeiten</button>
        </div>
        <input type="text" placeholder="Nach Stadt suchen..." class="main-header__search" />
        <div class="main-header__search-results"> </div>
  </div>
  `;
}

async function renderMainCards() {
  let favoriteCities = getCityFromLocalStorag();

  if (!favoriteCities || favoriteCities.length < 1) {
    return "<p>Noch keine Favoriten gespeichert</p>";
  }

  const allCitiesElement = [];

  for (let city of favoriteCities) {
    const weatherData = await fetchWeatherForecastData(city, 1);
    const { location, current, forecast } = weatherData;
    console.log(forecast.forecastday[0].hour);

    const conditionImage = getConditionImagePath(current.condition.code, !current.is_day);

    const deleteIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
`;

    const cityHtml = `    
    <div class="main-cards__wrapper">
      <button class="main-cards__delete-btn hidden" >${deleteIcon}</button>
      <div class="city-card"  data-id="${city}" data-name="${location.name}" ${conditionImage ? `style="--condition-image: url(${conditionImage})"` : ""}> 
        <div class="city-card__left">
          <div class="city-card__left-main">
            <div class="city-card__title">${location.name}</div>
            <div class="city-card__location">${location.country}</div>
          </div>
          <div class="city-card__condition">${current.condition.text}</div>
        </div>
        <div class="city-card__right">
          <div class="city-card__temp">${formatTemperature(current.temp_c)}</div>
          <div class="city-card__temps">
            <span class="city-card__temp-heigt">H:${formatTemperature(forecast.forecastday[0].day.maxtemp_c)}</span>
            <span class="city-card__temp-low">T:${formatTemperature(forecast.forecastday[0].day.mintemp_c)}</span>
          </div>
        </div>
      </div>
    </div>
  
    `;
    allCitiesElement.push(cityHtml);
  }
  const favoritCitiesElements = allCitiesElement.join("");
  return favoritCitiesElements;
}

function showCityDetails(e) {
  const card = e.target.closest(".city-card");
  if (card) {
    const city = card.dataset.id;
    const cityName = card.dataset.name;

    displayWeather(city, cityName);
  }
}

async function handelSearch(e) {
  const searchContainer = document.querySelector(".main-header__search-results");

  const inputCity = e.target.value.trim();
  if (inputCity.length < 1) {
    searchContainer.innerHTML = "";
    return;
  }

  searchContainer.innerHTML = `Suche nach ${inputCity}...`;
  const results = await FetchSearchData(inputCity);
  renderSearchHtml(results);
}

async function searchInput() {
  const inputEl = document.querySelector(".main-header__search");
  const searchContainer = document.querySelector(".main-header__search-results");

  inputEl.addEventListener("focus", () => {
    searchContainer.classList.remove("search--hidden");
  });

  inputEl.addEventListener("input", debounce(handelSearch, 500));
}

function handelBodyClick(e) {
  const searchContainer = document.querySelector(".main-header__search-results");

  if (!searchContainer) return;
  if (searchContainer.contains(e.target) || e.target.closest(".main-header__search")) {
    return;
  }
  searchContainer.classList.add("search--hidden");
}

function renderSearchHtml(results) {
  const searchContainer = document.querySelector(".main-header__search-results");

  const cityElements = results.map((city) => {
    return `
        <div class="searched-city-item" data-id="${city.id}" data-name="${city.name}">
          <span class="searched-city-item__city"> ${city.name},</span>
          <span class="searched-city-item__city"> ${city.country},</span>
          <span class="searched-city-item__city"> ${city.region}</span>

        </div>
    `;
  });

  searchContainer.innerHTML = `<div class="search__searched-city">${cityElements.join("")} </div>`;
}

function searchedCity(e) {
  const cityEl = e.target.closest(".searched-city-item");
  if (cityEl) {
    const cityId = cityEl.dataset.id;
    displayWeather(cityId, cityEl.dataset.name);
  }
}

function handleEditButton() {
  const editBtnEl = document.querySelector(".main-header__btn");
  let isEditMode = false;
  editBtnEl.addEventListener("click", () => {
    isEditMode = !isEditMode;
    editBtnEl.innerHTML = isEditMode ? "Fertig" : "Bearbeiten";
    const deleteBtnEls = document.querySelectorAll(".main-cards__delete-btn");

    deleteBtnEls.forEach((btn) => {
      btn.classList.toggle("hidden");
    });
  });
}

function deleteCard(e) {
  const deleteBtn = e.target.closest(".main-cards__delete-btn");
  const editBtnEl = document.querySelector(".main-header__btn");
  if (!deleteBtn) return;
  const card = deleteBtn.closest(".main-cards__wrapper");
  const cityId = card.querySelector(".city-card").dataset.id;
  deleteCityFromLocalStorage(cityId);
  card.remove();

  if (getCityFromLocalStorag().length === 0) {
    const mainCardsEl = document.querySelector(".main-cards");
    mainCardsEl.innerHTML = "<p>Noch keine Favoriten gespeichert</p>";
    editBtnEl.innerHTML = "Bearbeiten";
    editBtnEl.disabled = true;
  }
}
