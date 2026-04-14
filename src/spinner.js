import { container } from "./main";

export function showSpinner(city) {
  container.innerHTML = getSpinnerHTML(city);
}

function getSpinnerHTML(city) {
  return `
    <div class="spinner">
      <div id="detail-spinner" class="spinner__icon hidden"></div>
      <div id="detail-spinner-text" class="spinner__text hidden">lade Wetterdaten für ${city}...</div>
    </div>
    
    `;
}
