import './Settings.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { useState, useEffect } from 'react';
import { Thermometer, Droplet, Gauge, Box, Edit3, X, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    thresholdLevels: {
      ambient_temperature: {
        min: '',
        max: ''
      },
      machine_heat_exchange: {
        inlet_temperature: { min: '', max: '' },
        outlet_temperature: { min: '', max: '' },
        delta_t: { min: '', max: '' }
      },
      machine_oil_temperature: {
        min: '',
        max: ''
      },
      mold_temperature: {
        inlet_temperature: { min: '', max: '' },
        outlet_temperature: { min: '', max: '' },
        delta_t: { min: '', max: '' }
      },
      temperature_zones: {
        zone_1: { min: '', max: '' },
        zone_2: { min: '', max: '' },
        zone_3: { min: '', max: '' },
        zone_4: { min: '', max: '' }
      },
      position_sensors: {
        clamping_device_position: { min: '', max: '' },
        injection_position: { min: '', max: '' }
      },
      production_data: {
        production_count_target: '',
        uptime_target: ''
      },
      power_monitoring: {
        individual_phase_current: { phase_1: '', phase_2: '', phase_3: '' },
        overall_power_consumption: ''
      }
    },
    costTable: [
      { start_time: '00:00', end_time: '06:00', rate_per_unit: '' },
      { start_time: '06:00', end_time: '18:00', rate_per_unit: '' },
      { start_time: '18:00', end_time: '22:00', rate_per_unit: '' },
      { start_time: '22:00', end_time: '00:00', rate_per_unit: '' },
    ],
  });
  const [isEditable, setIsEditable] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ show: false, success: true, message: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://157.245.105.131:5000/settings');
      const { thresholds, costTable } = response.data;
      const formattedCostTable = Array.isArray(costTable) ? costTable : Object.values(costTable);
      setSettings(prev => ({
        ...prev,
        thresholdLevels: thresholds,
        costTable: formattedCostTable,
      }));
    } catch (error) {
      setSaveStatus({
        show: true,
        success: false,
        message: 'Failed to fetch settings. Please try again.'
      });
    }
  };

  const handleInputChange = (section, key, value) => {
    if (!isEditable) return;
    setSettings(prev => ({
      ...prev,
      thresholdLevels: {
        ...prev.thresholdLevels,
        [section]: typeof prev.thresholdLevels[section] === 'object' ?
          { ...prev.thresholdLevels[section], [key]: value } :
          value
      }
    }));
  };

  const handleTemperatureRangeChange = (section, zone, type, value) => {
    if (!isEditable) return;
    setSettings(prev => ({
      ...prev,
      thresholdLevels: {
        ...prev.thresholdLevels,
        [section]: {
          ...prev.thresholdLevels[section],
          [zone]: {
            ...prev.thresholdLevels[section][zone],
            [type]: value
          }
        }
      }
    }));
  };

  const handleCostTableChange = (index, key, value) => {
    if (!isEditable) return;
    setSettings(prev => ({
      ...prev,
      costTable: prev.costTable.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    }));
  };

  const saveSettings = async () => {
    try {
      await axios.post('http://localhost:5000/settings/save', {
        thresholds: settings.thresholdLevels,
        costTable: settings.costTable,
      });
      setSaveStatus({
        show: true,
        success: true,
        message: 'Settings saved successfully!'
      });
      setIsEditable(false);
    } catch (error) {
      setSaveStatus({
        show: true,
        success: false,
        message: 'Error saving settings. Please try again.'
      });
    }
  };

  return (
    <div className="settings">
      <Sidebar />
      <div className="settingsContainer">
        <Navbar />
        <div className="settingsContent">
          <div className="settingsHeader">
            <div className="headerTitle">
              <h1>Machine Settings</h1>
            </div>
            <button 
              className={`editButton ${isEditable ? 'editing' : ''}`}
              onClick={() => setIsEditable(!isEditable)}
            >
              {isEditable ? (
                <><X size={16} /><span>Cancel</span></>
              ) : (
                <><Edit3 size={16} /><span>Edit</span></>
              )}
            </button>
          </div>

          {saveStatus.show && (
            <div className={`alert ${saveStatus.success ? 'success' : 'error'}`}>
              <AlertCircle size={16} />
              <span>{saveStatus.message}</span>
            </div>
          )}

          <div className="settingsBody">
            {/* Ambient Temperature */}
            <div className="settingsSection temperature">
              <div className="sectionHeader">
                <Thermometer size={20} />
                <h2>Ambient Temperature</h2>
              </div>
              <div className="rangeInputs">
                <div className="inputWrapper">
                  <label>Minimum (°C)</label>
                  <input
                    type="number"
                    value={settings.thresholdLevels.ambient_temperature.min}
                    onChange={(e) => handleTemperatureRangeChange('ambient_temperature', '', 'min', e.target.value)}
                    disabled={!isEditable}
                  />
                </div>
                <div className="inputWrapper">
                  <label>Maximum (°C)</label>
                  <input
                    type="number"
                    value={settings.thresholdLevels.ambient_temperature.max}
                    onChange={(e) => handleTemperatureRangeChange('ambient_temperature', '', 'max', e.target.value)}
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>

              {/* Machine Oil Temperature */}
              <div className="settingsSection temperature">
              <div className="sectionHeader">
                <Thermometer size={20} />
                <h2>Machine Oil Temperature</h2>
              </div>
              <div className="rangeInputs">
                <div className="inputWrapper">
                  <label>Minimum (°C)</label>
                  <input
                    type="number"
                    value={settings.thresholdLevels.machine_oil_temperature.min}
                    onChange={(e) => handleTemperatureRangeChange('machine_oil_temperature', '', 'min', e.target.value)}
                    disabled={!isEditable}
                  />
                </div>
                <div className="inputWrapper">
                  <label>Maximum (°C)</label>
                  <input
                    type="number"
                    value={settings.thresholdLevels.machine_oil_temperature.max}
                    onChange={(e) => handleTemperatureRangeChange('machine_oil_temperature', '', 'max', e.target.value)}
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>

            {/* Temperature Zones */}
            <div className="settingsSection temperature">
              <div className="sectionHeader">
                <Thermometer size={20} />
                <h2>Temperature Zones</h2>
              </div>
              <div className="zoneGrid">
                {[1, 2, 3, 4].map(zone => (
                  <div key={zone} className="zoneRangeInputs">
                    <h3>Zone {zone}</h3>
                    <div className="inputWrapper">
                      <label>Min (°C)</label>
                      <input
                        type="number"
                        value={settings.thresholdLevels.temperature_zones[`zone_${zone}`].min}
                        onChange={(e) => handleTemperatureRangeChange('temperature_zones', `zone_${zone}`, 'min', e.target.value)}
                        disabled={!isEditable}
                      />
                    </div>
                    <div className="inputWrapper">
                      <label>Max (°C)</label>
                      <input
                        type="number"
                        value={settings.thresholdLevels.temperature_zones[`zone_${zone}`].max}
                        onChange={(e) => handleTemperatureRangeChange('temperature_zones', `zone_${zone}`, 'max', e.target.value)}
                        disabled={!isEditable}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heat Exchange Settings */}
            <div className="settingsSection heat-exchange">
              <div className="sectionHeader">
                <Droplet size={20} />
                <h2>Heat Exchange Settings</h2>
              </div>
              {['machine_heat_exchange', 'mold_temperature'].map((type) => (
                <div key={type} className="exchangeSection">
                  <h3>{type === 'machine_heat_exchange' ? 'Machine' : 'Mold'} Heat Exchange</h3>
                  <div className="temperatureInputs">
                    <div className="inputGroup">
                      <h4>Inlet Temperature</h4>
                      <div className="rangeInputs">
                        <div className="inputWrapper">
                          <label>Min (°C)</label>
                          <input
                            type="number"
                            value={settings.thresholdLevels[type].inlet_temperature.min}
                            onChange={(e) => handleTemperatureRangeChange(type, 'inlet_temperature', 'min', e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                        <div className="inputWrapper">
                          <label>Max (°C)</label>
                          <input
                            type="number"
                            value={settings.thresholdLevels[type].inlet_temperature.max}
                            onChange={(e) => handleTemperatureRangeChange(type, 'inlet_temperature', 'max', e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="inputGroup">
                      <h4>Outlet Temperature</h4>
                      <div className="rangeInputs">
                        <div className="inputWrapper">
                          <label>Min (°C)</label>
                          <input
                            type="number"
                            value={settings.thresholdLevels[type].outlet_temperature.min}
                            onChange={(e) => handleTemperatureRangeChange(type, 'outlet_temperature', 'min', e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                        <div className="inputWrapper">
                          <label>Max (°C)</label>
                          <input
                            type="number"
                            value={settings.thresholdLevels[type].outlet_temperature.max}
                            onChange={(e) => handleTemperatureRangeChange(type, 'outlet_temperature', 'max', e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="inputGroup">
                      <h4>Temperature Difference (ΔT)</h4>
                      <div className="rangeInputs">
                        <div className="inputWrapper">
                          <label>Min (°C)</label>
                          <input
                            type="number"
                            value={settings.thresholdLevels[type].delta_t.min}
                            onChange={(e) => handleTemperatureRangeChange(type, 'delta_t', 'min', e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                        <div className="inputWrapper">
                          <label>Max (°C)</label>
                          <input
                            type="number"
                            value={settings.thresholdLevels[type].delta_t.max}
                            onChange={(e) => handleTemperatureRangeChange(type, 'delta_t', 'max', e.target.value)}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Position Sensors */}
            <div className="settingsSection position">
              <div className="sectionHeader">
                <Gauge size={20} />
                <h2>Position Sensors</h2>
              </div>
              <div className="positionInputs">
                {['clamping_device_position', 'injection_position'].map((position) => (
                  <div key={position} className="positionGroup">
                    <h3>{position.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h3>
                    <div className="rangeInputs">
                      <div className="inputWrapper">
                        <label>Min</label>
                        <input
                          type="number"
                          value={settings.thresholdLevels.position_sensors[position].min}
                          onChange={(e) => handleTemperatureRangeChange('position_sensors', position, 'min', e.target.value)}
                          disabled={!isEditable}
                        />
                      </div>
                      <div className="inputWrapper">
                        <label>Max</label>
                        <input
                          type="number"
                          value={settings.thresholdLevels.position_sensors[position].max}
                          onChange={(e) => handleTemperatureRangeChange('position_sensors', position, 'max', e.target.value)}
                          disabled={!isEditable}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Targets */}
            <div className="settingsSection production">
              <div className="sectionHeader">
                <Box size={20} />
                <h2>Production Targets</h2>
              </div>
              <div className="productionInputs">
                <div className="inputWrapper">
                  <label>Production Count Target</label>
                  <input
                    type="number"
                    value={settings.thresholdLevels.production_data.production_count_target}
                    onChange={(e) => handleInputChange('production_data', 'production_count_target', e.target.value)}
                    disabled={!isEditable}
                  />
                </div>
                <div className="inputWrapper">
                  <label>Uptime Target (hours)</label>
                  <input
                    type="number"
                    value={settings.thresholdLevels.production_data.uptime_target}
                    onChange={(e) => handleInputChange('production_data', 'uptime_target', e.target.value)}
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>

            {/* Cost Table */}
            <div className="settingsSection cost">
              <h2>Cost Table</h2>
              <div className="costTable">
                {settings.costTable.map((entry, index) => (
                  <div key={index} className="timeSlot">
                    <input
                      type="time"
                      value={entry.start_time}
                      onChange={(e) => handleCostTableChange(index, 'start_time', e.target.value)}
                      disabled={!isEditable}
                    />
                    <input type="time"
                      value={entry.end_time}
                      onChange={(e) => handleCostTableChange(index, 'end_time', e.target.value)}
                      disabled={!isEditable}
                    />
                    <div className="inputWrapper">
                      <input
                        type="number"
                        step="0.01"
                        value={entry.rate_per_unit}
                        onChange={(e) => handleCostTableChange(index, 'rate_per_unit', e.target.value)}
                        disabled={!isEditable}
                        placeholder="Rate"
                      />
                      <span className="inputUnit">LKR/kWh</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {isEditable && (
              <button className="saveButton" onClick={saveSettings}>
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;