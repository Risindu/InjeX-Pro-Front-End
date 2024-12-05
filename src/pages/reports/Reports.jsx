import './Reports.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reports = () => {
  const [reportParams, setReportParams] = useState({
    startDate: '',
    endDate: '',
    reportType: 'summary', // Default report type
  });
  const [reportUrl, setReportUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleInputChange = (e, key) => {
    setReportParams((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const generateReport = async () => {
    setIsLoading(true); // Set loading state
    setReportUrl(null); // Reset previous report link

    try {
      const response = await axios.post('http://157.245.105.131:5000/reports/advanced', reportParams);
      setReportUrl(response.data.url); // Set the report URL
      toast.success('Report generated successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(`Error generating report: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="report">
      <ToastContainer /> {/* Toast notifications container */}
      <Sidebar />

      <div className="reportContainer">
        <Navbar />
        <div className="reportContent">
          <h2>Generate Report</h2>

          <div className="reportSection">
            <h3>Report Parameters</h3>
            <div className="sectionGroup">
              <label>
                Start Date:
                <input
                  type="date"
                  value={reportParams.startDate}
                  onChange={(e) => handleInputChange(e, 'startDate')}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={reportParams.endDate}
                  onChange={(e) => handleInputChange(e, 'endDate')}
                />
              </label>
              <label>
                Report Type:
                <select
                  value={reportParams.reportType}
                  onChange={(e) => handleInputChange(e, 'reportType')}
                >
                  <option value="summary">Summary</option>
                  <option value="detailed">Detailed</option>
                </select>
              </label>
            </div>
          </div>

          <button
            className="generateButton"
            onClick={generateReport}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>

          {reportUrl && (
            <div className="reportDownload">
              <h3>Report Ready</h3>
              <a href={reportUrl} target="_blank" rel="noopener noreferrer">
                Download Report
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
