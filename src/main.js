import { fetchWeatherData } from "./fetching";
import "./styles/spinner.scss";
import "./styles/details.scss";

const spinnerEl = document.getElementById("detail-spinner");
const spinnerTextEl = document.getElementById("detail-spinner-text");
const container = document.querySelector(".container");

let city = "Mannheim"; // hier kannst du die Stadt anpassen, für die du die Wetterdaten anzeigen möchtest

async function displayWeather() {
  spinnerEl.classList.remove("hidden");
  spinnerTextEl.classList.remove("hidden");
  spinnerTextEl.textContent = `lade Wetterdaten für ${city}...`;

  const data = await fetchWeatherData(city);

  let html = "";
  html += `
    <div class="city">
        <h2 class="city__name">${data.location.name}</h2>
        <p class="city__temp">${Math.round(data.current.temp_c)}°</p>
        <p class="city__desc">${data.current.condition.text}</p>
        <div class="city__temp-range">
          <span class="city__temp-high">H: ${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°</span>
          <span class="city__temp-low">L: ${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°</span>
        </div> 
      </div>


  `;
  container.innerHTML = html;
  spinnerEl.classList.add("hidden");
  spinnerTextEl.classList.add("hidden");
}

displayWeather();
