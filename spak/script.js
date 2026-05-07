const apiKey = "5f476ae0e688634915b65cdc2ae3ed27";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const suggestionsBox = document.getElementById("suggestions");


// =======================
// SEARCH BUTTON
// =======================

searchBtn.addEventListener("click", () => {

  if(cityInput.value.trim() !== "") {

    getWeather(cityInput.value);

    suggestionsBox.innerHTML = "";

  }

});


// =======================
// AUTO SUGGESTIONS
// =======================

cityInput.addEventListener("input", async () => {

  const query = cityInput.value.trim();

  if(query.length < 2){

    suggestionsBox.innerHTML = "";

    return;

  }

  try{

    // BETTER CITY SEARCH API

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=7&appid=${apiKey}`
    );

    const data = await response.json();

    suggestionsBox.innerHTML = "";

    // REMOVE DUPLICATES

    const uniqueCities = [];

    data.forEach(city => {

      const cityName =
      `${city.name}, ${city.country}`;

      if(!uniqueCities.includes(cityName)){

        uniqueCities.push(cityName);

        const div = document.createElement("div");

        div.classList.add("suggestion-item");

        div.innerHTML = `
          <strong>${city.name}</strong>
          ${city.state ? ", " + city.state : ""}
          , ${city.country}
        `;

        div.addEventListener("click", () => {

          cityInput.value = city.name;

          suggestionsBox.innerHTML = "";

          getWeather(city.name);

        });

        suggestionsBox.appendChild(div);

      }

    });

  }catch(error){

    console.log(error);

  }

});


// CLICK OUTSIDE CLOSES SUGGESTIONS

document.addEventListener("click", (e) => {

  if(!document.querySelector(".search-box").contains(e.target)) {

    suggestionsBox.innerHTML = "";

  }

});


// =======================
// CURRENT WEATHER
// =======================

async function getWeather(city){

  try{

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if(data.cod != 200){

      alert("City not found");

      return;

    }

    document.getElementById("cityName").innerText =
    data.name;

    document.getElementById("weatherDesc").innerText =
    data.weather[0].description;

    document.getElementById("temperature").innerText =
    `${Math.round(data.main.temp)}°C`;

    document.getElementById("humidity").innerText =
    `${data.main.humidity}%`;

    document.getElementById("wind").innerText =
    `${data.wind.speed} km/h`;

    document.getElementById("feelsLike").innerText =
    `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    updateBackground(data.weather[0].main);

    const lat = data.coord.lat;
    const lon = data.coord.lon;

    getAQI(lat, lon);

    getForecast(lat, lon);

  }catch(error){

    console.log(error);

  }

}


// =======================
// AQI
// =======================

async function getAQI(lat, lon){

  try{

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const data = await response.json();

    const aqiValue = data.list[0].main.aqi;

    let aqiText = "";

    if(aqiValue === 1) aqiText = "Good";
    else if(aqiValue === 2) aqiText = "Fair";
    else if(aqiValue === 3) aqiText = "Moderate";
    else if(aqiValue === 4) aqiText = "Poor";
    else aqiText = "Very Poor";

    document.getElementById("aqi").innerText =
    `${aqiValue} - ${aqiText}`;

  }catch(error){

    console.log(error);

  }

}


// =======================
// FORECAST
// =======================

async function getForecast(lat, lon){

  try{

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    const forecastContainer =
    document.getElementById("forecastContainer");

    forecastContainer.innerHTML = "";

    const dailyForecasts =
    data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.slice(0,5).forEach(day => {

      const date = new Date(day.dt_txt);

      const dayName =
      date.toLocaleDateString("en-US", {
        weekday:"short"
      });

      const div = document.createElement("div");

      div.classList.add("forecast-card");

      div.innerHTML = `
        <h3>${dayName}</h3>

        <img
        src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

        <h2>${Math.round(day.main.temp)}°C</h2>

        <small>${day.weather[0].description}</small>
      `;

      forecastContainer.appendChild(div);

    });

  }catch(error){

    console.log(error);

  }

}


// =======================
// DYNAMIC BACKGROUND
// =======================

function updateBackground(weatherMain){

  const hour = new Date().getHours();

  let background =
  "linear-gradient(135deg, #74ebd5, #ACB6E5)";


  if(hour >= 19 || hour <= 5){

    background =
    "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";

  }

  else if(hour >= 6 && hour <= 11){

    background =
    "linear-gradient(135deg, #FFDEE9, #B5FFFC)";

  }

  else if(hour >= 12 && hour <= 16){

    background =
    "linear-gradient(135deg, #89f7fe, #66a6ff)";

  }

  else if(hour >= 17 && hour <= 18){

    background =
    "linear-gradient(135deg, #f6d365, #fda085)";

  }


  // WEATHER THEMES

  if(weatherMain === "Rain" || weatherMain === "Drizzle"){

    background =
    "linear-gradient(135deg, #4b6cb7, #182848)";

  }

  else if(weatherMain === "Thunderstorm"){

    background =
    "linear-gradient(135deg, #232526, #414345)";

  }

  else if(weatherMain === "Clouds"){

    background =
    "linear-gradient(135deg, #bdc3c7, #2c3e50)";

  }

  else if(weatherMain === "Snow"){

    background =
    "linear-gradient(135deg, #e6dada, #274046)";

  }

  else if(
    weatherMain === "Mist" ||
    weatherMain === "Fog" ||
    weatherMain === "Haze"
  ){

    background =
    "linear-gradient(135deg, #757f9a, #d7dde8)";

  }

  else if(weatherMain === "Clear"){

    if(hour >= 19 || hour <= 5){

      background =
      "linear-gradient(135deg, #141E30, #243B55)";

    }else{

      background =
      "linear-gradient(135deg, #56CCF2, #2F80ED)";

    }

  }

  document.body.style.background = background;

}


// DEFAULT CITY

getWeather("Hyderabad");