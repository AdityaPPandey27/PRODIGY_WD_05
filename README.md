# SkyCast Premium Weather Dashboard

A modern, responsive, and production-ready Weather Application built with HTML5, CSS3, and Vanilla JavaScript using the OpenWeatherMap API.

## Features

- **Live Weather Data**: Real-time current weather conditions.
- **Geolocation API**: Automatically fetches weather based on your current location.
- **City Search**: Search for any city worldwide.
- **Forecasts**: Includes an hourly (24-hour) and 5-Day forecast breakdown.
- **Dynamic Backgrounds**: The UI adapts its colors and gradients based on the current weather condition (Sunny, Cloudy, Rainy, Snow, Night).
- **Unit Toggle**: Instantly switch between Celsius and Fahrenheit.
- **Local Storage Integration**: Saves your last searched city, temperature unit preferences, recent search history, and favorite cities.
- **Premium UI**: Designed with Glassmorphism effects, floating animations, and a modern grid layout fully responsive across mobile, tablet, and desktop devices.
- **Detailed Metrics**: Displays Humidity, Wind Speed, Pressure, Visibility, AQI (Air Quality Index), Cloud Cover, Sunrise, and Sunset times.

## Setup Instructions

1. Clone or download this repository.
2. Go to [OpenWeatherMap](https://openweathermap.org/) and create a free account.
3. Click on your account name in the top right corner of the screen.
4. Select "My API keys" from the dropdown menu.
5. You will see a default API key already generated for you (it will look like a long string of random letters and numbers).
6. Open `config.js` and replace `"YOUR_API_KEY"` with your actual API key:
   ```javascript
   const API_KEY = "YOUR_API_KEY";
