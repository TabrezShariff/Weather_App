const day_element = document.querySelector(".day");
const date_element = document.querySelector(".date");
const location_element = document.querySelector(".location p");
const icon_element = document.querySelector(".icon");
const temp_element = document.querySelector(".temp");
const temp_detail_element = document.querySelector(".temp_detail");

const precipitation_element = document.querySelector("#prec");
const humidity_element = document.querySelector("#hum");
const wind_element = document.querySelector("#win");

const api_Key = "Your_openWeather_api";

async function fetch_data(city) {
  const url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_Key}`;

  try {
    const response = await fetch(url1);
    const data = await response.json();
    update_weather(data);
  } catch (error) {
    console.log(`Weather fetch failed : ${error}`);
  }
}

function update_weather(data) {
  location_element.textContent = `${data.name}, ${data.sys.country}`;
  temp_element.textContent = `${data.main.temp.toFixed(2)}°C`;
  temp_detail_element.textContent = data.weather[0].main;
  humidity_element.textContent = `Humidity : ${data.main.humidity}%`;
  wind_element.textContent = `Wind : ${data.wind.speed} km/h`;

  if (data.rain && data.rain["1h"]) {
    precipitation_element.textContent = `Precipitation : ${data.rain["1h"]}%`;
  } else {
    precipitation_element.textContent = `Precipitation : 0%`;
  }

  const today = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  day_element.textContent = days[today.getDay()];
  date_element.textContent = `${today.getDate()} ${
    months[today.getMonth()]
  } ${today.getFullYear()}`;

  const weatherType = data.weather[0].main.toLowerCase();
  icon_element.src = `assets/images/${weatherType}_icon.png`;
}

async function fetchForecast(city) {
  const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_Key}&units=metric`;
  const response = await fetch(url2);
  const data = await response.json();

  const forecastData = {};

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const temp = item.main.temp;

    if (!forecastData[date]) {
      forecastData[date] = [];
    }

    forecastData[date].push(temp);
  });

  const forecastElements = document.querySelectorAll(".weekday");
  let index = 0;

  Object.keys(forecastData)
    .slice(1, 5)
    .forEach((date) => {
      const temps = forecastData[date];
      const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(
        0
      );
      const day = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      forecastElements[index].innerHTML = `<p>${day}</p><p>${avgTemp}°C</p>`;
      index++;
    });
}

function searchCity() {
  const cityinput = document.getElementById("location-input").value;
  if (cityinput.trim() !== "") {
    fetch_data(cityinput);
    fetchForecast(cityinput);
  }
}

fetch_data("Delhi");
fetchForecast("Delhi");
