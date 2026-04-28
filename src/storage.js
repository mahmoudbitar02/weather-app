export const STORAGE_CITY = "cityName";

export function getCityFromLocalStorag() {
  return JSON.parse(localStorage.getItem(STORAGE_CITY)) || [];
}

export function setCityToLocalStorag(cities) {
  localStorage.setItem(STORAGE_CITY, JSON.stringify(cities));
}
