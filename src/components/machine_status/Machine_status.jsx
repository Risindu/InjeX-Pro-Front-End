import React, { useState, useEffect } from "react";
import "./Machine_status.scss";
import Machine from "../../assets/machine.jpg";
import { Calculate } from "@mui/icons-material";

const getOperationStateName = (stateNumber) => {
  const stateMap = {
    0: "Standby",
    1: "Mould Closing",
    2: "Injection Unit Alignment",
    3: "Material Injection",
    4: "Material Loading",
    5: "Cooling Phase",
    6: "Mould Opening",
    7: "Part Ejection"
  };
  return stateMap[stateNumber] || "Unknown State";
};

const getStateColor = (stateNumber) => {
  const colorMap = {
    0: "#6B7280", // Gray for Standby
    1: "#3B82F6", // Blue for Mould Closing
    2: "#10B981", // Green for Unit Alignment
    3: "#F59E0B", // Orange for Injection
    4: "#6366F1", // Indigo for Loading
    5: "#3B82F6", // Blue for Cooling
    6: "#EC4899", // Pink for Opening
    7: "#8B5CF6"  // Purple for Ejection
  };
  return colorMap[stateNumber] || "#6B7280";
};

const MachineStatus = ({ data }) => {
  const isMachineOn = data?.machine_status?.machine_on_off_state || false;
  const isMotorOn = data?.machine_status?.motor_on_off_state || false;
  const overallPowerConsumption = data?.power_monitoring?.overall_power_consumption || 0;
  const totalUptimeInSeconds = data?.production_data?.uptime || 0;
  const temperatureZones = data?.temperature_zones || {};
  const currentOperationState = data?.production_data?.operation_state_number || 0;
  const clampPosition = data?.position_sensors?.clamping_device_position || 0;
  const injectionScrewPosition = data?.position_sensors?.injection_position || 0;

  const [isOn, setIsOn] = useState(isMachineOn);

  const totalUptimeInHours = (totalUptimeInSeconds / 3600).toFixed(2);

  useEffect(() => {
    setIsOn(isMachineOn);
  }, [isMachineOn]);

  return (
    <div className="machine-status">
      <div className="machine-diagram">
        <div className="status-container">
          <div className="status-section">
            <div className="machine-toggle">
              <h3 className="machine-state" style={{ color: isOn ? "green" : "red" }}>
                Machine: {isOn ? "On" : "Off"}
              </h3>
              <label className="switch">
                <input type="checkbox" checked={isOn} readOnly />
                <span className="slider"></span>
              </label>
            </div>

            <div className="motor-status-indicator">
              <h3>Motor Status</h3>
              <div className="motor-indicator">
                <div className={`status-circle ${isMotorOn ? 'active' : ''}`}>
                  <div className="inner-circle"></div>
                  <div className="pulse-ring"></div>
                </div>
                <span className={`status-text ${isMotorOn ? 'running' : 'stopped'}`}>
                  {isMotorOn ? 'Running' : 'Stopped'}
                </span>
              </div>
            </div>
          </div>

          <div className="position-indicators">
            <div className="position-item">
              <span className="position-label">Clamp Position:</span>
              <span className="position-value">{clampPosition}mm</span>
            </div>
            <div className="position-item">
              <span className="position-label">Injection Position:</span>
              <span className="position-value">{injectionScrewPosition}mm</span>
            </div>
          </div>
        </div>

        <div className="machine-image">
          <img src={Machine} alt="Machine Diagram" />
          <svg className="animation-overlay" width="900" height="300">
            <rect
              x="280"
              y="135"
              width={-clampPosition*0.4+155}
              height="100"
              fill="#000000"
              className={`mold-left ${isOn ? "animate-mold-left" : ""}`}
            />
          </svg>
        </div>
      </div>

      <div className="temperature-zones">
        <h4>Total Power Consumption</h4>
        <ul className="zones">
          <li>
            <span className="zone-color" style={{ backgroundColor: "purple" }}></span>
            {overallPowerConsumption} kWh
          </li>
        </ul>

        <h4>Current Operation State</h4>
        <ul className="zones">
          <li>
            <span 
              className="zone-color" 
              style={{ backgroundColor: getStateColor(currentOperationState) }}
            ></span>
            <div className="operation-state">
              <span className="state-name">{getOperationStateName(currentOperationState)}</span>
              <span className="state-number">(State {currentOperationState})</span>
            </div>
          </li>
        </ul>

        <h4>Temperature Zones</h4>
        <ul className="zones">
          <li>
            <span className="zone-color" style={{ backgroundColor: "brown" }}></span>
            Zone 1: {temperatureZones.zone_1} °C
          </li>
          <li>
            <span className="zone-color" style={{ backgroundColor: "red" }}></span>
            Zone 2: {temperatureZones.zone_2} °C
          </li>
          <li>
            <span className="zone-color" style={{ backgroundColor: "orange" }}></span>
            Zone 3: {temperatureZones.zone_3} °C
          </li>
          <li>
            <span className="zone-color" style={{ backgroundColor: "yellow" }}></span>
            Zone 4: {temperatureZones.zone_4} °C
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MachineStatus;