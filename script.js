const apiKey = "574ce25436b44445941151647250507"; // WeatherAPI key

const getWeatherBtn = document.getElementById("getWeatherBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDataDiv = document.getElementById("weatherData");

// ✅ Your Render backend URL
const backendBaseUrl = "https://weather-backend-65j7.onrender.com";

// 🔁 Load previously saved city on page load
window.addEventListener("load", () => {
  axios.get(`${backendBaseUrl}/api/preference`)
    .then((response) => {
      const savedCity = response.data.city;
      if (savedCity) {
        cityInput.value = savedCity;
        getWeatherBtn.click(); // Automatically fetch weather
      }
    })
    .catch((error) => {
      console.error("Error fetching saved city:", error);
    });
});

// 📥 Handle button click to fetch weather
getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  axios.get(apiUrl)
    .then((response) => {
      const data = response.data;

      cityName.textContent = `${data.location.name}, ${data.location.region}`;
      temperature.textContent = `Temperature: ${data.current.temp_c} °C (Feels like ${data.current.feelslike_c} °C)`;
      condition.textContent = `Condition: ${data.current.condition.text}`;
      weatherIcon.src = "https:" + data.current.condition.icon;
      weatherIcon.alt = data.current.condition.text;

      weatherDataDiv.classList.remove("hidden");

      // ✅ Save city to backend (Render)
      axios.post(`${backendBaseUrl}/api/preference`, { city })
        .then(() => console.log("✅ City saved successfully"))
        .catch((err) => console.error("❌ Error saving city:", err));
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("City not found or API error.");
      weatherDataDiv.classList.add("hidden");
    });
});
