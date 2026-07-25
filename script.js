const apiKey = "f9f97a551cd900a69648096e738495c6";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const weatherCard = document.getElementById("weatherCard");
const errorBox = document.getElementById("error");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    errorBox.textContent = "Please enter a city name.";
    errorBox.classList.remove("hidden");
    weatherCard.classList.add("hidden");
    return;
  }

  loading.classList.remove("hidden");
  errorBox.classList.add("hidden");
  weatherCard.classList.add("hidden");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      throw new Error("City not found");
    }

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDesc.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    weatherCard.classList.remove("hidden");
  } catch (error) {
    errorBox.textContent = "City not found. Please try again.";
    errorBox.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}
const locationBtn = document.getElementById("locationBtn");

locationBtn.addEventListener("click", getLocationWeather);

function getLocationWeather() {
  if (!navigator.geolocation) {
    errorBox.textContent = "Geolocation is not supported in your browser.";
    errorBox.classList.remove("hidden");
    return;
  }

  loading.classList.remove("hidden");
  errorBox.classList.add("hidden");
  weatherCard.classList.add("hidden");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
          throw new Error("Location weather not found");
        }

        cityName.textContent = `${data.name}, ${data.sys.country}`;
        weatherDesc.textContent = data.weather[0].description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        humidity.textContent = `${data.main.humidity}%`;
        wind.textContent = `${data.wind.speed} m/s`;
        feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

        weatherCard.classList.remove("hidden");
      } catch (error) {
        errorBox.textContent = "Could not fetch location weather.";
        errorBox.classList.remove("hidden");
      } finally {
        loading.classList.add("hidden");
      }
    },
    () => {
      loading.classList.add("hidden");
      errorBox.textContent = "Location access denied.";
      errorBox.classList.remove("hidden");
    }
  );
}