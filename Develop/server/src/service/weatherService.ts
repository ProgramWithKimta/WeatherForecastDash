import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  wind: number;
  humidity: number;
  description: string;

  constructor(temp: number, wind: number, humidity: number, description: string) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
    this.description = description;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY ||'';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
  private async fetchLocationData(): Promise<Coordinates | null> {
    const geocodeQuery = this.buildGeocodeQuery();
    try {
      const response = await axios.get(geocodeQuery);
      return this.destructureLocationData(response.data); // Destructure the location data
    } catch (error) {
      console.error('Error fetching location data:', error);
      return null;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geocode?city=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
      // Fetch location data using the existing fetchLocationData method
    const locationData = await this.fetchLocationData();
  
    if (!locationData) {
    // If no location data was returned (could be an invalid city or API error), return null
      console.error("No location data found.");
      return null;
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    try {
      const response = await axios.get(weatherQuery);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const weatherData = response.weather[0];
    const temp = response.main.temp;
    const wind = response.wind.speed;
    const humidity = response.main.humidity;
    const description = weatherData.description;

    return new Weather(temp, wind, humidity, description);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: Weather[] = [];
    for (let i = 0; i < weatherData.length; i++) {
      const data = weatherData[i];
      forecast.push(new Weather(data.main.temp, data.wind.speed, data.main.humidity, data.weather[0].description));
    }
    return forecast;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchLocationData();
    if (!coordinates) {
      return null; // If location data is invalid, return null
    }

    const weatherData = await this.fetchWeatherData(coordinates);
    if (!weatherData) {
      return null; // If weather data is invalid, return null
    }

    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list);

    // You can log the current weather and forecast for debugging
    console.log('Current Weather:', currentWeather.toString());
    console.log('Forecast:', forecast);

    return forecast;
  }
}

export default new WeatherService();