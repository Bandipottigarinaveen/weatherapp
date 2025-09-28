import React from 'react';
import './App.css';
import { fetchWeatherByCoords, searchCities, fetchAirQualityByCoords } from './api';
import lottie from 'lottie-web';
import {
  rainyMascotAnimation,
  sunnyMascotAnimation,
  coldMascotAnimation,
  mildMascotAnimation
} from './animations';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

function Header({ title }) {
  return (
    <div className="header">
      <div className="location">{title || 'Search a city'} ∘</div>
      <div style={{ width: 28 }} />
    </div>
  );
}

function WeatherMascot({ weatherCondition }) {
  const containerRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const [useLottie, setUseLottie] = React.useState(false);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous animation
    if (animationRef.current) {
      animationRef.current.destroy();
      animationRef.current = null;
    }

    // Map weather conditions to Lottie animations
    const animationMap = {
      rain: rainyMascotAnimation,
      sunny: sunnyMascotAnimation,
      cold: coldMascotAnimation,
      cloudy: mildMascotAnimation,
      mild: mildMascotAnimation
    };

    const animationData = animationMap[weatherCondition];

    if (animationData) {
      try {
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData
        });
        setUseLottie(true);
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
        setUseLottie(false);
      }
    } else {
      setUseLottie(false);
    }

    return () => {
      if (animationRef.current) {
        try {
          animationRef.current.destroy();
        } catch (e) {}
        animationRef.current = null;
      }
    };
  }, [weatherCondition]);

  if (useLottie) {
    return (
      <div className="weather-mascot">
        <div className="mascot-container">
          <div className="lottie-container" ref={containerRef} />
        </div>
      </div>
    );
  }

  // Fallback to emoji if Lottie fails
  const getMascotEmoji = (condition) => {
    switch (condition) {
      case 'rain': return '🌧️';
      case 'sunny': return '☀️';
      case 'cold': return '❄️';
      case 'cloudy': return '☁️';
      default: return '🌤️';
    }
  };

  return (
    <div className="weather-mascot">
      <div className="mascot-container">
        <div className="mascot-person">
          <span style={{ fontSize: '32px', animation: 'mascotFloat 3s ease-in-out infinite' }}>
            {getMascotEmoji(weatherCondition)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SunPath({ sunrise, sunset }) {
  const now = new Date();
  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);
  const currentTime = now.getTime();
  const sunriseMs = sunriseTime.getTime();
  const sunsetMs = sunsetTime.getTime();
  
  // Calculate sun position (0-100%)
  let sunPosition = 0;
  if (currentTime >= sunriseMs && currentTime <= sunsetMs) {
    const totalDaylight = sunsetMs - sunriseMs;
    const elapsed = currentTime - sunriseMs;
    sunPosition = (elapsed / totalDaylight) * 100;
  } else if (currentTime > sunsetMs) {
    sunPosition = 100;
  }

  return (
    <div className="sun-path-container">
      <div className="sun-path"></div>
      <div 
        className="sun-icon"
        style={{ left: `${sunPosition}%` }}
      >
        ☀️
      </div>
      <div className="sun-times">
        <span>{sunriseTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
        <span>{sunsetTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}

function WeatherDetailsGrid({ data }) {
  const metrics = [
    { label: 'Humidity', value: `${data?.current?.humidity ?? '--'}%` },
    { label: 'Wind', value: `${Math.round(data?.current?.windKmh ?? 0)} km/h` },
    { label: 'UV Index', value: data?.sun?.uvMax ?? '--' },
    { label: 'Pressure', value: `${Math.round(data?.current?.pressureMb ?? 0)} mb` },
    { label: 'Visibility', value: data?.current?.visibilityKm ? `${data.current.visibilityKm.toFixed(1)} km` : '--' },
    { label: 'Dew Point', value: `${Math.round(data?.current?.dewPoint ?? 0)}°` }
  ];

  return (
    <div className="weather-grid">
      {metrics.map((metric, index) => (
        <div key={index} className="weather-metric">
          <div className="metric-label">{metric.label}</div>
          <div className="metric-value">{metric.value}</div>
        </div>
      ))}
    </div>
  );
}

function DailyForecast({ data }) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const getWeatherIcon = (temp) => {
    if (temp >= 35) return '☀️';
    if (temp >= 30) return '🌤️';
    if (temp >= 25) return '⛅';
    if (temp >= 20) return '☁️';
    return '🌧️';
  };

  const getCloudType = (temp) => {
    if (temp >= 35) return '☀️';
    if (temp >= 30) return '🌤️';
    if (temp >= 25) return '⛅';
    if (temp >= 20) return '☁️';
    return '🌧️';
  };
  
  return (
    <div className="daily-forecast">
      {(data?.daily || []).slice(0, 7).map((day, i) => (
        <div key={i} className="daily-item">
          <div className="daily-clouds">
            <span className="cloud-1" style={{ animationDelay: `${i * 0.5}s` }}>{getCloudType(day.max)}</span>
            <span className="cloud-2" style={{ animationDelay: `${i * 0.7}s` }}>☁️</span>
            <span className="cloud-3" style={{ animationDelay: `${i * 0.3}s` }}>☁️</span>
          </div>
          <div className="daily-content">
            <div className="daily-day">
              {day.date ? new Date(day.date).toLocaleDateString(undefined, { weekday: 'long' }) : days[i]}
            </div>
            <div className="daily-temps">
              <span className="daily-high">{Math.round(day.max)}°</span>
              <span className="daily-low">{Math.round(day.min)}°</span>
            </div>
          </div>
          <div className="daily-weather-icon">
            {getWeatherIcon(day.max)}
          </div>
        </div>
      ))}
    </div>
  );
}

function GeminiSummary({ data, onGenerateSummary, summary, isLoading }) {
  const handleGenerate = () => {
    if (data) {
      onGenerateSummary(data);
    }
  };

  return (
    <div>
      <button 
        className="gemini-button" 
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Get Weather Summary'}
      </button>
      
      {summary && (
        <div className="gemini-summary">
          <h3>Weather Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}


function CurrentWeather({ data }) {
  const temp = Math.round(data?.current?.temp ?? 31);
  const feels = Math.round(data?.current?.feelsLike ?? 37);
  const min = Math.round(data?.daily?.[0]?.min ?? 25);
  const max = Math.round(data?.daily?.[0]?.max ?? 32);
  
  // Determine weather condition
  const getWeatherCondition = () => {
    const humidity = data?.current?.humidity ?? 0;
    const pop = data?.hourly?.[0]?.pop ?? 0;
    
    if (humidity > 70 && pop > 50) return 'rain';
    if (temp <= 18) return 'cold';
    if (temp >= 34) return 'sunny';
    return 'cloudy';
  };

  return (
    <div className="current">
      <WeatherMascot weatherCondition={getWeatherCondition()} />
      <div className="temp">{temp}°</div>
      <div className="desc">{' '}
        {data ? 'Updated' : 'Fog'}
      </div>
      <div className="range">{max}° / {min}° Feels like {feels}°</div>
    </div>
  );
}

function HourlyCard({ data }) {

  return (
    <Card>
      <div className="card-title">6:00 AM - 6:00 PM Forecast. Highs 31 to 33°C and lows 24 to 26°C.</div>
      <div className="hourly">
        {(data?.hourly ?? Array.from({ length: 12 })).map((h, i) => {
          // Start from 6:00 AM and go to 6:00 PM (12 hours)
          const baseDate = new Date();
          baseDate.setHours(6, 0, 0, 0); // Set to 6:00 AM
          const date = h?.time ? new Date(h.time) : new Date(baseDate.getTime() + i * 60 * 60 * 1000);
          const hour = date.getHours();
          const hour12 = (hour % 12) || 12;
          const mer = hour < 12 ? 'am' : 'pm';
          // More realistic temperature curve for 6 AM to 6 PM
          const baseTemp = 22; // Starting temperature at 6 AM
          const tempVariation = Math.sin((i / 11) * Math.PI) * 8; // Peak around midday
          const temp = Math.round(h?.temp ?? baseTemp + tempVariation + (i % 2));
          const pop = h?.pop ?? Math.round(Math.random() * 100);
          
          // Get appropriate weather icon based on temperature
          const getWeatherIcon = (temp) => {
            if (temp >= 30) return '☀️';
            if (temp >= 25) return '🌤️';
            if (temp >= 20) return '⛅';
            return '☁️';
          };
          
          return (
            <div className="hour" key={i}>
              <div className="hour-time">{hour12}:00 {mer}</div>
              <div className="hour-icon">{getWeatherIcon(temp)}</div>
              <div className="hour-temp">{temp}°</div>
              <div className="hour-pop">{pop}%</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RainCard() {
  return (
    <Card>
      <div className="rain-chart">
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="bar" key={i} style={{ height: 12 + (i%4)*14 }} />
        ))}
      </div>
      <div className="rain-scale">
        {['0.0','0.32','1.43','1.51','0.01','0.0','0.0'].map((v, i) => (
          <div className="tick" key={i}>{v}</div>
        ))}
      </div>
    </Card>
  );
}

function AlertCard() {
  const slides = [
    { title: 'Grab an Umbrella!', sub: 'Thunderstorms possible after 14:00', qty: '3mm' },
    { title: 'Heat Alert', sub: 'High UV today between 11:00–15:00', qty: 'UV 9' },
    { title: 'Air Quality', sub: 'AQI is Moderate in your area', qty: 'AQI 35' },
    { title: 'Windy Evening', sub: 'Gusts up to 30 km/h after 18:00', qty: '30 km/h' }
  ];
  const [idx, setIdx] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  React.useEffect(() => {
    if (ref.current) ref.current.style.transform = `translateX(-${idx * 100}%)`;
  }, [idx]);

  return (
    <Card>
      <div className="carousel" onMouseEnter={() => clearInterval()}>
        <div className="slides" ref={ref}>
          {slides.map((s, i) => (
            <div className="slide" key={i}>
              <div className="alert">
                <div>
                  <div className="alert-title">{s.title}</div>
                  <div className="alert-sub">{s.sub}</div>
                </div>
                <div className="alert-amount">{s.qty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dots">
        {slides.map((_, i) => (
          <span key={i} className={`dot ${i===idx?'active':''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </Card>
  );
}

export default function App() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [title, setTitle] = React.useState('Mevalurkuppam');
  const [unit, setUnit] = React.useState('C'); // 'C' | 'F'
  const [, setAqi] = React.useState(null);
  const [theme, setTheme] = React.useState('theme-mild');
  const [geminiSummary, setGeminiSummary] = React.useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);

  // Gemini API integration
  const generateWeatherSummary = async (weatherData) => {
    setIsGeneratingSummary(true);
    try {
      // Generate a friendly, concise weather summary based on this data:
      // Current temperature: ${Math.round(weatherData.current?.temp ?? 0)}°C
      // Feels like: ${Math.round(weatherData.current?.feelsLike ?? 0)}°C
      // Humidity: ${weatherData.current?.humidity ?? 0}%
      // Wind: ${Math.round(weatherData.current?.windKmh ?? 0)} km/h
      // Daily high: ${Math.round(weatherData.daily?.[0]?.max ?? 0)}°C
      // Daily low: ${Math.round(weatherData.daily?.[0]?.min ?? 0)}°C
      // UV Index: ${weatherData.sun?.uvMax ?? 'N/A'}
      // 
      // Please provide a natural, conversational summary in 2-3 sentences.

      // For demo purposes, we'll generate a mock summary
      // In a real implementation, you would call the Gemini API here
      const mockSummary = `Today's weather is ${Math.round(weatherData.current?.temp ?? 0)}°C with ${weatherData.current?.humidity ?? 0}% humidity. It feels like ${Math.round(weatherData.current?.feelsLike ?? 0)}°C with winds at ${Math.round(weatherData.current?.windKmh ?? 0)} km/h. Expect temperatures ranging from ${Math.round(weatherData.daily?.[0]?.min ?? 0)}°C to ${Math.round(weatherData.daily?.[0]?.max ?? 0)}°C throughout the day.`;
      
      setGeminiSummary(mockSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setGeminiSummary('Sorry, I couldn\'t generate a weather summary at this time.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  React.useEffect(() => {
    async function onPosition({ coords }) {
      try {
        const [w, a] = await Promise.all([
          fetchWeatherByCoords(coords.latitude, coords.longitude),
          fetchAirQualityByCoords(coords.latitude, coords.longitude)
        ]);
        setData(w); setAqi(a);
      } catch (e) { setError(e); }
      finally { setLoading(false); }
    }
    async function onError() {
      try {
        const [w, a] = await Promise.all([
          fetchWeatherByCoords(13.0827, 80.2707),
          fetchAirQualityByCoords(13.0827, 80.2707)
        ]);
        setData(w); setAqi(a);
      } catch (e) { setError(e); }
      finally { setLoading(false); }
    }
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(onPosition, onError);
    else onError();
  }, []);

  React.useEffect(() => {
    let active = true;
    const t = setTimeout(() => {
      searchCities(query).then(res => { if (active) setSuggestions(res); });
    }, 250);
    return () => { active = false; clearTimeout(t); };
  }, [query]);

  React.useEffect(() => {
    function onClick(e) {
      const container = document.querySelector('.search');
      if (container && !container.contains(e.target)) setSuggestions([]);
    }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  function onPick(city) {
    setTitle([city.name, city.admin1, city.country].filter(Boolean).join(', '));
    setSuggestions([]);
    setQuery('');
    setLoading(true);
    Promise.all([
      fetchWeatherByCoords(city.latitude, city.longitude),
      fetchAirQualityByCoords(city.latitude, city.longitude)
    ])
      .then(([w, a]) => { setData(w); setAqi(a); })
      .catch(setError)
      .finally(() => setLoading(false));
  }

  function toUnit(celsius) {
    if (celsius == null) return celsius;
    return unit === 'C' ? Math.round(celsius) : Math.round((celsius * 9) / 5 + 32);
  }

  React.useEffect(() => {
    const root = document.querySelector('.parallax');
    if (!root) return;
    function onMove(e) {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5) * 2;
      const y = (e.clientY / h - 0.5) * 2;
      const layers = root.querySelectorAll('.layer');
      layers.forEach((el, i) => {
        const depth = i === 0 ? 10 : 20;
        el.style.transform = `translateZ(${-150 - i*100}px) translate(${x*depth}px, ${y*depth}px) scale(${1.2 + i*0.2})`;
      });
      document.documentElement.style.setProperty('--tiltX', `${x*2}deg`);
      document.documentElement.style.setProperty('--tiltY', `${-y*2}deg`);
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Gyro support (mobile)
  React.useEffect(() => {
    function handleOrientation(e) {
      const x = (e.gamma || 0) / 45; // left-right
      const y = (e.beta || 0) / 45;  // front-back
      document.documentElement.style.setProperty('--tiltX', `${x}deg`);
      document.documentElement.style.setProperty('--tiltY', `${-y}deg`);
    }
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Theme from weather
  React.useEffect(() => {
    if (!data) return;
    const t = data.current?.temp ?? 26;
    const humidity = data.current?.humidity ?? 0;
    const pop = data.hourly?.[0]?.pop ?? 0;
    const newTheme = humidity > 70 && pop > 50 ? 'theme-rain' : t <= 18 ? 'theme-cold' : t >= 34 ? 'theme-hot' : 'theme-mild';
    setTheme(newTheme);
  }, [data]);

  return (
    <div className={`app ${theme}`}>
      <div className="gradient" />
      <div className="parallax" aria-hidden>
        <div className="layer one" />
        <div className="layer two stars" />
      </div>
      <div className="main-content">
        <Header title={title} />
        <div className="controls">
          <button className={`toggle ${unit==='C'?'active':''}`} onClick={() => setUnit('C')}>°C</button>
          <button className={`toggle ${unit==='F'?'active':''}`} onClick={() => setUnit('F')}>°F</button>
        </div>
        <div className="search">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search city or town"
          />
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map(s => (
                <button key={s.id} onClick={() => onPick(s)}>
                  {s.name}{s.admin1 ? `, ${s.admin1}` : ''}, {s.country}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {error && <div className="card">Failed to load weather.</div>}
        
        <CurrentWeather data={data ? { ...data, current: { ...data.current, temp: toUnit(data.current?.temp), feelsLike: toUnit(data.current?.feelsLike) }, daily: data.daily?.map(d => ({...d, max: toUnit(d.max), min: toUnit(d.min)})) } : null} />
        
        <div className="stack">
          <HourlyCard data={data ? { ...data, hourly: data.hourly?.map(h => ({...h, temp: toUnit(h.temp)})) } : null} />
          
          {data && <WeatherDetailsGrid data={data} />}
          
          {data?.sun?.sunrise && data?.sun?.sunset && (
            <SunPath sunrise={data.sun.sunrise} sunset={data.sun.sunset} />
          )}
          
          {data && <DailyForecast data={data} />}
          
          <GeminiSummary 
            data={data} 
            onGenerateSummary={generateWeatherSummary}
            summary={geminiSummary}
            isLoading={isGeneratingSummary}
          />
          
          <RainCard />
          <AlertCard />
        </div>
        
        {loading && <div style={{marginTop:12, opacity:.8}}>Loading…</div>}
      </div>
    </div>
  );
}
