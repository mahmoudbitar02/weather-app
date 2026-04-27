export const STORAG_CITY = "cityName";

export function getCityFromLocalStorag() {
  return JSON.parse(localStorage.getItem(STORAG_CITY) || []);
}
