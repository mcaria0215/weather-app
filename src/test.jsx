import { useEffect, useState } from "react";
import "./App.css";
import Box from "./component/Box";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  // 1. 현재 선택된 도시 키를 저장할 상태 추가
  const [city, setCity] = useState("current"); 
  const API_KEY = "ebe3945518c1f47f05ca8611f7f1c729"; // API Key 변수화

  // 도시 목록 정의 (OpenWeatherMap 도시 이름 기준)
  const cityButtons = [
    { key: 'current', name: '현재 위치' },
    // 2. OpenWeatherMap의 도시 이름 (q)으로 사용될 key 값으로 변경
    { key: 'New York', name: '뉴욕' }, 
    { key: 'London', name: '런던' },
    { key: 'Paris', name: '파리' },
    { key: 'Naples', name: '나폴리' },
  ];

  // 3. 도시 이름(q)으로 날씨를 가져오는 함수 추가
  const getWeatherByCity = async (cityName) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
    await fetchWeather(url);
  };
  
  // 날씨 데이터를 실제로 가져오는 공통 로직 함수
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
      setWeatherData(null); // 오류 시 데이터 초기화
    } finally {
      setLoading(false);
    }
  }

  const getWeatherByCurrentLocation = async (lat, lon) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    await fetchWeather(url);
  }

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLocation(lat, lon)
    },
      (error) => {
        console.error("위치 정보 접근 거부 또는 오류:", error);
        // 위치 정보 실패 시, 기본 도시(예: 서울)로 대체하거나 에러 메시지 표시
        getWeatherByCity("Seoul"); 
        setCity("Seoul");
      }
    )
  };

  // 4. 도시 버튼 클릭 핸들러
  const handleCityChange = (cityName) => {
    setCity(cityName); // 현재 선택된 도시 업데이트
    if (cityName === 'current') {
      getCurrentLocation(); // '현재 위치'는 위도/경도로 가져옴
    } else {
      getWeatherByCity(cityName); // 다른 도시는 도시 이름으로 가져옴
    }
  };

  // 5. useEffect 의존성 배열에서 city 상태를 제거하고 초기화 함수만 호출
  useEffect(() => {
    getCurrentLocation();
  }, []) // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  if (loading) {
    return <div className="loading-spinner">날씨 정보를 불러오는 중입니다... 🔄</div>;
  }
  if (!weatherData) {
    return <div>날씨 정보를 불러오지 못했습니다. 콘솔을 확인하거나 위치 권한을 확인하세요.</div>;
  }

  return (
    <>
      <div className="weather-app">
        <Box weather={weatherData} />

        <div className="city-selector-container">
          {cityButtons.map((cityObj) => (
            <button
              key={cityObj.key}
              className={`city-button ${cityObj.key} ${cityObj.key === city ? 'active' : ''}`} // 6. 활성화된 버튼에 'active' 클래스 추가
              onClick={() => handleCityChange(cityObj.key)} // 7. 버튼 클릭 시 핸들러 연결
            >
              {cityObj.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default App