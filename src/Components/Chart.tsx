import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import './Chart.css';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface DataPoint {
  date: string;
  time: string;
  humidity: number;
  pressure: number;
  temperature: number;
}

interface ChartProps {
  data: string[];
}

interface TooltipEntry {
  dataPoint: {
    x: Date;
    y: number;
  };
}

interface TooltipEvent {
  entries: TooltipEntry[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  console.log("Data passed to Chart:", data);

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

  const calculateAxisLimits = (data: DataPoint[], type: keyof DataPoint): { min: number; max: number } => {
    const values = data.map(entry => entry[type] as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.05;
    return { min: min - padding, max: max + padding };
  };

  const getChartOptions = (type: keyof DataPoint, filteredData: DataPoint[]) => {
    const { min, max } = calculateAxisLimits(filteredData, type);
    return {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2",
      title: {
        text: `${type} Data`
      },
      toolTip: {
        shared: true,
        contentFormatter: function (e: TooltipEvent): string {
          let content = "";
          e.entries.forEach((entry) => {
            const date = entry.dataPoint.x;
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            content += `${type}: ${entry.dataPoint.y}<br/>Date: ${dateStr}<br/>Time: ${timeStr}<br/>`;
          });
          return content;
        }
      },
      axisY: {
        title: String(type),
        includeZero: false,
        minimum: min,
        maximum: max,
        labelFontSize: 14,
      },
      axisX: {
        title: "Time",
        valueFormatString: "DD MMM YYYY",
        labelAngle: 0,
        labelFontSize: 12,
      },
      data: [
        {
          type: "spline",
          name: String(type),
          showInLegend: true,
          dataPoints: filteredData.map((entry: DataPoint) => ({
            x: new Date(`${entry.date}T${entry.time}`),
            y: entry[type] as number,
          }))
        }
      ]
    };
  };

  const referenceDate = new Date();
  const thirtyDaysAgo = new Date(referenceDate);
  thirtyDaysAgo.setDate(referenceDate.getDate() - 30);

  const last30DaysData = parsedData.filter(entry => {
    const entryDate = new Date(`${entry.date}T${entry.time}`);
    return entryDate >= thirtyDaysAgo;
  });

  console.log("Filtered data for the last 30 days:", last30DaysData);

  if (!last30DaysData.length) {
    return <p>No data available for the last 30 days.</p>;
  }

  return (
    <div className="chart-container">
      <div className="top-chart">
        <CanvasJSChart options={getChartOptions('temperature', last30DaysData)} />
      </div>
      <div className="bottom-charts">
        <div className="chart half-width">
          <CanvasJSChart options={getChartOptions('humidity', last30DaysData)} />
        </div>
        <div className="chart half-width">
          <CanvasJSChart options={getChartOptions('pressure', last30DaysData)} />
        </div>
      </div>
    </div>
  );
};

export default Chart;
