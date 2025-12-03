# Weather Forecast Integration

## Overview

ShoreSquad now features a **4-day weather forecast** powered by Singapore's NEA (National Environment Agency) Realtime Weather Readings API from data.gov.sg, with automatic fallback to Open-Meteo for reliability.

## Features

### 4-Day Forecast Display
- **Daily forecast cards** showing:
  - Day of week and date
  - Weather icon (☀️, ⛅, 🌧️, ⛈️, etc.)
  - Weather condition description
  - High and low temperatures (in °C)
  - Wind speed (in km/h)
  - Cleanup recommendation indicator

### Cleanup Recommendations
Weather-aware recommendations help users plan cleanup activities:
- ✅ **Excellent** - Clear/Sunny conditions
- ✔️ **Good** - Partly cloudy/Overcast
- ⚠️ **Challenging** - Rainy/Drizzly conditions
- ❌ **Poor Conditions** - Thunderstorms/Heavy rain

### Responsive Design
- **Desktop**: 4-card grid layout
- **Tablet**: 2-3 card layout
- **Mobile**: Single column stacked layout

## API Integration

### Primary: NEA Singapore Data API
```
Endpoint: https://api.data.gov.sg/v1/environment/4-day-weather-forecast
```

**Advantages:**
- Official Singapore government weather data
- Real-time, accurate forecasts
- No API key required
- Optimized for Singapore region

**Data returned:**
```json
{
  "items": [
    {
      "forecast": [
        {
          "date": "2025-12-03",
          "weather": "Clear",
          "high": 32,
          "low": 24,
          "wind": 5
        }
      ]
    }
  ]
}
```

### Fallback: Open-Meteo API
```
Endpoint: https://api.open-meteo.com/v1/forecast
```

If NEA API is unavailable, the app automatically falls back to Open-Meteo to ensure users always get weather information.

**Request parameters:**
- `latitude`, `longitude` - Location coordinates
- `daily` - Daily forecast metrics
- `temperature_unit=celsius` - Metric units
- `timezone=auto` - Automatic timezone detection

## Implementation Details

### JavaScript Functions

#### `displayWeather()`
- Fetches 4-day forecast from NEA API
- Falls back to Open-Meteo if NEA fails
- Renders forecast cards or placeholder

#### `fetchOpenMeteoFallback(container, lat, lon, locationName)`
- Alternative weather data source
- Extracts 4-day daily forecast
- Converts API response to forecast card format

#### `renderForecastCards(forecast, container, locationName)`
- Renders HTML grid of 4 forecast cards
- Includes weather icons, temperatures, wind
- Adds cleanup recommendations

#### `getWeatherDescription(code)`
- Maps weather codes to descriptions
- Supports standard WMO weather codes

#### `getCleanupRecommendation(high, low, weather)`
- Analyzes conditions
- Returns user-friendly activity suggestion

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.forecast-grid` | Container for 4 forecast cards |
| `.forecast-card` | Individual day forecast |
| `.forecast-date` | Day name and date display |
| `.forecast-icon` | Large weather icon (48px) |
| `.forecast-weather` | Weather condition text |
| `.forecast-temps` | High/low temperature display |
| `.forecast-wind` | Wind speed with icon |
| `.forecast-recommendation` | Cleanup activity suggestion |

## User Experience

### Loading
1. User navigates to weather section
2. App makes fetch request to NEA API
3. If successful, displays 4-day forecast cards
4. If NEA fails, automatically uses Open-Meteo
5. If both fail, shows placeholder message

### Interactivity
- **Forecast Toggle**: Button to refresh weather data
- **Smooth animations**: Hover effects on forecast cards
- **Responsive layout**: Adapts to device size

## Metrics

### Temperature Display
- All temperatures in **Celsius (°C)**
- Example: "32°C / 24°C" for high/low

### Wind Speed
- All wind speeds in **Kilometers per hour (km/h)**
- Example: "5 km/h"

## Benefits for Beach Cleanup Planning

1. **Real-time accuracy** - Official Singapore government data
2. **Multi-day visibility** - Plan 4 days in advance
3. **Weather-aware recommendations** - Know if conditions are suitable
4. **Wind information** - Important for outdoor beach activities
5. **No API key required** - Simple, free integration

## Error Handling

1. **NEA API unavailable** → Automatically use Open-Meteo
2. **Both APIs unavailable** → Display user-friendly placeholder
3. **Invalid location** → Show default Singapore forecast
4. **Network errors** → Console logging + user notification

## Testing

### Manual Testing Checklist
- [ ] Weather loads automatically on page load
- [ ] Forecast displays for correct 4-day period
- [ ] Temperatures show in Celsius
- [ ] Wind speeds show in km/h
- [ ] Weather icons display correctly
- [ ] Cleanup recommendations are accurate
- [ ] Responsive on mobile devices
- [ ] Fallback works if NEA API is down

### Browser Console
Check for any fetch errors or API response issues:
```javascript
// Check weather data
console.log(weatherData);

// Verify API endpoints
// NEA: https://api.data.gov.sg/v1/environment/4-day-weather-forecast
// Fallback: https://api.open-meteo.com/v1/forecast?...
```

## Future Enhancements

1. **Multi-location support** - Forecast for multiple beaches
2. **Hourly forecast** - More granular time-based view
3. **Historical data** - Past weather patterns
4. **Weather alerts** - Notifications for severe weather
5. **UV index** - Sun protection recommendations
6. **Air quality** - Combine with PSI/air quality data

## API Rate Limits

- **NEA API**: Free tier available, rate limits enforced Dec 31, 2025
- **Open-Meteo API**: 100 calls/minute (generous free tier)

For high-traffic applications, consider registering for higher rate limits on data.gov.sg.

## References

- [NEA Singapore Data Portal](https://data.gov.sg)
- [Open-Meteo Weather API](https://open-meteo.com)
- [WMO Weather Codes](https://www.noaa.gov/education/weather-literacy/understanding-weather)
