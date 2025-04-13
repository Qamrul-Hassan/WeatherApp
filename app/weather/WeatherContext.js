import { create } from "zustand";

const useWeatherStore = create((set) => ({
  city: "Dhaka", // Default city
  weather: null,
  loading: false,
  error: null,
  suggestions: [],
  
  // Set the current city
  setCity: (city) => set({ city }),

  // Set the suggestions list (for location search suggestions)
  setSuggestions: (suggestions) => set({ suggestions }),

  // Fetch suggestions from the OpenWeatherMap Geo API
  fetchSuggestions: async (query) => {
    if (!query) return set({ suggestions: [] });

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=8b9dea5949ad5b903498600df1c91000`
      );
      const data = await res.json();
      
      if (data.length === 0) {
        set({ suggestions: [] });
        return;
      }
      
      set({
        suggestions: data.map((city) => ({
          name: `${city.name}, ${city.country}`, // Display full city with country
          lat: city.lat,
          lon: city.lon,
        })),
      });
    } catch (err) {
      console.error("Error fetching suggestions:", err.message);
      set({ suggestions: [] });
    }
  },

  // Fetch weather data for a given city
  fetchWeather: async (cityName) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8b9dea5949ad5b903498600df1c91000`
      );

      if (!res.ok) throw new Error("City not found. Please try again.");

      const data = await res.json();
      set({ weather: data, error: null });
    } catch (err) {
      set({ error: err.message, weather: null });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useWeatherStore;
