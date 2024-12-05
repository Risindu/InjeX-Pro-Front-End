// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the user session exists in sessionStorage
  const user = sessionStorage.getItem('user');

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
