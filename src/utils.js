import { getConditionImagePath } from "./conditions";

export function formatTemperature(temp) {
  return `${Math.round(temp)}°`;
}

export function getDeutschlandTime(date, time) {
  const getTime = new Date(`${date} ${time}`);

  return getTime.toLocaleString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getState(data) {
  const currentDate = data.forecast.forecastday[0].date;
  const stats = [
    {
      title: "Feuchtigkeit",
      value: `${data.current.humidity}%`,
    },
    {
      title: "Wind",
      value: `${data.current.wind_kph} km/h`,
    },
    {
      title: "Druck",
      value: `${data.current.pressure_mb} hPa`,
    },
    {
      title: "Gefühlt",
      value: `${formatTemperature(data.current.feelslike_c)}`,
    },
    {
      title: "Sonnenaufgang",
      value: `${getDeutschlandTime(currentDate, data.forecast.forecastday[0].astro.sunrise)} Uhr`,
    },
    {
      title: "Sonnenuntergang",
      value: `${getDeutschlandTime(currentDate, data.forecast.forecastday[0].astro.sunset)} Uhr`,
    },
  ];
  return stats;
}

export function containerBackground(data, container) {
  const imagePath = getConditionImagePath(data.current.condition.code, !data.current.is_day);
  console.log(data.current.is_day);
  console.log("Hellllllllllllo");

  container.style.backgroundImage = `url(${imagePath})`;
  container.style.backgroundSize = "cover";
  container.style.backgroundPosition = "center";
}
