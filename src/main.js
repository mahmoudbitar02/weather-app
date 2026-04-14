import { displayWeather } from "./detail";
import "./styles/spinner.scss";
import "./styles/style.scss";
import "./styles/today-forcast.scss";

export const cityEl = document.querySelector(".city");
export const container = document.querySelector(".container");
export const todayForcastEl = document.querySelector(".today-forcast");

displayWeather("Homs");
