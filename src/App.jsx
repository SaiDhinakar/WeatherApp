import { useEffect, useReducer, useState } from "react";
import "./App.css";
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";
import sunIcon from "./assets/sun.png";
import humidityIcon from "./assets/humidity.png";
import rainIcon from "./assets/heavy-rain.png";
import clearSkyIcon from "./assets/clearsky.png";
import stromIcon from "./assets/storm.png";
import windIcon from "./assets/wind.png";
import cloudyIcon from "./assets/cloudy.png";
import clearSkyNightIcon from "./assets/clearSkyNight.png";
import mistIcon from "./assets/mist.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  lon,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="lon">Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  const api_key = import.meta.env.VITE_WEATHER_API;
  const [icon, setIcon] = useState(sunIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [text, setText] = useState("Coimbatore");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);


  const weatherIconMap = {
    "01d": clearSkyIcon,
    "01n": clearSkyNightIcon,
    "02d": clearSkyIcon,
    "02n": clearSkyNightIcon,
    "03d": cloudyIcon,
    "03n": cloudyIcon,
    "04d": cloudyIcon,
    "04n": cloudyIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": stromIcon,
    "11n": stromIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "15n": snowIcon,
    "50d": mistIcon,
    "50n": mistIcon,
  };

  const search = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    setLoading(true);
    try {

      let res = await fetch(url);
      let data = await res.json();

      // console.log(data);
      if (data.cod === "404") {
        console.log("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCountry(data.sys.country);
      setCity(data.name);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setTemp(Math.floor(data.main.temp));

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearSkyIcon);

      setCityNotFound(false);

    } catch (error) {
      console.log("An error occured:", error.message);
      setError("An error occured while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="contanier">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search city"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div
            className="search-icon"
            onClick={() => {
              search();
            }}
          >
            <img src={searchIcon} alt="Search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
      
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city}
          country={country} lat={lat} lon={lon} humidity={humidity}
          wind={wind}/>}
      </div>
    </>
  );
}

export default App;
