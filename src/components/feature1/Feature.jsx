import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import "./Feature.scss";

const TemperatureSection = ({ title, temperatures }) => (
  <div className="temperature-section">
    <div className="section-header">
      <h2 className="section-title">
        {title} 
        <DeviceThermostatIcon className="temp-icon" />
      </h2>
    </div>
    <div className="temperature-display">
      <div className="progress-bars">
        {temperatures.map((temp, index) => (
          <div key={index} className="progress-item">
            <CircularProgressbar
              className={`temp-gauge ${temp.className}`}
              value={temp.value}
              text={`${temp.value}°C`}
              strokeWidth={5}
            />
            <span className="temp-label">{temp.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Featured = ({ data }) => {
  const machineTemps = [
    { value: data?.machine_heat_exchange?.inlet_temperature || 0, label: "Inlet", className: "inlet-temp" },
    { value: data?.machine_heat_exchange?.outlet_temperature || 0, label: "Outlet", className: "outlet-temp" },
    { value: data?.machine_oil_temperature || 0, label: "Oil", className: "oil-temp" }
  ];

  const mouldTemps = [
    { value: data?.mold_temperature?.inlet_temperature || 0, label: "Inlet", className: "inlet-temp" },
    { value: data?.mold_temperature?.outlet_temperature || 0, label: "Outlet", className: "outlet-temp" }
  ];

  const ambientTemp = [
    { value: data?.ambient_temperature || 0, label: "Ambient", className: "ambient-temp" }
  ];

  return (
    <div className="temperature-dashboard">
      <div className="main-section">
        <TemperatureSection title="Machine Temperature" temperatures={machineTemps} />
      </div>
      <div className="secondary-sections">
        <TemperatureSection title="Mould Temperature" temperatures={mouldTemps} />
        <TemperatureSection title="Ambient Temperature" temperatures={ambientTemp} />
      </div>
    </div>
  );
};

export default Featured;