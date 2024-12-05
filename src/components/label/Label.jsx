import './Label.scss';

const Label = ({ data }) => {
  // Extract RPM values from the data object
  const injectionScrewRpm = data?.rpm_sensors?.injection_screw_rpm || 0;
  const mainMotorRpm = data?.rpm_sensors?.main_motor_rpm || 0;

  // Extract position values from the data object
  const clampPosition = data?.position_sensors?.clamping_device_position || 0;
  const screwPosition = data?.position_sensors?.injection_position || 0;
  const ejectorPosition = data?.position_sensors?.ejector_position || 0;

  return (
    <div className='label'>
      {/* <div className="labelContainer">
        <h1 className="rpm">
          RPM 
        </h1>
        <ul className="list">
          <li>
            Injection Screw
            <span className="list-color1" style={{ backgroundColor: 'rgba(150, 209, 227, 0.30)' }}>
              {injectionScrewRpm}
            </span>
          </li>
          <li>
            Main Motor
            <span className="list-color2" style={{ backgroundColor: 'rgba(101, 190, 98, 0.364)' }}>
              {mainMotorRpm}
            </span>
          </li>
        </ul>
      </div> */}

      <div className="labelContainer1">
        <h1 className="position">
          Position 
        </h1>
        <ul className="list">
          <li>
            Clamp
            <span className="list-color1" style={{ backgroundColor: 'rgba(150, 209, 227, 0.30)' }}>
              {clampPosition}
            </span>
          </li>
          <li>
            Screw
            <span className="list-color2" style={{ backgroundColor: 'rgba(101, 190, 98, 0.364)' }}>
              {screwPosition}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Label;
