"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import LiveMap from "./LiveMap";
import SunnyAnimation from "./animations/SunnyAnimation";
import RainAnimation from "./animations/RainAnimation";
import CloudyAnimation from "./animations/CloudyAnimation";
import SnowAnimation from "./animations/SnowAnimation";
import DefaultAnimation from "./animations/DefaultAnimation";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const DEFAULT_CITY = "New York";

const themes = {
  clear: "theme-clear",
  rain: "theme-rain",
  cloudy: "theme-cloudy",
  snow: "theme-snow",
  default: "theme-default",
};

const SEARCH_ALIASES = {
  bnagladesh: "bangladesh",
  bangaldesh: "bangladesh",
  "bangla desh": "bangladesh",
  bd: "bangladesh",
  chitagong: "chattogram",
  chittagong: "chattogram",
  chattagram: "chattogram",
};

const BANGLADESH_CITIES = [
  { name: "Dhaka", state: "Dhaka", country: "BD", lat: 23.8103, lon: 90.4125 },
  { name: "Chattogram", state: "Chattogram", country: "BD", lat: 22.3569, lon: 91.7832 },
  { name: "Khulna", state: "Khulna", country: "BD", lat: 22.8456, lon: 89.5403 },
  { name: "Rajshahi", state: "Rajshahi", country: "BD", lat: 24.3745, lon: 88.6042 },
  { name: "Sylhet", state: "Sylhet", country: "BD", lat: 24.8949, lon: 91.8687 },
  { name: "Barishal", state: "Barishal", country: "BD", lat: 22.701, lon: 90.3535 },
];

const BD_CITY_ALIASES = {
  dhaka: "Dhaka",
  dacca: "Dhaka",
  chattogram: "Chattogram",
  chittagong: "Chattogram",
  chitagong: "Chattogram",
  chattagram: "Chattogram",
  khulna: "Khulna",
  rajshahi: "Rajshahi",
  sylhet: "Sylhet",
  barishal: "Barishal",
};

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const POI_KEYWORDS = [
  "school",
  "college",
  "hospital",
  "market",
  "station",
  "airport",
  "betar",
  "radio",
  "colony",
  "para",
  "bazar",
];

function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function normalizeQuery(value) {
  const normalized = value.toLowerCase().trim().replace(/\s+/g, " ");
  return SEARCH_ALIASES[normalized] || normalized;
}

function splitSearchTerms(value) {
  return value
    .split(",")
    .map((item) => sanitizePlaceText(item))
    .filter(Boolean);
}

function toTitleCase(value = "") {
  return sanitizePlaceText(value)
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part))
    .join(" ");
}

function isLikelyPoiName(value = "") {
  const normalized = sanitizePlaceText(value).toLowerCase();
  return POI_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function sanitizePlaceText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getCountryLabel(countryCode = "") {
  try {
    if (!countryCode) return "";
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(countryCode.toUpperCase()) || countryCode.toUpperCase();
  } catch {
    return countryCode.toUpperCase();
  }
}

function getPreferredCountry(query) {
  const normalized = normalizeQuery(query);
  return normalized.includes("bangladesh") ? "BD" : null;
}

function getCondition(main = "") {
  const value = main.toLowerCase();
  if (value.includes("clear")) return "clear";
  if (["rain", "drizzle", "thunderstorm"].some((tag) => value.includes(tag))) return "rain";
  if (["cloud", "mist", "fog", "haze", "smoke"].some((tag) => value.includes(tag))) return "cloudy";
  if (value.includes("snow")) return "snow";
  return "default";
}

function formatLocation(city) {
  const cityName = sanitizePlaceText(city.name);
  const stateName = sanitizePlaceText(city.state);
  const countryLabel = getCountryLabel(city.country);
  return [cityName, stateName, countryLabel].filter(Boolean).join(", ");
}

function formatLocationCode(city) {
  const cityName = sanitizePlaceText(city.name);
  const stateName = sanitizePlaceText(city.state);
  const countryCode = sanitizePlaceText(city.country || "").toUpperCase();
  return [cityName, stateName, countryCode].filter(Boolean).join(", ");
}

function formatResolvedLabel({ target, cityTerm = "", countryInfo = null }) {
  if (cityTerm) {
    const cityName = toTitleCase(cityTerm);
    const stateName = sanitizePlaceText(target?.state || "");
    const countryLabel = countryInfo?.name || getCountryLabel(target?.country);
    return [cityName, stateName, countryLabel].filter(Boolean).join(", ");
  }

  return formatLocation(target || {});
}

function formatWeatherTime(utcSeconds, timezoneOffset, options) {
  if (!isFiniteNumber(utcSeconds) || !isFiniteNumber(timezoneOffset)) return "--";
  const date = new Date((utcSeconds + timezoneOffset) * 1000);
  return new Intl.DateTimeFormat(undefined, { ...options, timeZone: "UTC" }).format(date);
}

function mergeUniqueCities(cities) {
  const seen = new Set();
  return cities.filter((city) => {
    const key = `${city.name}-${city.country}-${city.lat?.toFixed?.(4)}-${city.lon?.toFixed?.(4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getCountryFallbackCities(query) {
  return normalizeQuery(query) === "bangladesh" ? BANGLADESH_CITIES : [];
}

function getPreferredBangladeshCity(query) {
  const normalized = normalizeQuery(query);
  const canonicalName = BD_CITY_ALIASES[normalized];
  if (!canonicalName) return null;
  return BANGLADESH_CITIES.find((city) => city.name === canonicalName) || null;
}

function scoreSuggestion(city, query, preferredCountry) {
  const normalizedQuery = sanitizePlaceText(normalizeQuery(query)).toLowerCase();
  const cityName = sanitizePlaceText(city.name).toLowerCase();
  const stateName = sanitizePlaceText(city.state).toLowerCase();
  let score = 0;

  if (preferredCountry && city.country === preferredCountry) score += 500;
  if (preferredCountry && city.country !== preferredCountry) score -= 900;
  if (cityName === normalizedQuery) score += 1000;
  if (cityName.startsWith(normalizedQuery)) score += 220;
  if (cityName.includes(normalizedQuery)) score += 120;
  if (stateName.includes(normalizedQuery)) score += 40;
  if (isLikelyPoiName(city.name)) score -= 350;
  if (BANGLADESH_CITIES.some((item) => item.name === city.name && city.country === "BD")) score += 260;

  return score;
}

const Weather = () => {
  const [query, setQuery] = useState("");
  const [searchedLocation, setSearchedLocation] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");

  const theme = useMemo(() => {
    const condition = getCondition(weather?.weather?.[0]?.main);
    return themes[condition] || themes.default;
  }, [weather]);

  const condition = getCondition(weather?.weather?.[0]?.main);
  const unitSymbol = unit === "metric" ? "C" : "F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  const weatherTime = useMemo(
    () =>
      formatWeatherTime(weather?.dt, weather?.timezone, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    [weather]
  );

  const sunriseTime = useMemo(
    () =>
      formatWeatherTime(weather?.sys?.sunrise, weather?.timezone, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    [weather]
  );

  const sunsetTime = useMemo(
    () =>
      formatWeatherTime(weather?.sys?.sunset, weather?.timezone, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    [weather]
  );

  const fetchGeoLocations = useCallback(async (location, limit = 8) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=${limit}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch city suggestions.");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }, []);

  const fetchCountryInfo = useCallback(async (query) => {
    const normalized = sanitizePlaceText(normalizeQuery(query)).toLowerCase();
    if (normalized.length < 2) return null;

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent(normalized)}?fields=name,cca2,capital,altSpellings`
      );
      if (!response.ok) return null;
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) return null;

      const match = data.find((country) => {
        const commonName = sanitizePlaceText(country?.name?.common || "").toLowerCase();
        const officialName = sanitizePlaceText(country?.name?.official || "").toLowerCase();
        const code = sanitizePlaceText(country?.cca2 || "").toLowerCase();
        const altSpellings = Array.isArray(country?.altSpellings)
          ? country.altSpellings.map((item) => sanitizePlaceText(item).toLowerCase())
          : [];
        return (
          commonName === normalized ||
          officialName === normalized ||
          code === normalized ||
          altSpellings.includes(normalized)
        );
      });

      const country = match || data[0];
      if (!country?.cca2) return null;

      return {
        code: country.cca2.toUpperCase(),
        name: country?.name?.common || "",
        capital: Array.isArray(country?.capital) && country.capital[0] ? country.capital[0] : "",
      };
    } catch {
      return null;
    }
  }, []);

  const resolveSearchIntent = useCallback(
    async (rawInput) => {
      const normalizedInput = normalizeQuery(rawInput);
      const terms = splitSearchTerms(normalizedInput);

      if (terms.length >= 2) {
        const first = terms[0];
        const second = terms[1];
        const [firstCountry, secondCountry] = await Promise.all([fetchCountryInfo(first), fetchCountryInfo(second)]);

        if (secondCountry?.code) {
          return { normalizedInput, cityTerm: first, countryInfo: secondCountry };
        }

        if (firstCountry?.code) {
          return { normalizedInput, cityTerm: second, countryInfo: firstCountry };
        }
      }

      const fullCountry = await fetchCountryInfo(normalizedInput);
      return { normalizedInput, cityTerm: fullCountry ? "" : normalizedInput, countryInfo: fullCountry };
    },
    [fetchCountryInfo]
  );

  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch weather for this location.");
    }

    return response.json();
  }, []);

  const handleWeatherResponse = useCallback((data, resolvedLocationLabel = "") => {
    setWeather(data);
    if (resolvedLocationLabel) {
      setSearchedLocation(resolvedLocationLabel);
      return;
    }
    setSearchedLocation(`${data.name}, ${data.sys.country}`);
  }, []);

  const fetchWeather = useCallback(
    async (location, selectedSuggestion = null) => {
      if (!API_KEY) {
        setError("Missing API key. Add NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment.");
        return;
      }

      const normalizedLocation = normalizeQuery(location);
      const preferredCountry = getPreferredCountry(normalizedLocation);
      const preferredBangladeshCity = getPreferredBangladeshCity(normalizedLocation);
      const intent = await resolveSearchIntent(location);
      const countryInfo = intent.countryInfo;
      const cityTerm = intent.cityTerm || normalizedLocation;

      setLoading(true);
      setError("");

      try {
        let target = selectedSuggestion;

        if (!target || !isFiniteNumber(target.lat) || !isFiniteNumber(target.lon)) {
          if (preferredBangladeshCity) {
            target = preferredBangladeshCity;
          } else if (countryInfo?.code) {
            if (!cityTerm && countryInfo.capital) {
              const capitalResults = await fetchGeoLocations(`${countryInfo.capital},${countryInfo.code}`, 6);
              const capitalInsideCountry = capitalResults.filter((city) => city.country === countryInfo.code);
              if (capitalInsideCountry.length > 0) {
                target = capitalInsideCountry[0];
              }
            }

            if (!target) {
              const scopedQuery = cityTerm ? `${cityTerm},${countryInfo.code}` : `${normalizedLocation},${countryInfo.code}`;
              const countryScoped = await fetchGeoLocations(scopedQuery, 12);
              const insideCountry = countryScoped.filter((city) => city.country === countryInfo.code);
              if (insideCountry.length > 0) {
                const rankedCountryCities = insideCountry
                  .slice()
                  .sort((a, b) => scoreSuggestion(b, cityTerm || normalizedLocation, countryInfo.code) - scoreSuggestion(a, cityTerm || normalizedLocation, countryInfo.code));
                target = rankedCountryCities[0];
              }
            }
          } else {
            const queryWithCountry = preferredCountry ? `${normalizedLocation},${preferredCountry}` : normalizedLocation;
            const geoResults = await fetchGeoLocations(queryWithCountry, 10);
            if (geoResults.length > 0) {
              const ranked = geoResults
                .slice()
                .sort((a, b) => scoreSuggestion(b, normalizedLocation, preferredCountry) - scoreSuggestion(a, normalizedLocation, preferredCountry));
              target = ranked[0];
            } else {
              const fallbackCities = getCountryFallbackCities(normalizedLocation);
              if (fallbackCities.length > 0) target = fallbackCities[0];
            }
          }
        }

        if (!target || !isFiniteNumber(target.lat) || !isFiniteNumber(target.lon)) {
          throw new Error("Location not found. Use city name (example: Dhaka, BD).");
        }

        const resolvedLocationLabel = formatResolvedLabel({
          target: selectedSuggestion || target,
          cityTerm: cityTerm || (selectedSuggestion ? sanitizePlaceText(selectedSuggestion.name) : ""),
          countryInfo,
        });

        const data = await fetchWeatherByCoords(target.lat, target.lon);
        handleWeatherResponse(data, resolvedLocationLabel);
      } catch (fetchError) {
        setWeather(null);
        setError(fetchError.message || "Unable to load weather data.");
      } finally {
        setLoading(false);
      }
    },
    [fetchGeoLocations, fetchWeatherByCoords, handleWeatherResponse, resolveSearchIntent]
  );

  const fetchCurrentLocationWeather = useCallback(() => {
    if (!API_KEY) {
      setError("Missing API key. Add NEXT_PUBLIC_OPENWEATHER_API_KEY in your environment.");
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not available in this browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          handleWeatherResponse(data, formatLocationCode(data));
        } catch (fetchError) {
          setWeather(null);
          setError(fetchError.message || "Unable to load weather data.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location access denied. Please allow location permission or search manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [fetchWeatherByCoords, handleWeatherResponse]);

  const fetchSuggestions = useCallback(
    async (input) => {
      if (!API_KEY || input.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const normalized = normalizeQuery(input);
        const preferredCountry = getPreferredCountry(normalized);
        const preferredBangladeshCity = getPreferredBangladeshCity(normalized);
        const fallbackCities = getCountryFallbackCities(normalized);
        const intent = await resolveSearchIntent(input);
        const countryInfo = intent.countryInfo;
        const cityTerm = intent.cityTerm || normalized;

        if (countryInfo?.code) {
          const countryResults = [];

          if (!cityTerm && countryInfo.capital) {
            const capitalCandidates = await fetchGeoLocations(`${countryInfo.capital},${countryInfo.code}`, 8);
            countryResults.push(...capitalCandidates.filter((city) => city.country === countryInfo.code));
          }

          const scopedCandidates = await fetchGeoLocations(`${cityTerm},${countryInfo.code}`, 14);
          countryResults.push(...scopedCandidates.filter((city) => city.country === countryInfo.code));

          const rankedCountryResults = countryResults
            .slice()
            .sort((a, b) => scoreSuggestion(b, cityTerm, countryInfo.code) - scoreSuggestion(a, cityTerm, countryInfo.code));

          const mergedCountry = mergeUniqueCities(rankedCountryResults).slice(0, 10);
          if (mergedCountry.length > 0) {
            setSuggestions(mergedCountry);
            return;
          }
        }

        if (fallbackCities.length > 0) {
          setSuggestions(fallbackCities.slice(0, 10));
          return;
        }

        const queryWithCountry = preferredCountry ? `${normalized},${preferredCountry}` : normalized;
        const apiResults = await fetchGeoLocations(queryWithCountry, 14);
        const ranked = apiResults
          .slice()
          .sort((a, b) => scoreSuggestion(b, normalized, preferredCountry) - scoreSuggestion(a, normalized, preferredCountry));
        const merged = mergeUniqueCities(preferredBangladeshCity ? [preferredBangladeshCity, ...ranked] : ranked).slice(0, 10);
        setSuggestions(merged);
      } catch {
        setSuggestions(getCountryFallbackCities(input));
      }
    },
    [fetchGeoLocations, resolveSearchIntent]
  );

  useEffect(() => {
    fetchWeather(DEFAULT_CITY);
  }, [fetchWeather]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 260);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const submitSearch = useCallback(
    (value, selectedSuggestion = null) => {
      const next = value.trim();
      if (!next) return;
      setQuery("");
      setSuggestions([]);
      setActiveIndex(-1);
      fetchWeather(next, selectedSuggestion);
    },
    [fetchWeather]
  );

  const onKeyDown = (event) => {
    if (!suggestions.length) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitSearch(query);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        submitSearch(formatLocation(suggestions[activeIndex]), suggestions[activeIndex]);
      } else {
        submitSearch(query);
      }
      return;
    }

    if (event.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const renderAnimation = () => {
    if (condition === "clear") return <SunnyAnimation />;
    if (condition === "rain") return <RainAnimation />;
    if (condition === "cloudy") return <CloudyAnimation />;
    if (condition === "snow") return <SnowAnimation />;
    return <DefaultAnimation />;
  };

  const temperature = weather?.main?.temp;
  const displayTemperature =
    typeof temperature === "number"
      ? unit === "metric"
        ? `${Math.round(temperature)}°${unitSymbol}`
        : `${Math.round(toFahrenheit(temperature))}°${unitSymbol}`
      : "--";

  const feelsLike = weather?.main?.feels_like;
  const displayFeelsLike =
    typeof feelsLike === "number"
      ? unit === "metric"
        ? `${Math.round(feelsLike)}°${unitSymbol}`
        : `${Math.round(toFahrenheit(feelsLike))}°${unitSymbol}`
      : "--";

  const windSpeed = weather?.wind?.speed;
  const displayWind =
    typeof windSpeed === "number"
      ? `${unit === "metric" ? windSpeed.toFixed(1) : (windSpeed * 2.23694).toFixed(1)} ${windUnit}`
      : "--";

  const humidity = weather?.main?.humidity;
  const pressure = weather?.main?.pressure;
  const visibility = weather?.visibility;
  const clouds = weather?.clouds?.all;

  return (
    <section className={`weather-shell ${theme}`}>
      <div className="weather-content">
        <article className="weather-panel" aria-live="polite">
          <header className="weather-header">
            <p className="weather-kicker">Live Conditions</p>
            <h2 className="weather-title">Weather Intelligence</h2>
          </header>

          <form
            className="weather-search"
            onSubmit={(event) => {
              event.preventDefault();
              submitSearch(query);
            }}
          >
            <label className="sr-only" htmlFor="weather-search-input">
              Search city
            </label>
            <input
              id="weather-search-input"
              value={query}
              type="text"
              autoComplete="off"
              placeholder="Search city, country, or Bangladesh"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={onKeyDown}
            />
            <button type="submit">Search</button>
          </form>

          {suggestions.length > 0 && (
            <ul className="weather-suggestions" role="listbox" aria-label="Suggested locations">
              {suggestions.map((city, index) => {
                const label = formatLocation(city);
                return (
                  <li
                    key={`${label}-${city.lat}-${city.lon}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={index === activeIndex ? "is-active" : ""}
                    onMouseDown={() => submitSearch(label, city)}
                  >
                    {label}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="weather-meta-row">
            <p className="weather-location">{searchedLocation}</p>
            <div className="meta-actions">
              <button type="button" className="location-btn" onClick={fetchCurrentLocationWeather}>
                Use my location
              </button>
              <button
                type="button"
                className="unit-toggle"
                aria-label="Toggle temperature unit"
                onClick={() => setUnit((prev) => (prev === "metric" ? "imperial" : "metric"))}
              >
                {unit === "metric" ? "°C" : "°F"}
              </button>
            </div>
          </div>

          {loading && <p className="weather-status">Loading latest weather...</p>}
          {error && <p className="weather-error">{error}</p>}

          {weather && !loading && !error && (
            <>
              <div className="weather-animation-wrap">{renderAnimation()}</div>
              <p className="weather-temp">{displayTemperature}</p>
              <p className="weather-desc">{weather.weather?.[0]?.description}</p>
              <p className="weather-time">Local time: {weatherTime}</p>

              <dl className="weather-stats">
                <div>
                  <dt>Feels like</dt>
                  <dd>{displayFeelsLike}</dd>
                </div>
                <div>
                  <dt>Humidity</dt>
                  <dd>{typeof humidity === "number" ? `${humidity}%` : "--"}</dd>
                </div>
                <div>
                  <dt>Wind</dt>
                  <dd>{displayWind}</dd>
                </div>
                <div>
                  <dt>Pressure</dt>
                  <dd>{typeof pressure === "number" ? `${pressure} hPa` : "--"}</dd>
                </div>
                <div>
                  <dt>Visibility</dt>
                  <dd>{typeof visibility === "number" ? `${(visibility / 1000).toFixed(1)} km` : "--"}</dd>
                </div>
                <div>
                  <dt>Clouds</dt>
                  <dd>{typeof clouds === "number" ? `${clouds}%` : "--"}</dd>
                </div>
                <div>
                  <dt>Sunrise</dt>
                  <dd>{sunriseTime}</dd>
                </div>
                <div>
                  <dt>Sunset</dt>
                  <dd>{sunsetTime}</dd>
                </div>
              </dl>
            </>
          )}
        </article>

        <aside className="weather-map-card" aria-label="Weather location map">
          <LiveMap
            lat={weather?.coord?.lat}
            lon={weather?.coord?.lon}
            cityName={searchedLocation}
          />
        </aside>
      </div>
    </section>
  );
};

export default Weather;
