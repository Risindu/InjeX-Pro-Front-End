import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Ticket, 
  DollarSign, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import "./Widgets.scss";

const WidgetIcon = ({ type }) => {
  const iconProps = {
    size: 24,
    className: "widget-icon"
  };

  switch (type) {
    case "unit":
      return <Ticket {...iconProps} style={{ color: "crimson" }} />;
    case "cost":
      return <DollarSign {...iconProps} style={{ color: "green" }} />;
    case "time":
      return <Clock {...iconProps} style={{ color: "purple" }} />;
    default:
      return null;
  }
};

const PercentageIndicator = ({ value }) => (
  <div className={`percentage ${value >= 0 ? "positive" : "negative"}`}>
    {value >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
    <span>{Math.abs(value)}%</span>
  </div>
);

const Widgets = ({ type }) => {
  const [costTable, setCostTable] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [costResponse, dashboardResponse] = await Promise.all([
          axios.get("http://157.245.105.131:5000//api/cost_table"),
          axios.get("http://157.245.105.131:5000//dashboard/data")
        ]);
        
        setCostTable(costResponse.data);
        setDashboardData(dashboardResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for dashboard data
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get("http://157.245.105.131:5000/dashboard/data");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }, 1000); // Poll every second

    return () => clearInterval(intervalId);
  }, []);

  const getTimeInMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getCurrentRate = (currentTimeInMinutes) => {
    // Handle the 22:00-00:00 case first
    if (currentTimeInMinutes >= getTimeInMinutes("22:00") || 
        currentTimeInMinutes < getTimeInMinutes("00:00")) {
      return costTable.find(entry => entry.start_time === "22:00");
    }

    // Handle other time slots
    return costTable.find(entry => {
      const startMinutes = getTimeInMinutes(entry.start_time);
      const endMinutes = getTimeInMinutes(entry.end_time);
      return currentTimeInMinutes >= startMinutes && currentTimeInMinutes < endMinutes;
    });
  };

  const calculateTotalCost = () => {
    if (!costTable || !dashboardData) {
      return 0;
    }

    const powerConsumption = dashboardData.power_monitoring.overall_power_consumption;
    if (!powerConsumption) {
      return 0;
    }

    const currentTime = new Date(dashboardData.timestamp);
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    const currentRate = getCurrentRate(currentTimeInMinutes);
    
    if (!currentRate) {
      console.error("No applicable rate found for the current time");
      return 0;
    }

    return powerConsumption * currentRate.rate_per_unit;
  };

  const formatUptime = (uptimeInSeconds) => {
    const hours = Math.floor(uptimeInSeconds / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = uptimeInSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getWidgetData = () => {
    if (!dashboardData) return { title: "Unknown", value: 0, percentage: 0 };

    const units = dashboardData.production_data.production_count || 0;
    const uptime = dashboardData.production_data.uptime || 0;
    const totalCost = calculateTotalCost();
    const powerConsumption = dashboardData.power_monitoring.overall_power_consumption;

    // Use off-peak rate (00:00-06:00) as base rate for percentage calculation
    const baseRate = costTable?.find(entry => entry.start_time === "00:00")?.rate_per_unit || 0;
    const baseCost = powerConsumption * baseRate;
    
    const widgetTypes = {
      unit: {
        title: "Number of Units",
        value: units.toFixed(2),
        percentage: Math.min((units / 1000) * 100, 100).toFixed(2)
      },
      cost: {
        title: "Total Power Cost",
        value: loading ? "Loading..." : `LKR ${totalCost.toFixed(2)}`,
        percentage: loading ? 0 : ((totalCost - baseCost) / baseCost * 100).toFixed(2)
      },
      time: {
        title: "Up Time",
        value: formatUptime(uptime),
        percentage: Math.min((uptime / 1000) * 100, 100).toFixed(2)
      }
    };

    return widgetTypes[type] || { title: "Unknown", value: 0, percentage: 0 };
  };

  const widgetData = getWidgetData();

  return (
    <div className="widget">
      <div className="widget-content">
        <div className="widget-header">
          <WidgetIcon type={type} />
          <h3 className="widget-title">{widgetData.title}</h3>
        </div>
        <div className="widget-body">
          <span className="widget-value">{widgetData.value}</span>
          <PercentageIndicator value={widgetData.percentage} />
        </div>
      </div>
    </div>
  );
};

export default Widgets;