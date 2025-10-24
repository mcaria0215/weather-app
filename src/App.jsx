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

  const getCurrentLocation = ()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;      
      getWeatherByCurrentLocation(lat, lon)
    },
    (error) => {
        console.error("위치 정보 접근 거부 또는 오류:", error);
        setLoading(false); // 위치 정보 실패 시에도 로딩 종료
    }
  )};

  const getWeatherByCurrentLocation = async (lat, lon)=>{
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ebe3945518c1f47f05ca8611f7f1c729&units=metric`
    
    try {
      setLoading(true);
      
      let response = await fetch(url);
      let data = await response.json();      
      setWeatherData(data);
    } catch (error) {
      console.error("날씨 정보 가져오기 오류:", error.message);      
    } finally {      
      setLoading(false); 
    }    
  }

  useEffect(()=>{
    getCurrentLocation();    
  },[])

  if (loading) {  
    return <div>날씨 정보를 불러오는 중입니다... 🔄</div>;
  }  
  if (!weatherData) {
    return <div>날씨 정보를 불러오지 못했습니다. 콘솔을 확인하세요.</div>;
  }
  
  const cityButtons = [
    { key: 'current', name: '현재 위치' },
    { key: 'newYork', name: '뉴욕' },
    { key: 'london', name: '런던' },
    { key: 'paris', name: '파리' },
    { key: 'naples', name: '나폴리' },
  ];

  return (
    <>
      <div className="weather-app">
        <Box weather={weatherData} />
        <div className="city-selector-container">
            {cityButtons.map((city) => (
              <button key={city.key} className={`city-button`}>
                {city.name}
              </button>
            ))}
        </div>
      </div>      
    </>
  )
}

export default App
