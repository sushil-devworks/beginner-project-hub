import React, { useState } from "react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

const weatherEmojiMap = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌧️",
  53: "🌧️",
  55: "🌧️",
  56: "🌧️",
  57: "🌧️",
  61: "🌦️",
  63: "🌧️",
  65: "⛈️",
  66: "🌧️",
  67: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  77: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  85: "🌨️",
  86: "❄️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  const getWeatherDescription = (code) =>
    weatherCodeMap[code] || "Unknown conditions";
  const getWeatherEmoji = (code) => weatherEmojiMap[code] || "❔";

  const fetchWeather = async (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setError("Please enter a city name or ZIP code.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`,
      );

      if (!geoResponse.ok) {
        throw new Error("Location lookup failed. Try another location.");
      }

      const geoData = await geoResponse.json();
      const location = geoData?.results?.[0];
      if (!location) {
        throw new Error("Location not found. Try another location.");
      }

      const { latitude, longitude, name, country } = location;

      const forecastResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m,pressure_msl,apparent_temperature&timezone=auto`,
      );

      if (!forecastResponse.ok) {
        throw new Error("Weather data unavailable. Try again later.");
      }

      const forecastData = await forecastResponse.json();
      const current = forecastData.current_weather;
      if (!current) {
        throw new Error("Weather data unavailable. Try again later.");
      }

      const timeIndex = forecastData.hourly.time.findIndex(
        (time) => time === current.time,
      );

      const feelsLike =
        timeIndex !== -1
          ? forecastData.hourly.apparent_temperature[timeIndex]
          : current.temperature;
      const humidity =
        timeIndex !== -1
          ? forecastData.hourly.relativehumidity_2m[timeIndex]
          : null;
      const pressure =
        timeIndex !== -1 ? forecastData.hourly.pressure_msl[timeIndex] : null;

      setWeather({
        name: `${name}${country ? `, ${country}` : ""}`,
        temperature: current.temperature,
        feels_like: feelsLike,
        humidity,
        pressure,
        wind_speed: current.windspeed,
        weathercode: current.weathercode,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
      <div
        data-aos="fade-left"
        data-aos-delay={100}
        className="w-full max-w-md rounded-[28px] p-7 bg-slate-950/95 shadow-[0_30px_90px_rgba(0,0,0,0.45)] border border-slate-800/60 overflow-hidden"
      >
        <div className="mb-5">
          <p className="text-sky-400 font-semibold uppercase tracking-[0.16em] text-[12px]">
            Glassmorphism Weather
          </p>
          <h1 className="mt-2 mb-1 text-4xl leading-tight">Dark weather app</h1>
          <p className="text-slate-300 leading-7 text-sm">
            Enter a city name see current weather conditions.
          </p>
        </div>

        <form onSubmit={fetchWeather}>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter your city name"
            className="w-full rounded-2xl border border-slate-400/20 bg-slate-900/90 px-4 py-3 mb-4 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 text-white font-bold transition-transform duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Search weather"}
          </button>
        </form>

        {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

        {weather && (
          <div className="mt-7 rounded-[24px] border border-slate-400/14 bg-slate-900/55 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 text-[13px] uppercase tracking-[0.12em] text-sky-300">
                  {weather.name}
                </p>
                <h2 className="mt-2 text-[3rem] leading-none">
                  {Math.round(weather.temperature)}°C
                </h2>
                <p className="mt-2 text-slate-300 text-sm">
                  {getWeatherDescription(weather.weathercode)}
                </p>
              </div>
              <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-slate-800/80 text-[3.5rem]">
                {getWeatherEmoji(weather.weathercode)}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-400/8 p-4 text-center">
                <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  Feels like
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {Math.round(weather.feels_like)}°C
                </p>
              </div>
              <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-400/8 p-4 text-center">
                <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  Humidity
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {weather.humidity !== null ? `${weather.humidity}%` : "N/A"}
                </p>
              </div>
              <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-400/8 p-4 text-center">
                <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  Wind
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {Math.round(weather.wind_speed)} m/s
                </p>
              </div>
              <div className="flex-1 min-w-[120px] rounded-2xl bg-slate-400/8 p-4 text-center">
                <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  Pressure
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {weather.pressure !== null
                    ? `${Math.round(weather.pressure)} hPa`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
