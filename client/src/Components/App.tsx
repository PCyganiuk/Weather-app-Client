import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './Navbar';
import Chart from './Chart';
import Features from './Features';
import Login from './Login';
import WeatherForecast from './WeatherForecast';

interface DataPoint {
  date: string;
  time: string;
  humidity: number;
  pressure: number;
  temperature: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedIsLoggedIn);
    setLoading(false);

    fetchInitialData();

    const interval = setInterval(fetchInitialData, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchInitialData = () => {
    fetch('http://127.0.0.1:5000/fetch-records')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  const lastPath = localStorage.getItem('lastPath') || '/home';

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <Navbar buttons={['Home', 'Weather Forecast']} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={isLoggedIn ? <Navigate to={lastPath} /> : <Navigate to="/login" />} />
          <Route path="/home" element={isLoggedIn ? <Chart data={data} /> : <Navigate to="/login" />} />
          <Route path="/weather-forecast" element={isLoggedIn ? <WeatherForecast data={data} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
