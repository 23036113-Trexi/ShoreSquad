/**
 * ShoreSquad - Interactive App Features
 * Includes: Geolocation, Weather API, Event Management, and PWA Support
 */

class ShoreSquadApp {
    constructor() {
        this.userLocation = null;
        this.events = [];
        this.crew = null;
        // Next cleanup location
        this.nextCleanup = {
            name: 'Pasir Ris Beach',
            latitude: 1.381497,
            longitude: 103.955574,
            location: 'Street View Asia',
            date: 'TBD',
            time: 'TBD'
        };
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.detectDarkMode();
        this.setupMobileMenu();
        this.logPerformanceMetrics();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        const startBtn = document.getElementById('startBtn');
        const learnMoreBtn = document.getElementById('learnMore');
        const ctaBtn = document.getElementById('ctaBtn');
        const geolocateBtn = document.getElementById('geolocateBtn');
        const locationSearch = document.getElementById('locationSearch');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const forecastToggle = document.getElementById('forecastToggle');

        if (startBtn) startBtn.addEventListener('click', () => this.scrollToSection('map'));
        if (learnMoreBtn) learnMoreBtn.addEventListener('click', () => this.scrollToSection('about'));
        if (ctaBtn) ctaBtn.addEventListener('click', () => this.showNotification('Welcome to ShoreSquad!'));
        if (geolocateBtn) geolocateBtn.addEventListener('click', () => this.requestGeolocation());
        if (locationSearch) {
            locationSearch.addEventListener('input', this.debounce(() => this.searchLocation(locationSearch.value), 500));
            locationSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchLocation(locationSearch.value);
            });
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        if (forecastToggle) {
            forecastToggle.addEventListener('click', () => this.displayWeather());
        }

        // Navigation link smooth scroll
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href.substring(1));
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Load initial data
     */
    loadInitialData() {
        this.updateStats();
        this.generateMockEvents();
        this.displayWeather();
        this.displayNextCleanup();
    }

    /**
     * Display next cleanup location information
     */
    displayNextCleanup() {
        const mapOverlay = document.getElementById('mapOverlay');
        if (mapOverlay) {
            // Overlay already contains the marker from HTML
            // This method could be used to update it dynamically
            console.log(`Next Cleanup: ${this.nextCleanup.name} at ${this.nextCleanup.latitude}, ${this.nextCleanup.longitude}`);
        }
    }

    /**
     * Request user geolocation with permission
     */
    async requestGeolocation() {
        const geolocateBtn = document.getElementById('geolocateBtn');

        if (!navigator.geolocation) {
            this.showNotification('Geolocation is not supported by your browser', 'error');
            return;
        }

        geolocateBtn.disabled = true;
        geolocateBtn.textContent = '⏳';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                geolocateBtn.textContent = '✓ Located!';
                this.showNotification(`Location found: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
                this.updateMapWithLocation(this.userLocation);

                // Reset button after 2 seconds
                setTimeout(() => {
                    geolocateBtn.textContent = '📍';
                    geolocateBtn.disabled = false;
                }, 2000);
            },
            (error) => {
                geolocateBtn.textContent = '📍';
                geolocateBtn.disabled = false;
                this.showNotification(`Geolocation error: ${error.message}`, 'error');
            }
        );
    }

    /**
     * Update map display with user location
     */
    updateMapWithLocation(location) {
        const mapContainer = document.getElementById('mapContainer');
        if (mapContainer && mapContainer.classList.contains('map-placeholder')) {
            mapContainer.innerHTML = `
                <div style="text-align: center;">
                    <span style="font-size: 40px;">📍</span>
                    <p>Location: ${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° W</p>
                    <p style="font-size: 14px; color: #666;">Map integration ready (use Leaflet.js or Mapbox)</p>
                </div>
            `;
        }
    }

    /**
     * Search location by name
     */
    async searchLocation(query) {
        if (!query || query.length < 2) return;

        try {
            // Using Open-Meteo Geocoding API (free, no API key needed)
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                this.userLocation = {
                    latitude: result.latitude,
                    longitude: result.longitude,
                    name: result.name,
                    country: result.country
                };
                this.updateMapWithLocation(this.userLocation);
                this.showNotification(`Found: ${result.name}, ${result.country}`);
                this.displayWeatherForLocation(this.userLocation);
            } else {
                this.showNotification('Location not found', 'error');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showNotification('Error searching location', 'error');
        }
    }

    /**
     * Display weather data with 4-day forecast from NEA
     */
    async displayWeather() {
        const weatherContainer = document.getElementById('weatherContainer');

        try {
            // Fetch 4-day forecast from NEA API
            // Using Pasir Ris Beach location as default
            const response = await fetch(
                'https://api.data.gov.sg/v1/environment/4-day-weather-forecast'
            );
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                this.renderForecastCards(data.items[0].forecast, weatherContainer);
            } else {
                this.renderWeatherPlaceholder(weatherContainer);
            }
        } catch (error) {
            console.error('Weather fetch error:', error);
            // Fallback to open-meteo if NEA API fails
            this.fetchOpenMeteoFallback(weatherContainer, 1.381497, 103.955574);
        }
    }

    /**
     * Display weather for specific location
     */
    async displayWeatherForLocation(location) {
        const weatherContainer = document.getElementById('weatherContainer');

        try {
            // Try NEA API first
            const response = await fetch(
                'https://api.data.gov.sg/v1/environment/4-day-weather-forecast'
            );
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                this.renderForecastCards(data.items[0].forecast, weatherContainer, location.name);
            } else {
                this.renderWeatherPlaceholder(weatherContainer);
            }
        } catch (error) {
            console.error('Weather fetch error:', error);
            // Fallback to open-meteo
            this.fetchOpenMeteoFallback(weatherContainer, location.latitude, location.longitude, location.name);
        }
    }

    /**
     * Fallback to Open-Meteo API if NEA is unavailable
     */
    async fetchOpenMeteoFallback(container, lat, lon, locationName = 'Your Location') {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&temperature_unit=celsius&timezone=auto`
            );
            const data = await response.json();

            if (data.daily) {
                const forecast = data.daily.time.slice(0, 4).map((date, index) => ({
                    date: date,
                    weather: this.getWeatherDescription(data.daily.weather_code[index]),
                    high: Math.round(data.daily.temperature_2m_max[index]),
                    low: Math.round(data.daily.temperature_2m_min[index]),
                    wind: Math.round(data.daily.wind_speed_10m_max[index])
                }));
                this.renderForecastCards(forecast, container, locationName);
            } else {
                this.renderWeatherPlaceholder(container);
            }
        } catch (error) {
            console.error('Fallback weather fetch error:', error);
            this.renderWeatherPlaceholder(container);
        }
    }

    /**
     * Render 4-day forecast cards
     */
    renderForecastCards(forecast, container, locationName = 'Singapore') {
        let html = `<div class="forecast-grid">`;
        
        forecast.slice(0, 4).forEach((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-SG', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' });
            const weather = day.weather || this.getWeatherDescription(day.weather_code || 0);
            const icon = this.getWeatherIconForForecast(day.weather_code || 0);
            const high = day.high || day.max_temp || 30;
            const low = day.low || day.min_temp || 24;
            const wind = day.wind || day.wind_speed || 5;

            html += `
                <div class="forecast-card">
                    <div class="forecast-date">
                        <span class="day-name">${dayName}</span>
                        <span class="date">${dateStr}</span>
                    </div>
                    <div class="forecast-icon">${icon}</div>
                    <p class="forecast-weather">${weather}</p>
                    <div class="forecast-temps">
                        <span class="temp-high">${high}°</span>
                        <span class="temp-divider">/</span>
                        <span class="temp-low">${low}°</span>
                    </div>
                    <div class="forecast-wind">
                        💨 ${wind} km/h
                    </div>
                    <div class="forecast-recommendation">
                        ${this.getCleanupRecommendation(high, low, weather)}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    /**
     * Get weather description from code
     */
    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear',
            1: 'Mainly Clear',
            2: 'Partly Cloudy',
            3: 'Overcast',
            45: 'Foggy',
            51: 'Light Drizzle',
            61: 'Moderate Rain',
            71: 'Light Snow',
            80: 'Rainy Showers',
            95: 'Thunderstorm'
        };
        return descriptions[code] || 'Unknown';
    }

    /**
     * Get weather icon based on code
     */
    getWeatherIconForForecast(code) {
        const weatherIcons = {
            0: '☀️',
            1: '🌤️',
            2: '⛅',
            3: '☁️',
            45: '🌫️',
            51: '🌧️',
            61: '🌧️',
            71: '❄️',
            80: '⛈️',
            95: '⛈️'
        };
        return weatherIcons[code] || '⛅';
    }

    /**
     * Get cleanup recommendation based on weather
     */
    getCleanupRecommendation(high, low, weather) {
        if (weather.includes('Thunderstorm') || weather.includes('Heavy')) {
            return '❌ Poor Conditions';
        } else if (weather.includes('Rainy') || weather.includes('Rain')) {
            return '⚠️ Challenging';
        } else if (weather.includes('Clear') || weather.includes('Sunny')) {
            return '✅ Excellent';
        } else {
            return '✔️ Good';
        }
    }

    /**
     * Render current weather card (legacy)
     */
    renderWeatherCard(weatherData, container, locationName = 'Your Location') {
        const weatherIcon = this.getWeatherIcon(weatherData.weather_code);
        const html = `
            <div class="weather-card">
                <span class="icon">${weatherIcon}</span>
                <h3>${locationName}</h3>
                <p style="font-size: 32px; margin: 10px 0;">${Math.round(weatherData.temperature_2m)}°C</p>
                <p>Humidity: ${weatherData.relative_humidity_2m}%</p>
                <p>Wind: ${Math.round(weatherData.wind_speed_10m)} km/h</p>
                <p style="margin: 0; font-size: 12px; color: #666;">Perfect for beach cleanup! 🌊</p>
            </div>
        `;
        container.innerHTML = html;
    }

    /**
     * Render weather placeholder
     */
    renderWeatherPlaceholder(container) {
        container.innerHTML = `
            <div class="weather-card weather-placeholder">
                <span class="icon">⛅</span>
                <p>Enable location to see weather</p>
            </div>
        `;
    }

    /**
     * Get weather icon based on WMO weather code
     */
    getWeatherIcon(code) {
        const weatherIcons = {
            0: '☀️',
            1: '🌤️',
            2: '⛅',
            3: '☁️',
            45: '🌫️',
            51: '🌧️',
            61: '🌧️',
            80: '⛈️',
            95: '⛈️'
        };
        return weatherIcons[code] || '⛅';
    }

    /**
     * Generate mock cleanup events
     */
    generateMockEvents() {
        this.events = [
            {
                id: 1,
                name: 'Coney Island Cleanup Crew',
                location: 'Brooklyn, NY',
                date: '2025-12-15',
                time: '10:00 AM',
                participants: 24,
                icon: '🌊'
            },
            {
                id: 2,
                name: 'Santa Monica Beach Bash',
                location: 'Los Angeles, CA',
                date: '2025-12-20',
                time: '9:00 AM',
                participants: 42,
                icon: '🏖️'
            },
            {
                id: 3,
                name: 'Miami Beach Warriors',
                location: 'Miami, FL',
                date: '2025-12-22',
                time: '8:00 AM',
                participants: 38,
                icon: '🌴'
            }
        ];
    }

    /**
     * Update statistics
     */
    updateStats() {
        const stats = {
            volunteers: 1247,
            cleanups: 89,
            wasteRemoved: 24580
        };

        document.getElementById('statVolunteers').textContent = stats.volunteers.toLocaleString();
        document.getElementById('statCleanups').textContent = stats.cleanups;
        document.getElementById('statWasteRemoved').textContent = stats.wasteRemoved.toLocaleString();
    }

    /**
     * Scroll to section with smooth behavior
     */
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');

        const bgColor = type === 'error' ? '#FF6B6B' : '#22C55E';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${bgColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            font-weight: 600;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (navLinks) {
            navLinks.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const navLinks = document.getElementById('navLinks');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');

        if (navLinks) {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Detect and apply dark mode
     */
    detectDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark-mode');
        }
    }

    /**
     * Debounce function for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Log performance metrics (for optimization)
     */
    logPerformanceMetrics() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = window.performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    const connectTime = timing.responseEnd - timing.requestStart;
                    const renderTime = timing.domContentLoadedEventEnd - timing.navigationStart;

                    console.log('Performance Metrics:');
                    console.log(`Total Load Time: ${loadTime}ms`);
                    console.log(`Connect Time: ${connectTime}ms`);
                    console.log(`Render Time: ${renderTime}ms`);
                }, 0);
            });
        }
    }
}

/**
 * Add notification animations to stylesheet
 */
(function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
})();

/**
 * Initialize app when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ShoreSquadApp();
    });
} else {
    new ShoreSquadApp();
}

/**
 * Export for testing (if using modules)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShoreSquadApp;
}
