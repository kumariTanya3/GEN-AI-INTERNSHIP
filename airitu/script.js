
document.addEventListener('DOMContentLoaded', () => {
  const loadingElement = document.getElementById('loading');
  const weatherContentElement = document.getElementById('weather-content');
  const errorMessageElement = document.getElementById('error-message');

  const weatherEmojiElement = document.getElementById('weather-emoji');
  const weatherTempElement = document.getElementById('weather-temp');
  const weatherLocationElement = document.getElementById('weather-location');
  const weatherDescriptionElement = document.getElementById('weather-description');
  const weatherHumidityElement = document.getElementById('weather-humidity');
  const weatherWindSpeedElement = document.getElementById('weather-wind-speed');
  const weatherFeelsLikeElement = document.getElementById('weather-feels-like');

  // --- IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key ---
  // You can get one for free from https://openweathermap.org/api
  const API_KEY = 'KEY_GEMINI'; // Placeholder:Replace with your OpenWeatherMap API key

  /**
   * Maps OpenWeatherMap condition codes to appropriate emojis.
   * @param {number} weatherCode - The weather condition code from OpenWeatherMap API.
   * @returns {string} An emoji representing the weather condition.
   */
  function getWeatherEmoji(weatherCode) {
      if (weatherCode >= 200 && weatherCode < 300) return '⛈️'; // Thunderstorm
      if (weatherCode >= 300 && weatherCode < 400) return '🌧️'; // Drizzle
      if (weatherCode >= 500 && weatherCode < 600) return '☔'; // Rain
      if (weatherCode >= 600 && weatherCode < 700) return '❄️'; // Snow
      if (weatherCode >= 700 && weatherCode < 800) return '🌫️'; // Atmosphere (mist, smoke, haze, dust, fog, sand, ash, squall, tornado)
      if (weatherCode === 800) return '☀️'; // Clear
      if (weatherCode === 801) return '🌤️'; // Few clouds
      if (weatherCode === 802) return '⛅'; // Scattered clouds
      if (weatherCode === 803 || weatherCode === 804) return '☁️'; // Broken/overcast clouds
      return '❓'; // Default unknown
  }

  /**
   * Displays an error message in the UI and logs it to the console.
   * Hides loading spinner and weather content.
   * @param {string} message - The error message to display.
   */
  function showErrorMessage(message) {
      loadingElement.classList.add('hidden');
      weatherContentElement.classList.add('hidden');
      errorMessageElement.textContent = message;
      errorMessageElement.classList.remove('hidden');
      console.error(message);
  }

  /**
   * Fetches weather data from OpenWeatherMap API based on latitude and longitude.
   * Updates the UI with the fetched weather details.
   * @param {number} latitude - The latitude of the location.
   * @param {number} longitude - The longitude of the location.
   */
  async function fetchWeatherData(latitude, longitude) {
      loadingElement.classList.remove('hidden');
      weatherContentElement.classList.add('hidden');
      errorMessageElement.classList.add('hidden');

      // Check if API key is provided
      if (API_KEY === 'KEY' || !API_KEY) {
          showErrorMessage('Please replace "YOUR_API_KEY" in the JavaScript code with your actual OpenWeatherMap API key.');
          return;
      }

      try {
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
          const response = await fetch(apiUrl);

          // Handle HTTP errors
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Weather data fetch failed: ${errorData.message || response.statusText}`);
          }

          const data = await response.json();
          console.log("Weather Data:", data);

          // Destructure relevant data
          const { name, main, weather, wind } = data;
          const temperature = Math.round(main.temp);
          const description = weather[0].description;
          const humidity = main.humidity;
          const windSpeed = (wind.speed * 3.6).toFixed(1); // Convert m/s to km/h for better readability
          const feelsLike = Math.round(main.feels_like);
          const weatherCode = weather[0].id;

          // Update UI elements
          weatherEmojiElement.textContent = getWeatherEmoji(weatherCode);
          weatherTempElement.textContent = `${temperature}°C`;
          weatherLocationElement.textContent = name;
          weatherDescriptionElement.textContent = description;
          weatherHumidityElement.textContent = `${humidity}%`;
          weatherWindSpeedElement.textContent = `${windSpeed} km/h`;
          weatherFeelsLikeElement.textContent = `${feelsLike}°C`;

          // Hide loading and show content
          loadingElement.classList.add('hidden');
          weatherContentElement.classList.remove('hidden');

      } catch (error) {
          showErrorMessage(`Error fetching weather data: ${error.message}. Please check your API key and try again.`);
      }
  }

  /**
   * Attempts to get the user's current geographical location using the Geolocation API.
   * If successful, it calls fetchWeatherData. If not, it displays an error.
   */
  function getCurrentLocation() {
      if (navigator.geolocation) {
          loadingElement.classList.remove('hidden');
          weatherContentElement.classList.add('hidden');
          errorMessageElement.classList.add('hidden');

          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude } = position.coords;
                  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                  fetchWeatherData(latitude, longitude);
              },
              (error) => {
                  let message = 'Unable to retrieve your location.';
                  switch(error.code) {
                      case error.PERMISSION_DENIED:
                          message = 'Location access denied. Please allow location access for this app.';
                          break;
                      case error.POSITION_UNAVAILABLE:
                          message = 'Location information is unavailable.';
                          break;
                      case error.TIMEOUT:
                          message = 'The request to get user location timed out.';
                          break;
                      default:
                          message = 'An unknown error occurred while getting location.';
                  }
                  showErrorMessage(`Geolocation Error: ${message}`);
              },
              {
                  enableHighAccuracy: true,
                  timeout: 10000, // 10 seconds
                  maximumAge: 0 // Don't use cached position
              }
          );
      } else {
          showErrorMessage('Geolocation is not supported by your browser.');
      }
  }

  // Initiate getting location when the page loads
  getCurrentLocation();
});

/*
const apiKey = 'KEY'; // Replace with your OpenWeatherMap API key
const weatherEmoji = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️'
};

async function getWeather() {
    try {
        // Get user's location
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

                // Fetch weather data
                const response = await fetch(url);
                if (!response.ok) throw new Error('Unable to fetch weather data');

                const data = await response.json();

                // Update UI
                document.getElementById('location').textContent = `Location: ${data.name}, ${data.sys.country}`;
                document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
                document.getElementById('description').textContent = `Condition: ${data.weather[0].description}`;
                document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
                document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;

                // Set weather emoji
                const weatherMain = data.weather[0].main;
                document.querySelector('.weather-emoji').textContent = 
                    weatherEmoji[weatherMain] || '🌍';
            },
            (error) => {
                document.getElementById('error').textContent = 
                    'Unable to get location. Please allow location access.';
                document.querySelector('.weather-emoji').textContent = '❌';
            }
        );
    } catch (error) {
        document.getElementById('error').textContent = 'Error fetching weather data.';
        document.querySelector('.weather-emoji').textContent = '❌';
    }
}

// Call getWeather when the page loads
window.onload = getWeather;*/