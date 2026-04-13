import { displayWeather } from "./detail";
import "./styles/spinner.scss";
import "./styles/style.scss";
import "./styles/today-forcast.scss";

export const container = document.querySelector(".container");
export const todayForcastContainer = document.querySelector(".today-forcast__data");

displayWeather("Mannheim");
