import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigationCallback } from '../../axiosInstance/axiosInstance.js';

const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the navigation callback when component mounts
    setNavigationCallback(navigate);

    // Clean up on unmount
    return () => {
      setNavigationCallback(null);
    };
  }, [navigate]);

  return children;
};

export default NavigationProvider;