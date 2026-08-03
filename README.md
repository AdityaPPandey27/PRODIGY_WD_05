<div align="center">
 
  # ⛅ SkyCast Premium Weather Dashboard
  
  **A highly polished, modern, and production-ready Weather Application.**

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
  [![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)]()
  [![OpenWeatherMap](https://img.shields.io/badge/OpenWeather-API-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white)]()
  [![License: MIT](https://img.shields.io/badge/License-MIT-success.svg?style=for-the-badge)]()
</div>

---

## 📖 About The Project

SkyCast is a feature-rich, front-end weather application built to provide real-time meteorological data with a premium, glassmorphism-inspired user interface. It is designed with performance, responsiveness, and user experience in mind, completely free of bulky frameworks.

Whether you need to check the exact chance of rain, air quality, or simply see how the weather will look for the rest of the week, SkyCast delivers it smoothly with stunning visual themes that adapt to current weather conditions.

---

## ✨ Key Features

- 📍 **Geolocation Support:** Instantly fetches weather for your current physical location upon granting permission.
- 🔍 **Global City Search:** Look up live weather data for millions of cities worldwide.
- 🕒 **Comprehensive Forecasts:** Provides detailed 24-hour (hourly) and 5-Day (daily) weather forecasts.
- 🎨 **Adaptive Dynamic Backgrounds:** The dashboard's background and styling change intelligently based on real-time weather conditions (e.g., Clear, Cloudy, Rain, Snow, Thunderstorm, Night).
- 🌡️ **Metric & Imperial Units:** One-click toggle between Celsius (°C) and Fahrenheit (°F).
- 💾 **Smart Local Storage:** Automatically remembers your last searched city, temperature unit preferences, recent search history, and saved favorite cities.
- 📱 **Fully Responsive UI:** Engineered with CSS Grid and Flexbox to look perfect on mobile phones, tablets, laptops, and ultra-wide desktop monitors.
- 📊 **In-Depth Weather Metrics:**
  - Humidity & Pressure
  - Wind Speed
  - Visibility
  - Air Quality Index (AQI)
  - Cloud Cover Percentage
  - Local Sunrise & Sunset Times

---

## 🚀 Getting Started

Follow these simple steps to get a local copy up and running.

### Prerequisites
You don't need Node.js or any build tools! All you need is a web browser and an API key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/skycast-weather-app.git
   ```
2. **Get a free API Key:**
   - Head over to [OpenWeatherMap](https://openweathermap.org/).
   - Sign up for a free account.
   - Navigate to "My API Keys" to generate your key.
3. **Configure your API Key:**
   - Open the `config.js` file in the root directory.
   - Replace the placeholder string with your actual API key:
     ```javascript
     // config.js
     const API_KEY = "ENTER_YOUR_API_KEY_HERE";
     ```
4. **Run the app:**
   - Simply double-click the `index.html` file to open it in your default web browser. Alternatively, use a VS Code extension like **Live Server** for a better development experience.

---

## 📂 Project Structure

```text
skycast-weather-app/
│
├── index.html        # Main HTML structure and UI layout
├── style.css         # CSS styles, glassmorphism UI, animations, themes
├── script.js         # Core vanilla JS logic, DOM manipulation, API handling
├── config.js         # Isolated configuration file for the API key
└── README.md         # Project documentation
```

---

## 🔌 API Integration

This project relies on the **OpenWeatherMap API**. It utilizes the following endpoints:
1. `Current Weather Data API` (for current conditions)
2. `5 Day / 3 Hour Forecast API` (for hourly and daily forecasts)
3. `Air Pollution API` (for AQI index)

*Note: The free tier of OpenWeatherMap allows up to 60 calls per minute, which is more than enough for personal use.*

---

## 🛠️ Built With

* **HTML5** (Semantic structure)
* **CSS3** (Variables, Grid, Flexbox, Keyframes, Backdrop-filter for Glassmorphism)
* **Vanilla JavaScript ES6+** (Async/Await, Fetch API, LocalStorage)
* **FontAwesome** (Scalable vector icons)
* **Google Fonts** (Poppins typeface)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <b>Made with ❤️ by an awesome developer.</b>
</div>
