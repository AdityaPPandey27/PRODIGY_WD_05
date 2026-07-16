// script.js

// Constants & State
const BASE_URL = "https://api.openweathermap.org/data/2.5";
let units = localStorage.getItem("weather_units") || "metric"; // 'metric' (C) or 'imperial' (F)
let currentCity = localStorage.getItem("last_city") || "London";
let favorites = JSON.parse(localStorage.getItem("weather_favorites")) || [];
let searchHistory = JSON.parse(localStorage.getItem("weather_history")) || [];

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const refreshBtn = document.getElementById("refresh-btn");
const favBtn = document.getElementById("fav-btn");
const unitC = document.getElementById("unit-c");
const unitF = document.getElementById("unit-f");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("error-message");
const weatherContent = document.getElementById("weather-content");
const searchDropdown = document.getElementById("search-dropdown");

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    updateUnitButtons();
    getWeatherData(currentCity);
    populateDropdowns();

    // Auto-fetch location if permission was previously granted (silent fail if not)
    if (navigator.geolocation) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            if (result.state === 'granted') {
                fetchLocationWeather();
            }
        });
    }
});

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSearch(); });
searchInput.addEventListener("focus", () => searchDropdown.classList.remove("hidden"));
document.addEventListener("click", (e) => {
    if (!e.target.closest('.search-container')) searchDropdown.classList.add("hidden");
});

locationBtn.addEventListener("click", fetchLocationWeather);
refreshBtn.addEventListener("click", () => getWeatherData(currentCity));
favBtn.addEventListener("click", toggleFavorite);

unitC.addEventListener("click", () => {
    if (units !== "metric") { units = "metric"; saveUnitsAndRefresh(); }
});
unitF.addEventListener("click", () => {
    if (units !== "imperial") { units = "imperial"; saveUnitsAndRefresh(); }
});

// Main Fetch Logic
async function getWeatherData(city, lat = null, lon = null) {
    showLoader();
    try {
        let weatherUrl = lat && lon 
            ? `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
            : `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`;
            
        const weatherRes = await fetch(weatherUrl);
        if (!weatherRes.ok) throw new Error("City not found");
        const weatherData = await weatherRes.json();

        // Update current city reference
        currentCity = weatherData.name;
        localStorage.setItem("last_city", currentCity);
        addToHistory(currentCity);
        checkFavoriteStatus();

        // Fetch Forecast & AQI using coordinates from current weather
        const lat_coord = weatherData.coord.lat;
        const lon_coord = weatherData.coord.lon;
        
        const [forecastData, aqiData] = await Promise.all([
            fetch(`${BASE_URL}/forecast?lat=${lat_coord}&lon=${lon_coord}&appid=${API_KEY}&units=${units}`).then(res => res.json()),
            fetch(`${BASE_URL}/air_pollution?lat=${lat_coord}&lon=${lon_coord}&appid=${API_KEY}`).then(res => res.json())
        ]);

        updateUI(weatherData, forecastData, aqiData);
        updateBackgroundTheme(weatherData.weather[0].main, weatherData.sys.sunset, weatherData.sys.sunrise, weatherData.dt);
        
        hideLoader();
    } catch (error) {
        showError(error.message);
    }
}

function fetchLocationWeather() {
    if (navigator.geolocation) {
        showLoader();
        navigator.geolocation.getCurrentPosition(
            (position) => getWeatherData(null, position.coords.latitude, position.coords.longitude),
            (error) => {
                showError("Location access denied.");
                hideLoader();
            }
        );
    } else {
        showError("Geolocation not supported by your browser.");
    }
}

// UI Updaters
function updateUI(weather, forecast, aqi) {
    // Top Info
    document.getElementById("city-name").textContent = `${weather.name}, ${weather.sys.country}`;
    updateDateTime(weather.timezone);
    
    // Main Weather
    const iconCode = weather.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    document.getElementById("weather-icon").classList.remove("hidden");
    document.getElementById("current-temp").textContent = `${Math.round(weather.main.temp)}°`;
    document.getElementById("weather-desc").textContent = weather.weather[0].description;
    document.getElementById("feels-like").textContent = `${Math.round(weather.main.feels_like)}°`;

    // Speed conversion (API returns m/s for metric, mph for imperial)
    const windUnit = units === "metric" ? "m/s" : "mph";
    
    // Info Cards
    document.getElementById("humidity").textContent = `${weather.main.humidity}%`;
    document.getElementById("wind-speed").textContent = `${weather.wind.speed.toFixed(1)} ${windUnit}`;
    document.getElementById("pressure").textContent = `${weather.main.pressure} hPa`;
    document.getElementById("visibility").textContent = `${(weather.visibility / 1000).toFixed(1)} km`;
    
    // AQI parsing
    const aqiIndex = aqi.list[0].main.aqi;
    const aqiLabels = {1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor'};
    document.getElementById("aqi").textContent = `${aqiIndex} - ${aqiLabels[aqiIndex]}`;
    
    document.getElementById("cloud-cover").textContent = `${weather.clouds.all}%`;
    document.getElementById("sunrise").textContent = formatTime(weather.sys.sunrise, weather.timezone);
    document.getElementById("sunset").textContent = formatTime(weather.sys.sunset, weather.timezone);

    updateForecastUI(forecast);
}

function updateForecastUI(forecast) {
    const hourlyContainer = document.getElementById("hourly-forecast");
    const dailyContainer = document.getElementById("daily-forecast");
    
    hourlyContainer.innerHTML = '';
    dailyContainer.innerHTML = '';

    // Hourly Forecast (Next 24 hours -> approx 8 segments of 3 hours)
    for(let i = 0; i < 8; i++) {
        const item = forecast.list[i];
        const time = new Date(item.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        hourlyContainer.innerHTML += createForecastCard(time, item.weather[0].icon, item.main.temp, item.pop);
    }

    // Daily Forecast (Extracting one reading per day, usually mid-day)
    const dailyData = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));
    dailyData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
        dailyContainer.innerHTML += createForecastCard(date, item.weather[0].icon, item.main.temp, item.pop);
    });
}

function createForecastCard(title, icon, temp, pop) {
    const rainChance = pop > 0 ? `<p style="color:#4facfe; font-size:0.8rem"><i class="fa-solid fa-umbrella"></i> ${Math.round(pop * 100)}%</p>` : '';
    return `
        <div class="forecast-item">
            <p>${title}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
            <p class="temp">${Math.round(temp)}°</p>
            ${rainChance}
        </div>
    `;
}

// Helpers & Utilities
function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        getWeatherData(query);
        searchInput.value = '';
        searchDropdown.classList.add("hidden");
    }
}

function updateDateTime(timezoneOffset) {
    const localTime = new Date().getTime();
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const cityTime = new Date(utc + (1000 * timezoneOffset));
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById("date-time").textContent = cityTime.toLocaleDateString('en-US', options);
}

function formatTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toISOString().substr(11, 5); // Extracts HH:MM
}

function updateBackgroundTheme(condition, sunset, sunrise, currentDt) {
    const isNight = currentDt > sunset || currentDt < sunrise;
    document.body.className = ''; // Reset
    
    if (isNight) {
        document.body.classList.add("theme-night");
    } else {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('clear')) document.body.classList.add("theme-clear");
        else if (conditionLower.includes('cloud')) document.body.classList.add("theme-clouds");
        else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) document.body.classList.add("theme-rain");
        else if (conditionLower.includes('snow')) document.body.classList.add("theme-snow");
        else if (conditionLower.includes('thunderstorm')) document.body.classList.add("theme-thunderstorm");
        else document.body.classList.add("theme-default");
    }
}

function saveUnitsAndRefresh() {
    localStorage.setItem("weather_units", units);
    updateUnitButtons();
    getWeatherData(currentCity);
}

function updateUnitButtons() {
    if(units === "metric") {
        unitC.classList.add("active");
        unitF.classList.remove("active");
    } else {
        unitF.classList.add("active");
        unitC.classList.remove("active");
    }
}

// History & Favorites Management
function addToHistory(city) {
    searchHistory = searchHistory.filter(item => item !== city);
    searchHistory.unshift(city);
    if(searchHistory.length > 5) searchHistory.pop();
    localStorage.setItem("weather_history", JSON.stringify(searchHistory));
    populateDropdowns();
}

function toggleFavorite() {
    if (favorites.includes(currentCity)) {
        favorites = favorites.filter(city => city !== currentCity);
    } else {
        favorites.push(currentCity);
    }
    localStorage.setItem("weather_favorites", JSON.stringify(favorites));
    checkFavoriteStatus();
    populateDropdowns();
}

function checkFavoriteStatus() {
    if (favorites.includes(currentCity)) {
        favBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #ff4757;"></i>';
    } else {
        favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
}

function populateDropdowns() {
    const favList = document.getElementById("favorites-list");
    const histList = document.getElementById("history-list");
    
    favList.innerHTML = favorites.length ? '' : '<li style="opacity:0.5">No favorites yet</li>';
    favorites.forEach(city => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-star" style="color: gold; margin-right: 5px;"></i> ${city}`;
        li.onclick = () => { getWeatherData(city); searchDropdown.classList.add("hidden"); };
        favList.appendChild(li);
    });

    histList.innerHTML = searchHistory.length ? '' : '<li style="opacity:0.5">No recent searches</li>';
    searchHistory.forEach(city => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-clock-rotate-left" style="margin-right: 5px;"></i> ${city}`;
        li.onclick = () => { getWeatherData(city); searchDropdown.classList.add("hidden"); };
        histList.appendChild(li);
    });
}

// State Handlers
function showLoader() {
    loader.classList.remove("hidden");
    weatherContent.classList.add("hidden");
    errorMsg.classList.add("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
    weatherContent.classList.remove("hidden");
}

function showError(msg) {
    loader.classList.add("hidden");
    weatherContent.classList.add("hidden");
    errorMsg.classList.remove("hidden");
    document.getElementById("error-text").textContent = msg;
}