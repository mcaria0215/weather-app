import { useEffect, useState } from "react";
import { 
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getWeatherForecast,
} from "../services/weatherAPI";

export const useWeather = ()=>{
  const [currentWeather, setCurrentWeather] = useState(null);  
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnits] = useState("C");

  const fetchWeatherByCity = async (city)=>{
    setLoading(true);
    setError(null);

    try {
      const [weatherData, foreCast] = await Promise.all([
        getCurrentWeather(city),
        getWeatherForecast(city),
      ]);

      setCurrentWeather(weatherData);
      setForecast(foreCast);

    } catch(err){
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  };

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
          setCurrentWeather(weatherData);

          const forecastData = await getWeatherForecast(weatherData.name);
          setForecast(forecastData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch weather data by location");
        } finally {
          setLoading(false);
        }
      },
      (err) => {        
        setError("Unable to retrieve your location. Please check your permissions.");
        setLoading(false);
      }
    );
  };

  const toggleUnit = ()=>{
    setUnits(unit === "C" ? "F" : "C");
  };

  useEffect(() => {
    fetchWeatherByCity("Seoul");
  }, []);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    toggleUnit,
  };
};