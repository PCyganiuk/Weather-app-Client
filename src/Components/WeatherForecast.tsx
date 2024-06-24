import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import './WeatherForecast.css';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface DataPoint {
  date: string;
  time: string;
  humidity: number;
  pressure: number;
  temperature: number;
}

interface WeatherForecastProps {
  data: string[];
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  const forecastDays = 5; 
  const [forecasts, setForecasts] = useState<{ temperature: any[], humidity: any[], pressure: any[] } | null>(null);

  const parseData = (data: string[]): DataPoint[] => {
    return data.map(entry => {
      const parts = entry.replace(/"/g, '').split(';');
      return {
        date: parts[0],
        time: parts[1],
        humidity: parseFloat(parts[2]),
        pressure: parseFloat(parts[3]),
        temperature: parseFloat(parts[4])
      };
    });
  };

  const parsedData = parseData(data);

  const generateRandomForecast = (data: DataPoint[], field: keyof DataPoint) => {
    if (data.length === 0) return [];

    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const latestData = data[data.length - 1][field] as number;
    let currentValue = latestData;
    const forecasts = [{ label: 'Latest', y: currentValue }];

    for (let i = 1; i <= forecastDays; i++) {
      const changePercent = 0.05 + Math.random() * 0.25;
      const changeDirection = Math.random() < 0.5 ? -1 : 1;
      const changeAmount = currentValue * changePercent * changeDirection;
      currentValue += changeAmount;

      forecasts.push({
        label: `Day ${i}`,
        y: parseFloat(currentValue.toFixed(2))
      });
    }

    return forecasts;
  };

  const chartOptions = (field: keyof DataPoint, forecasts: { label: string, y: number }[]) => ({
    animationEnabled: true,
    title: {
      text: `${field} Forecast for the Next ${forecastDays} Days`
    },
    axisX: {
      title: "Day"
    },
    axisY: {
      title: String(field),
      includeZero: false
    },
    data: [
      {
        type: "spline",
        name: String(field),
        showInLegend: true,
        dataPoints: forecasts
      }
    ]
  });

  useEffect(() => {
    const storedForecasts = localStorage.getItem('weatherForecasts');
    const lastUpdated = localStorage.getItem('forecastLastUpdated');

    if (storedForecasts && lastUpdated) {
      const now = new Date().getTime();
      const lastUpdatedTime = parseInt(lastUpdated, 10);
      
      if ((now - lastUpdatedTime) < 86400000) {
        setForecasts(JSON.parse(storedForecasts));
        return;
      }
    }

    const newForecasts = {
      temperature: generateRandomForecast(parsedData, 'temperature'),
      humidity: generateRandomForecast(parsedData, 'humidity'),
      pressure: generateRandomForecast(parsedData, 'pressure')
    };

    localStorage.setItem('weatherForecasts', JSON.stringify(newForecasts));
    localStorage.setItem('forecastLastUpdated', new Date().getTime().toString());
    setForecasts(newForecasts);
  }, [data]);

  if (!forecasts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card weather-forecast">
        <h5 className="card-header">5-Day Weather Forecast</h5>
        <div className="card-body">
          <CanvasJSChart options={chartOptions('temperature', forecasts.temperature)} />
          <CanvasJSChart options={chartOptions('humidity', forecasts.humidity)} />
          <CanvasJSChart options={chartOptions('pressure', forecasts.pressure)} />
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
