import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CaptainLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          navigate('/captain-login');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [navigate]); // Dependency array ensures it runs only once

  return <div>Logging out...</div>;
};

export default CaptainLogout;
