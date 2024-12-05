import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Zap, Timer, Activity, Gauge } from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import './Analytics.scss';

const Analytics = () => {
  const [tempAnalysis, setTempAnalysis] = useState([]);
  const [powerTrends, setPowerTrends] = useState([]);
  const [productionEfficiency, setProductionEfficiency] = useState({ trends: [], summary: {} });
  const [machineState, setMachineState] = useState('Normal');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tempResponse, powerResponse, productionResponse, machineResponse] = await Promise.all([
        axios.get('http://157.245.105.131:5000//api/analytics/temperature-analysis'),
        axios.get('http://157.245.105.131:5000//api/analytics/power-trends'),
        axios.get('http://157.245.105.131:5000//api/analytics/production-efficiency'),
        axios.get('http://localhost:3001/predictions')
      ]);

      setTempAnalysis(tempResponse.data);
      setPowerTrends(powerResponse.data);
      setProductionEfficiency(productionResponse.data);
      setMachineState(machineResponse.data.machineState);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="analytics">
        <Sidebar />
        <div className="analyticsContainer">
          <Navbar />
          <div className="loadingContainer">
            <ClipLoader color="#007bff" size={50} />
            <p>Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <Sidebar />
      <div className="analyticsContainer">
        <Navbar />
        <div className="analyticsContent">
          <div className="headerSection">
            <h2>Analytics & Performance</h2>
            <div className="updateTime">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="metricsGrid">
            <div className="metricCard">
              <div className="cardIcon">
                <Timer />
              </div>
              <div className="cardContent">
                <h3>Production Rate</h3>
                <p>{(productionEfficiency.summary.total_production/productionEfficiency.summary.total_uptime*3600 || 0).toFixed(2)} units/hr</p>
              </div>
            </div>
            <div className="metricCard">
              <div className="cardIcon">
                <Activity />
              </div>
              <div className="cardContent">
                <h3>Total Production</h3>
                <p>{productionEfficiency.summary.total_production || 0} units</p>
              </div>
            </div>
            <div className="metricCard">
              <div className="cardIcon">
                <Gauge />
              </div>
              <div className="cardContent">
                <h3>Runtime</h3>
                <p>{productionEfficiency.summary.total_uptime/3600 || 0} hours</p>
              </div>
            </div>
          </div>

          {/* Temperature Analysis Chart */}
          <div className="chartSection">
            <h3>Temperature Trends</h3>
            <div className="chartContainer">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tempAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(ts) => new Date(ts).toLocaleString()}
                    formatter={(value) => [`${value.toFixed(2)}°C`]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="zone_avg" 
                    name="Average Zone Temp" 
                    stroke="#8884d8" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mold_delta" 
                    name="Mold ΔT" 
                    stroke="#82ca9d" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="machine_delta" 
                    name="Machine ΔT" 
                    stroke="#ffc658" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Power Analysis Chart */}
          <div className="chartSection">
            <h3>Power Consumption</h3>
            <div className="chartContainer">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={powerTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(ts) => new Date(ts).toLocaleString()}
                    formatter={(value) => [`${value.toFixed(2)} kW`]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="overall_consumption" 
                    name="Power Consumption" 
                    stroke="#ff7300" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="phase_balance" 
                    name="Phase Balance" 
                    stroke="#00bcd4" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Production Efficiency Chart */}
          <div className="chartSection">
            <h3>Production Performance</h3>
            <div className="chartContainer">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productionEfficiency.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(ts) => new Date(ts).toLocaleString()}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="production_count" 
                    name="Production Count" 
                    stroke="#2196f3" 
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uptime" 
                    name="Uptime (seconds)" 
                    stroke="#4caf50" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Machine State Predictor */}
          <div className="chartSection">
            <h3>Machine State Prediction</h3>
            <div className={`machineState ${machineState.toLowerCase()}`}>
              <Activity />
              <span>{machineState}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;