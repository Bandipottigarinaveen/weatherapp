export async function fetchWeatherByCoords(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'dew_point_2m',
      'weather_code',
      'precipitation',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'precipitation'
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'sunrise',
      'sunset',
      'uv_index_max'
    ].join(','),
    timezone: 'auto'
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather');
  const json = await res.json();
  return normalizeOpenMeteo(json);
}

function normalizeOpenMeteo(data) {
  const current = data.current ?? {};
  const hourly = data.hourly ?? {};
  const daily = data.daily ?? {};

  const hourlyItems = (hourly.time || []).slice(0, 12).map((t, i) => ({
    time: new Date(t),
    temp: hourly.temperature_2m?.[i],
    pop: hourly.precipitation_probability?.[i],
  }));

  const dailyItems = (daily.time || []).slice(0, 7).map((t, i) => ({
    date: new Date(t),
    max: daily.temperature_2m_max?.[i],
    min: daily.temperature_2m_min?.[i],
    precip: daily.precipitation_sum?.[i]
  }));

  return {
    current: {
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windKmh: current.wind_speed_10m,
      visibilityKm: current.visibility ? (current.visibility / 1000) : undefined,
      pressureMb: current.pressure_msl ?? current.surface_pressure,
      dewPoint: current.dew_point_2m,
      code: current.weather_code
    },
    hourly: hourlyItems,
    daily: dailyItems,
    sun: {
      sunrise: daily.sunrise?.[0] ? new Date(daily.sunrise[0]) : undefined,
      sunset: daily.sunset?.[0] ? new Date(daily.sunset[0]) : undefined,
      uvMax: daily.uv_index_max?.[0]
    }
  };
}

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const params = new URLSearchParams({
    name: query.trim(),
    count: '8',
    language: 'en',
    format: 'json'
  });
  const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  const results = json.results || [];
  return results.map(r => ({
    id: `${r.latitude},${r.longitude}`,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude
  }));
}

export async function fetchAirQualityByCoords(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: ['european_aqi'].join(','),
    timezone: 'auto'
  });
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  const idx = json.hourly?.european_aqi?.[0];
  return typeof idx === 'number' ? { aqi: Math.round(idx), level: aqiLevel(idx) } : null;
}

function aqiLevel(aqi) {
  if (aqi <= 20) return 'Low';
  if (aqi <= 40) return 'Moderate';
  if (aqi <= 60) return 'High';
  if (aqi <= 80) return 'Very High';
  return 'Extreme';
}


