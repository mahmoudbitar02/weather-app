import { displayWeather } from "./detail";
import "./styles/spinner.scss";
import "./styles/style.scss";
import "./styles/today-forcast.scss";

export const container = document.querySelector(".container");

displayWeather("Tokyo");
