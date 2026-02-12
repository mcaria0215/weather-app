const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const getCurrentWeather = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`city ${city} not found, please check the spelling and try again`);
      } else if (response.status === 401) {
        throw new Error(`Invalid API Key, please check your OpenWeatherMap API configuration`);
      } else {
        throw new Error("Weahter service is temporarily unavailable. Please try Again later.");
      }    
    }
    
    const data = await response.json();

    if (!data.dt) {
      data.dt = Math.floor(Date.now() / 1000);
    }    
    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {    
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Location (lat: ${lat}, lon: ${lon}) not found.`);
      } else if (response.status === 401) {
        throw new Error(`Invalid API Key, please check your OpenWeatherMap API configuration`);
      } else {    
        throw new Error("Weather service is temporarily unavailable. Please try again later.");
      }
    }

    const data = await response.json();    

    if (!data.dt) {
      data.dt = Math.floor(Date.now() / 1000);
    }

    return data;

  } catch (error) {
    console.error("API Error (By Coords):", error.message);
    throw error;
  }
};

export const getWeatherForecast = async (city) => {
  try {    
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=kr`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City ${city} not found for forecast.`);
      } else if (response.status === 401) {
        throw new Error("Invalid API Key. Please check your configuration.");
      } else {        
        throw new Error("Forecast service is temporarily unavailable.");
      }
    }    

    return await response.json();

  } catch (error) {
    console.error("Forecast API Error:", error.message);
    throw error;
  }
};

export const searchCities = async (query) => {
  try {    
    const response = await fetch(      
      `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}&lang=kr`      
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid API Key. Please check your configuration.");
      } else {
        throw new Error("City search service is temporarily unavailable.");
      }
    }
   
    const data = await response.json();

    return data.map((city)=>({
      name: city.name,
      displayName: city.local_names?.ko || city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      state: city.state || "",
    }))

  } catch (error) {
    console.error("Search Cities API Error:", error.message);
    throw error;
  }
};