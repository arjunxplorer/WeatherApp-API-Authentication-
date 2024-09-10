'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationRequested, setLocationRequested] = useState(false);

  const { user, googleSignIn, logOut } = useAuth();

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setLocationRequested(true);
        },
        error => {
          setError("Unable to retrieve your location. Please enter a city name.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please enter a city name.");
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      setWeather(weatherResponse.data);
      setCity(weatherResponse.data.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;
      const geoResponse = await axios.get(geoUrl);
      
      if (geoResponse.data.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = geoResponse.data[0];
      await fetchWeatherByCoords(lat, lon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !locationRequested) {
      getUserLocation();
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && user) {
      fetchWeatherByCity(city);
    }
  };

  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
      <div className="max-w-md w-full backdrop-blur-md bg-white/30 rounded-3xl overflow-hidden shadow-lg border border-white/50">
        <div className="p-6 text-white">
          <h1 className="text-3xl font-bold mb-4">Weather App</h1>
          {user ? (
            <>
              <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="flex-grow p-3 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors disabled:bg-white/50 disabled:text-blue-300"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {loading && <p className="text-white">Loading...</p>}
              {error && <p className="text-red-300">Error: {error}</p>}

              {weather && (
                <div className="text-white mb-6">
                  <h2 className="text-2xl font-bold mb-2">{weather.name}, {weather.sys.country}</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
                      <p className="text-2xl">{Math.round(celsiusToFahrenheit(weather.main.temp))}°F</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl capitalize">{weather.weather[0].description}</p>
                      <p>Humidity: {weather.main.humidity}%</p>
                      <p>Wind: {weather.wind.speed} m/s</p>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={logOut}
                className="w-full bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={googleSignIn}
              className="w-full bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </main>
  );
}