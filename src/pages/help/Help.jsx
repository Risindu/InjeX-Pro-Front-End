import React, { useState } from 'react';
import './Help.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { Book, ChartBar, AlertTriangle, Settings, FileText, Activity, HelpCircle, Wrench, Thermometer, Zap } from 'lucide-react';

const Help = () => {
  const [activeTab, setActiveTab] = useState('getting-started');

  const renderContent = () => {
    switch(activeTab) {
      case 'getting-started':
        return (
          <div className="helpSection">
            <h3>Getting Started</h3>
            <p>
              InjeX Pro is an advanced monitoring system designed for injection molding machines. It provides real-time monitoring,
              analytics, and predictive maintenance capabilities to optimize your manufacturing process.
            </p>
            <h4>Key Features:</h4>
            <ul>
              <li>Real-time machine state monitoring</li>
              <li>Temperature zone analysis</li>
              <li>Power consumption tracking</li>
              <li>Production efficiency metrics</li>
              <li>Predictive maintenance alerts</li>
            </ul>
          </div>
        );

      case 'dashboard':
        return (
          <div className="helpSection">
            <h3>Dashboard Overview</h3>
            <p>The dashboard provides at-a-glance information about your machine's performance.</p>
            <h4>Key Indicators:</h4>
            <ul>
              <li>Production Counter: Shows current production count and target</li>
              <li>Machine Status: Indicates current operational state</li>
              <li>Temperature Zones: Displays all temperature zone readings</li>
              <li>Power Monitoring: Shows current power consumption</li>
            </ul>
            <p className="note">
              🔔 The dashboard updates automatically every 500ms to provide real-time information.
            </p>
          </div>
        );

      case 'analytics':
        return (
          <div className="helpSection">
            <h3>Analytics & Reports</h3>
            <h4>Temperature Analysis:</h4>
            <ul>
              <li>Zone Temperature Trends</li>
              <li>Mold Temperature Differentials</li>
              <li>Heat Exchange Efficiency</li>
            </ul>
            <h4>Power Analysis:</h4>
            <ul>
              <li>Overall Consumption Patterns</li>
              <li>Phase Balance Monitoring</li>
              <li>Peak vs. Off-peak Usage</li>
            </ul>
            <h4>Production Metrics:</h4>
            <ul>
              <li>Hourly Production Rates</li>
              <li>Efficiency Calculations</li>
              <li>Uptime Analysis</li>
            </ul>
          </div>
        );

      case 'alerts':
        return (
          <div className="helpSection">
            <h3>Understanding Alerts</h3>
            <div className="alertTypes">
              <div className="alertItem">
                <h4>Temperature Alerts</h4>
                <ul>
                  <li>Zone Temperature Deviations</li>
                  <li>Oil Temperature Warnings</li>
                  <li>Mold Temperature Issues</li>
                </ul>
              </div>
              <div className="alertItem">
                <h4>Position Alerts</h4>
                <ul>
                  <li>Clamp Position Warnings</li>
                  <li>Injection Position Alerts</li>
                </ul>
              </div>
              <div className="alertItem">
                <h4>Production Alerts</h4>
                <ul>
                  <li>Target Achievement Notifications</li>
                  <li>Cycle Time Deviations</li>
                  <li>Machine State Changes</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="helpSection">
            <h3>Maintenance Guide</h3>
            <p>The system provides predictive maintenance recommendations based on:</p>
            <ul>
              <li>Temperature stability patterns</li>
              <li>Power consumption anomalies</li>
              <li>Position sensor readings</li>
              <li>Production efficiency trends</li>
            </ul>
            <div className="maintenanceTips">
              <h4>Regular Checks:</h4>
              <ul>
                <li>Monitor temperature zone stability</li>
                <li>Check hydraulic pressure readings</li>
                <li>Verify position sensor calibration</li>
                <li>Review power consumption patterns</li>
              </ul>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="helpSection">
            <h3>Troubleshooting Guide</h3>
            <div className="troubleshootingItems">
              <div className="item">
                <h4>Connection Issues</h4>
                <ul>
                  <li>Verify network connectivity</li>
                  <li>Check sensor connections</li>
                  <li>Ensure proper power supply</li>
                </ul>
              </div>
              <div className="item">
                <h4>Data Accuracy</h4>
                <ul>
                  <li>Calibrate sensors regularly</li>
                  <li>Verify threshold settings</li>
                  <li>Check for sensor interference</li>
                </ul>
              </div>
            </div>
            <p className="note">
              For technical support, contact: support@injexpro.com
            </p>
          </div>
        );
    }
  };

  return (
    <div className="help">
      <Sidebar />
      <div className="helpContainer">
        <Navbar />
        <div className="helpContent">
          <h2>Help Center</h2>

          <div className="helpNavigation">
            <div 
              className={`navItem ${activeTab === 'getting-started' ? 'active' : ''}`}
              onClick={() => setActiveTab('getting-started')}
            >
              <Book size={20} />
              <span>Getting Started</span>
            </div>
            <div 
              className={`navItem ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Activity size={20} />
              <span>Dashboard Guide</span>
            </div>
            <div 
              className={`navItem ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <ChartBar size={20} />
              <span>Analytics & Reports</span>
            </div>
            <div 
              className={`navItem ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              <AlertTriangle size={20} />
              <span>Alerts Guide</span>
            </div>
            <div 
              className={`navItem ${activeTab === 'maintenance' ? 'active' : ''}`}
              onClick={() => setActiveTab('maintenance')}
            >
              <Wrench size={20} />
              <span>Maintenance</span>
            </div>
            <div 
              className={`navItem ${activeTab === 'troubleshooting' ? 'active' : ''}`}
              onClick={() => setActiveTab('troubleshooting')}
            >
              <HelpCircle size={20} />
              <span>Troubleshooting</span>
            </div>
          </div>

          <div className="contentArea">
            {renderContent()}
          </div>

          <div className="supportInfo">
            <h3>Need Additional Help?</h3>
            <p>Our support team is available 24/7 to assist you:</p>
            <ul>
              <li>Email: support@injexpro.com</li>
              <li>Phone: +94 77 123 4567</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;