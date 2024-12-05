// src/pages/dashboard/Dashboard.js
import './Dashboard.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Widgets from '../../components/widgets/Widgets';
import MachineStatus from '../../components/machine_status/Machine_status';
import Features from '../../components/feature1/Feature';
import Feature2 from '../../components/feature2/Feature2';
import Label from '../../components/label/Label';
import Preasure from '../../components/preasure/Preasure';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('http://157.245.105.131:5000/dashboard/data')
        .then((response) => {
          setSensorData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error fetching data: ' + err.message);
          setLoading(false);
        });
    };

    // Fetch data immediately on mount
    fetchData();

    // Set up polling to fetch data every 1 seconds
    const interval = setInterval(fetchData, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#3f51b5" size={60} />
        <p>Loading data, please wait...</p>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <Navbar />
        <div className="widgets">
          <Widgets type="unit" data={sensorData} />
          <Widgets type="cost" data={sensorData} />
          <Widgets type="time" data={sensorData} />
         
        </div>
        <div className="status">
          <MachineStatus data={sensorData} />
        </div>
        <div className="feature1">
          <Features data={sensorData} />
        </div>
        <div className="preasure">
          <Preasure data={sensorData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
