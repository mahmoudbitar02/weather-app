export const STORAGE_CITY = "cityName";

export function setCityToLocalStorag(cityID) {
  const cities = JSON.parse(localStorage.getItem(STORAGE_CITY)) || [];
  if (cities.find((city) => city === cityID)) {
    alert(cityID + " City has been added");
    return;
  }
  cities.push(cityID);
  localStorage.setItem(STORAGE_CITY, JSON.stringify(cities));
}

export function getCityFromLocalStorag() {
  return JSON.parse(localStorage.getItem(STORAGE_CITY)) || [];
}

export function deleteCityFromLocalStorage(cityID) {
  const cities = getCityFromLocalStorag();
  const newCities = cities.filter((city) => city !== cityID);
  localStorage.setItem(STORAGE_CITY, JSON.stringify(newCities));
}
