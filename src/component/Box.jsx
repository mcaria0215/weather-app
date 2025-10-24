import React from 'react'

const Box = ({weather}) => {
  console.log(weather)
  return (
    <div className='weather-card'>
      <p>도시 : {weather.name}</p>
      <p>기온 : {weather.main.temp}</p>
      <p>상태 : {weather.weather[0].description}</p>      
    </div>
  )
}

export default Box