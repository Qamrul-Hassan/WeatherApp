"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import SunnyAnimation from "./animations/SunnyAnimation";
import RainAnimation from "./animations/RainAnimation";
import CloudyAnimation from "./animations/CloudyAnimation";
import SnowAnimation from "./animations/SnowAnimation";
import DefaultAnimation from "./animations/DefaultAnimation";
import WorldMapImage from "../public/Images/map.png";
import useWeatherStore from "../app/weather/WeatherContext";
import LiveMap from "../components/LiveMap";

const Weather = () => {
  const { city, setCity } = useWeatherStore();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8b9dea5949ad5b903498600df1c91000`
      );
      if (!res.ok) throw new Error("City not found.");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (input) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=8b9dea5949ad5b903498600df1c91000`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  const debouncedFetchSuggestions = useCallback((input) => {
    fetchSuggestions(input);
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, [city]);

  useEffect(() => {
    if (query.length > 1) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query, debouncedFetchSuggestions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setCity(query.trim());
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name, state, country) => {
    const fullLocation = [name, state, country].filter(Boolean).join(", ");
    setCity(fullLocation);
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        const s = suggestions[activeIndex];
        handleSuggestionClick(s.name, s.state, s.country);
      }
    }
  };

  const renderAnimation = () => {
    if (!weather) return null;
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return <SunnyAnimation />;
    if (["rain", "drizzle", "thunderstorm"].some((c) => condition.includes(c)))
      return <RainAnimation />;
    if (["cloud", "mist", "fog", "haze"].some((c) => condition.includes(c)))
      return <CloudyAnimation />;
    if (condition.includes("snow")) return <SnowAnimation />;
    return <DefaultAnimation />;
  };

  const kelvinToCelsius = (k) => (k - 273.15).toFixed(1);
  const kelvinToFahrenheit = (k) => ((k - 273.15) * 1.8 + 32).toFixed(1);

  const getBackgroundGradient = () => {
    if (!weather) return "from-blue-400 to-purple-500";
    const condition = weather.weather[0].main.toLowerCase();
    if (condition.includes("clear")) return "from-yellow-400 to-orange-500";
    if (condition.includes("rain") || condition.includes("thunderstorm"))
      return "from-gray-600 to-blue-800";
    if (["cloud", "mist", "fog"].some((c) => condition.includes(c)))
      return "from-gray-400 to-gray-700";
    if (condition.includes("snow")) return "from-white to-blue-200";
    return "from-blue-400 to-purple-500";
  };

  return (
    <div className={`relative w-full min-h-screen flex flex-col lg:flex-row items-start justify-center gap-8 px-4 py-6 bg-gradient-to-r ${getBackgroundGradient()} overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <Image src={WorldMapImage} alt="World Map" fill quality={60} style={{ objectFit: "cover", opacity: 0.25, pointerEvents: "none" }} priority />
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full lg:max-w-lg text-center relative z-10 border border-white/10 hover:shadow-3xl hover:border-white/20 transition-all hover:scale-105">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter city name"
              className="flex-1 p-3 outline-none bg-transparent text-white placeholder-white/70"
            />
            <button
              type="submit"
              className="bg-white/20 text-white p-3 hover:bg-white/30 transition-colors"
            >
              Search
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="mt-2 text-left bg-white/10 backdrop-blur-md rounded-lg overflow-hidden max-h-40 overflow-y-auto border border-white/20">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  className={`px-4 py-2 text-white cursor-pointer transition ${idx === activeIndex ? "bg-white/20 font-semibold" : "hover:bg-white/20"}`}
                  onClick={() => handleSuggestionClick(s.name, s.state, s.country)}
                >
                  {[s.name, s.state, s.country].filter(Boolean).join(", ")}
                </li>
              ))}
            </ul>
          )}
        </form>

        {loading && <div className="text-white/80">Loading...</div>}
        {error && <div className="text-red-400 mb-4">{error}</div>}

        {weather && !loading && (
          <>
            <div className="mb-6">{renderAnimation()}</div>
            <h1 className="text-4xl font-bold text-white mb-2">{weather.name}</h1>
            <p className="text-2xl text-white/80 mb-4">{kelvinToCelsius(weather.main.temp)}°C / {kelvinToFahrenheit(weather.main.temp)}°F</p>
            <p className="text-xl text-white/80 capitalize">{weather.weather[0].description}</p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <WeatherStat label="Humidity" value={`${weather.main.humidity}%`} />
              <WeatherStat label="Wind Speed" value={`${weather.wind.speed} m/s`} />
              <WeatherStat label="Pressure" value={`${weather.main.pressure} hPa`} />
              <WeatherStat label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
            </div>
          </>
        )}
      </div>

      <div className="w-full lg:w-1/2 h-[450px] relative z-10">
        <LiveMap lat={weather?.coord?.lat} lon={weather?.coord?.lon} />
      </div>
    </div>
  );
};

const WeatherStat = ({ label, value }) => (
  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
    <p className="text-sm text-white/70">{label}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </div>
);

export default Weather;