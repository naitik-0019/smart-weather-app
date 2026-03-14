// ================= CONFIG =================
const apiKey = "518d8bd3f939d22a13f4075e71037965";

// ================= THEME TOGGLE =================
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}

// ================= GEO LOCATION =================
navigator.geolocation.getCurrentPosition(
  async function (position) {
    try {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Get city name from latitude & longitude
      const mapRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
      );
      const mapData = await mapRes.json();
      const city = mapData[0].name;

      // Fetch weather forecast
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await weatherRes.json();

      // ================= DOM ELEMENTS =================
      const cityMain = document.getElementById("city-name");
      const cityTemp = document.getElementById("metric");
      const weatherMain = document.querySelectorAll("#weather-main");
      const humidity = document.getElementById("humidity");
      const feelsLike = document.getElementById("feels-like");
      const wind = document.getElementById("wind");
      const pressure = document.getElementById("pressure");
      const advice = document.getElementById("advice");

      const weatherImg = document.querySelector(".weather-icon");
      const weatherImgs = document.querySelector(".weather-icons");

      const tempMin = document.getElementById("temp-min-today");
      const tempMax = document.getElementById("temp-max-today");

      // ================= CURRENT WEATHER =================
      cityMain.innerText = data.city.name;

      const temp = Math.floor(data.list[0].main.temp);
      cityTemp.innerText = temp + "°";

      humidity.innerText = data.list[0].main.humidity;
      feelsLike.innerText = Math.floor(data.list[0].main.feels_like);
      wind.innerText = data.list[0].wind.speed;
      pressure.innerText = data.list[0].main.pressure;

      tempMin.innerText = Math.floor(data.list[0].main.temp_min) + "°";
      tempMax.innerText = Math.floor(data.list[0].main.temp_max) + "°";

      weatherMain.forEach(
        el => (el.innerText = data.list[0].weather[0].description)
      );

      // ================= ALERTS =================
      if (temp >= 40) {
        alert("🔥 Heatwave Alert! Stay hydrated and avoid sunlight.");
      } else if (temp <= 5) {
        alert("❄️ Cold Wave Alert! Wear warm clothes.");
      }

      // ================= WEATHER ICON + ADVICE =================
      const condition = data.list[0].weather[0].main.toLowerCase();

      switch (condition) {
        case "rain":
          weatherImg.src = "img/rain.png";
          weatherImgs.src = "img/rain.png";
          advice.innerText = "☔ Carry an umbrella today";
          break;

        case "clear":
          weatherImg.src = "img/sun.png";
          weatherImgs.src = "img/sun.png";
          advice.innerText = "😎 Perfect day to go outside";
          break;

        case "snow":
          weatherImg.src = "img/snow.png";
          weatherImgs.src = "img/snow.png";
          advice.innerText = "🧣 Stay warm, snowfall expected";
          break;

        case "clouds":
        case "smoke":
          weatherImg.src = "img/cloud.png";
          weatherImgs.src = "img/cloud.png";
          advice.innerText = "☁️ Weather looks calm";
          break;

        case "mist":
        case "fog":
          weatherImg.src = "img/mist.png";
          weatherImgs.src = "img/mist.png";
          advice.innerText = "🚗 Low visibility, drive carefully";
          break;

        case "haze":
          weatherImg.src = "img/haze.png";
          weatherImgs.src = "img/haze.png";
          advice.innerText = "😷 Air quality may be low";
          break;

        case "thunderstorm":
          weatherImg.src = "img/thunderstorm.png";
          weatherImgs.src = "img/thunderstorm.png";
          advice.innerText = "⚡ Stay indoors, thunderstorm expected";
          break;

        default:
          advice.innerText = "🌤️ Have a great day!";
      }

      // ================= 6 DAY FORECAST =================
      displayForecast(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while fetching weather data.");
    }
  },
  () => {
    alert("📍 Please enable location access and refresh the page.");
  }
);

// ================= FORECAST FUNCTION =================
function displayForecast(data) {
  const forecastBox = document.getElementById("future-forecast-box");
  forecastBox.innerHTML = "";

  const days = {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!days[date]) {
      days[date] = {
        day: dayNames[new Date(date).getDay()],
        temp: Math.floor(item.main.temp) + "°",
        condition: item.weather[0].main.toLowerCase()
      };
    }
  });

  Object.values(days).slice(0, 6).forEach(day => {
    let icon = "img/sun.png";

    if (day.condition.includes("rain")) icon = "img/rain.png";
    else if (day.condition.includes("cloud")) icon = "img/cloud.png";
    else if (day.condition.includes("snow")) icon = "img/snow.png";

    forecastBox.innerHTML += `
      <div class="weather-forecast-box">
        <div class="day-weather">${day.day}</div>
        <div class="weather-icon-forecast">
          <img src="${icon}" />
        </div>
        <div class="temp-weather">${day.temp}</div>
      </div>
    `;
  });
}
