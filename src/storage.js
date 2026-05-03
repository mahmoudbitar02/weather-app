export const STORAGE_CITY = "cityName";

export function setCityToLocalStorag(cityName) {
  const cities = JSON.parse(localStorage.getItem(STORAGE_CITY)) || [];
  if (cities.find((city) => city === cityName)) {
    alert(cityName + " City has been added");
    return;
  }
  cities.push(cityName);
  localStorage.setItem(STORAGE_CITY, JSON.stringify(cities));
}

export function getCityFromLocalStorag() {
  return JSON.parse(localStorage.getItem(STORAGE_CITY)) || [];
}

export function deleteCityFromLocalStorage(cityName) {
  const cities = getCityFromLocalStorag();
  const newCities = cities.filter((city) => city !== cityName);
  localStorage.setItem(STORAGE_CITY, JSON.stringify(newCities));
}
