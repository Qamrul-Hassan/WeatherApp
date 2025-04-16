import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWeatherStore = create(
  persist(
    (set, get) => ({
      city: "Dhaka",
      weather: null,
      loading: false,
      error: null,
      suggestions: [],
      unit: 'metric',
      lastUpdated: null,
      recentSearches: [],

      setCity: (city) => set({ city }),

      setSuggestions: (suggestions) => set({ suggestions }),

      fetchSuggestions: async (query) => {
        if (!query.trim()) return set({ suggestions: [] });
        
        try {
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=8b9dea5949ad5b903498600df1c91000`
          );
          const data = await res.json();
          
          set({
            suggestions: data.map(city => ({
              name: `${city.name}, ${city.country}`,
              lat: city.lat,
              lon: city.lon
            }))
          });
        } catch (err) {
          set({ suggestions: [] });
        }
      },

      fetchWeather: async (cityName) => {
        set({ loading: true, error: null });
        
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${get().unit}&appid=8b9dea5949ad5b903498600df1c91000`
          );
          
          if (!res.ok) throw new Error("City not found");
          
          const data = await res.json();
          set({ 
            weather: data,
            lastUpdated: Date.now()
          });
          
          // Add to recent searches
          set(state => ({
            recentSearches: [
              cityName,
              ...state.recentSearches.filter(c => c !== cityName)
            ].slice(0, 5)
          }));
          
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },
      
      toggleUnit: () => {
        const { unit, city, fetchWeather } = get();
        const newUnit = unit === 'metric' ? 'imperial' : 'metric';
        set({ unit: newUnit });
        fetchWeather(city);
      }
    }),
    {
      name: "weather-storage",
      partialize: (state) => ({
        unit: state.unit,
        recentSearches: state.recentSearches
      })
    }
  )
);

export default useWeatherStore;