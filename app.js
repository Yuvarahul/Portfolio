// Configuration Object for OpenWeatherMap API
const CONFIG = {
    API_KEY: 'YOUR_OPENWEATHER_API_KEY', // <-- Insert your OpenWeatherMap API key here
    BASE_URL: 'https://api.openweathermap.org/data/2.5/weather'
};

// DOM Cache Strategy
const DOM = {
    form: document.getElementById('search-form'),
    input: document.getElementById('city-input'),
    weatherCard: document.getElementById('weather-info'),
    errorContainer: document.getElementById('error-container'),
    spinner: document.getElementById('loading-spinner'),
    location: document.getElementById('location-name'),
    description: document.getElementById('weather-description'),
    temp: document.getElementById('temp-value'),
    humidity: document.getElementById('humidity-value'),
    wind: document.getElementById('wind-value')
};

// 1. Asynchronous Fetch API Engine
async function fetchWeatherData(city) {
    const url = `${CONFIG.BASE_URL}?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    // Explicit network status handling
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found. Please verify the spelling.');
        } else if (response.status === 401) {
            throw new Error('Invalid API key configuration.');
        } else {
            throw new Error(`Server returned status code: ${response.status}`);
        }
    }
    
    return await response.json();
}

// 2. Data Transformation & Rendering Engine
function renderWeather(data) {
    // Parsing complex nested JSON properties safely
    const { name, sys: { country }, main: { temp, humidity }, wind: { speed }, weather } = data;
    const weatherDesc = weather[0]?.description || 'No description available';

    // Update target elements
    DOM.location.textContent = `${name}, ${country}`;
    DOM.description.textContent = weatherDesc;
    DOM.temp.textContent = Math.round(temp);
    DOM.humidity.textContent = `${humidity}%`;
    DOM.wind.textContent = `${speed} m/s`;

    // Toggle Visibility
    DOM.weatherCard.classList.remove('hidden');
}

// 3. UI State Managers
function showLoading() {
    DOM.spinner.classList.remove('hidden');
    DOM.weatherCard.classList.add('hidden');
    DOM.errorContainer.classList.add('hidden');
}

function hideLoading() {
    DOM.spinner.classList.add('hidden');
}

function showError(message) {
    DOM.errorContainer.textContent = message;
    DOM.errorContainer.classList.remove('hidden');
    DOM.weatherCard.classList.add('hidden');
}

// 4. Controller Orchestrator
async function handleSearch(event) {
    event.preventDefault();
    const query = DOM.input.value.trim();

    if (!query) return;

    showLoading();

    try {
        const weatherData = await fetchWeatherData(query);
        renderWeather(weatherData);
    } catch (error) {
        // Handle gracefully (covers network downtime and programmatic exceptions)
        console.error("Dashboard Fetch Exception Error:", error);
        showError(error.message || "An unexpected networking error occurred.");
    } finally {
        hideLoading();
    }
}

// Event Bindings
DOM.form.addEventListener('submit', handleSearch);