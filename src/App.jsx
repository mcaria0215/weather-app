import { useEffect, useState } from "react";
import "./App.css";
import Box from "./component/Box";

/**
 * 1. 앱이 실행되면 현재위치 기반의 날씨가 보인다
 * 2. 날씨정보는 도시, 섭씨, 화씨, 날씨상태
 * 3. 5개의 버튼이 있다 (현재위치, 도시2, ..., 도시5)
 * 4. 도시 버튼을 클릭하면 해당 도시 날씨 정보가 나온다
 * 5. 현재 위치 버튼을 누르면 다시 현재 도시 위치 기반의 날씨가 보인다.
 * 6. 데이터가 들어오는 동안 로딩 스피너가 돈다.
 */

function App() {
  const [weatherData, setWeatherData] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("current");

  // 도시 목록
  const cityButtons = [
    { key: 'current', name: '현재 위치' },
    { key: 'New York', name: '뉴욕' },
    { key: 'London', name: '런던' },
    { key: 'Paris', name: '파리' },
    { key: 'Naples', name: '나폴리' },
  ];

  // 다른도시 날씨 가져오는 함수
  const getWeatherByCity = async (cityName)=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ebe3945518c1f47f05ca8611f7f1c729&units=metric`
    await fetchWeather(url);
  }

  const getCurrentLocation = ()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;      
      getWeatherByCurrentLocation(lat, lon)
    },
    (error) => {
        console.error("위치 정보 접근 거부 또는 오류:", error);
        getWeatherByCity("Seoul"); 
        setCity("Seoul");
    }
  )};  

  // 도시 버튼 함수
  const handleCityChange = (cityName) => {
    setCity(cityName); 
    if (cityName === 'current') {
      getCurrentLocation(); 
    } else {
      getWeatherByCity(cityName); 
    }
  };

  const fetchWeather = async (url) => {
    try {
      setLoading(true);
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("날씨 정보 가져오기 오류:", error.message);
      setWeatherData(null); 
    } finally {
      setLoading(false);
    }
  }

  const getWeatherByCurrentLocation = async (lat, lon)=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ebe3945518c1f47f05ca8611f7f1c729&units=metric`
    await fetchWeather(url);    
  } 

  useEffect(()=>{
    getCurrentLocation();
  },[])

  if (loading) {  
    return (
      <div className="loading-spinner">
        <div className="spinner"></div> 
        <div>날씨 정보를 불러오는 중입니다...</div>
      </div>
    );
  }  
  if (!weatherData) {
    return <div>날씨 정보를 불러오지 못했습니다. 콘솔을 확인하세요.</div>;
  }
  

  return (
    <>
      <div className="weather-app">
        <Box weather={weatherData} />

        <div className="city-selector-container">         
          {cityButtons.map((cityObj) => (
            <button key={cityObj.key} className={`city-button ${cityObj.key===city?'active':''}`} onClick={()=>{handleCityChange(cityObj.key)}}>
              {cityObj.name}
            </button>
          ))}
        </div>
      </div>      
    </>
  )
}

export default App