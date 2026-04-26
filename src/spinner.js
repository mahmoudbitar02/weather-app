import { container } from "./main";

export function showSpinner(message) {
  container.innerHTML = getSpinnerHTML(message);
}

function getSpinnerHTML(message) {
  return `
    <div class="spinner">
      <div id="detail-spinner" class="spinner__icon "></div>
      <div id="detail-spinner-text" class="spinner__text ">${message}</div>
    </div>
    
    `;
}
