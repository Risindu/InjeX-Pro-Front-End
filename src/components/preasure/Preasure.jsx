import React from 'react';
import './Preasure.scss';
import { Gauge, Activity } from 'lucide-react';

const MonitoringCard = ({ title, data, icon: Icon }) => (
  <div className="monitoring-card">
    <div className="card-header">
      <h2 className="card-title">
        {title}
        <Icon className="header-icon" size={24} />
      </h2>
    </div>
    <div className="card-content">
      {data.map((item, index) => (
        <div key={index} className="monitoring-item">
          <span className="item-label">{item.label}</span>
          <span 
            className="item-value"
            style={{ backgroundColor: item.color }}
          >
            {item.value}
            {item.unit}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const Pressure = ({ data }) => {
  const flowPressureData = [
    {
      label: "Hydraulic Flow",
      value: data?.flow_pressure_sensors?.hydraulic_flow || 0,
      unit: " %",
      color: 'rgba(150, 209, 227, 0.30)'
    },
    {
      label: "Hydraulic Pressure",
      value: data?.flow_pressure_sensors?.hydraulic_pressure || 0,
      unit: " %",
      color: 'rgba(101, 190, 98, 0.364)'
    }
  ];

  const powerData = [
    {
      label: "L1",
      value: data?.power_monitoring?.individual_phase_current?.phase_1 || 0,
      unit: " A",
      color: 'rgba(150, 209, 227, 0.30)'
    },
    {
      label: "L2",
      value: data?.power_monitoring?.individual_phase_current?.phase_2 || 0,
      unit: " A",
      color: 'rgba(101, 190, 98, 0.364)'
    },
    {
      label: "L3",
      value: data?.power_monitoring?.individual_phase_current?.phase_3 || 0,
      unit: " A",
      color: 'rgba(228, 60, 60, 0.364)'
    }
  ];

  return (
    <div className="monitoring-dashboard">
      <MonitoringCard 
        title="Flow & Pressure" 
        data={flowPressureData} 
        icon={Gauge}
      />
      <MonitoringCard 
        title="Power Monitoring" 
        data={powerData} 
        icon={Activity}
      />
    </div>
  );
};

export default Pressure;