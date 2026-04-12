import { displayWeather } from "./detail";
import "./styles/spinner.scss";
import "./styles/style.scss";

export const container = document.querySelector(".container");

displayWeather("Mannheim");
