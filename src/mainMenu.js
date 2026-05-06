import { displayWeather } from "./detail";
import { FetchSearchData, fetchWeatherForecastData } from "./fetching";
import { showSpinner } from "./spinner";
import { formatTemperature } from "./utils";

import { deleteCityFromLocalStorage, getCityFromLocalStorag, setCityToLocalStorag } from "./storage";
import { container } from "./main";
import { getConditionImagePath } from "./conditions";
import debounce from "debounce";

document.addEventListener("click", (e) => getMainEls(e));
document.addEventListener("click", (e) => searchedCity(e));
document.addEventListener("click", (e) => deleteCard(e));

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

  if (!favoriteCities || favoriteCities.length < 1) {
    return "Noch keine Favoriten gespeichert";
  }

  const allCitiesElement = [];

  for (let city of favoriteCities) {
    const weatherData = await fetchWeatherForecastData(city, 1);
    const { location, current, forecast } = weatherData;
    console.log(current.condition.code);
    const conditionImage = getConditionImagePath(current.condition.code, !current.is_day);
    console.log(conditionImage);
    const deleteIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
`;

    const cityHtml = `
       
    <div class="main-cards__wrapper">
      <button class="main-cards__delete-btn hidden" >${deleteIcon}</button>
      

      <div class="city-card" data-city="${location.name}" ${conditionImage ? `style="--condition-image: url(${conditionImage})"` : ""}> 
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

async function handelSearch(e) {
  const searchContainer = document.querySelector(".search");

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

  inputEl.addEventListener("input", debounce(handelSearch, 500));
}

function renderSearchHtml(results) {
  const searchContainer = document.querySelector(".search");
  console.log(results);

  const cityElements = [];

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
    cityElements.push(html);
  });
  searchContainer.innerHTML = `<div class=searchd-city>${cityElements.join("")} </div>`;
}

function searchedCity(e) {
  const cityEl = e.target.closest(".search-item");
  if (cityEl) {
    const cityId = cityEl.dataset.id;
    console.log(cityId);
    displayWeather(cityId);
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
  if (!deleteBtn) return;
  const card = deleteBtn.closest(".main-cards__wrapper");
  const cityId = card.querySelector(".search-item").dataset.id;
  console.log(cityId);
  deleteCityFromLocalStorage(cityId);
  deleteBtn.parentElement.remove();
  // renderMainHtml();
}
