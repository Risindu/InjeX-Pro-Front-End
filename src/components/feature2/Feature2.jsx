import "./Feature2.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

const Feature2 = ({ data }) => {
  // Extract temperature values from the data object
  const mouldInletTemp = data?.mold_temperature?.inlet_temperature || 0;
  const mouldOutletTemp = data?.mold_temperature?.outlet_temperature || 0;
  const ambientTemp = data?.ambient_temperature || 0;

  return (
    <div className="feature3">
      <div className="featureContainer1">
        <div className="top2">
          <h1 className="title2">
            Mould Temperature <DeviceThermostatIcon style={{ fontSize: "30px", marginLeft: "5px", marginTop: "5px" }} />
          </h1>
        </div>
        <div className="bottom2">
          <div className="featuredChart2">
            <CircularProgressbar className="inject_temp2" value={mouldInletTemp} text={`${mouldInletTemp}°C`} strokeWidth={5} />
            <CircularProgressbar className="outject_temp2" value={mouldOutletTemp} text={`${mouldOutletTemp}°C`} strokeWidth={5} />
          </div>
          
          <div className="featuredInfo2">
            <div className="item12">
              <div className="colorBox"></div>
              <p>Inlet</p>
            </div>
            <div className="item22">
              <div className="colorBox"></div>
              <p>Outlet</p>
            </div>
          </div>
        </div>
      </div>
      <div className="featureContainer2">
        <div className="up">
          <h1 className="topic1">
            Ambient Temperature <DeviceThermostatIcon style={{ fontSize: "30px", marginLeft: "5px", marginTop: "5px" }} />
          </h1>
        </div>
        <div className="down">
          <div className="featuredChartRight">
            <CircularProgressbar className="inject_temp2" value={ambientTemp} text={`${ambientTemp}°C`} strokeWidth={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature2;
