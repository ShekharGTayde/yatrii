import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 import { UserContextData } from '../Context/UserContext.jsx';
 import { CaptainContextData } from '../Context/CaptainContext.jsx';

const UserWraper = ({ children }) => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContextData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      

          axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            withCredentials: true, // Ensure cookies are sent with the request
           
        })
            .then(response => {
                if (response.status === 200) {
                    const data = response.data.data
                    setUser(data.user);
                    setIsLoading(false);
                    
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/user-login');
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

const CaptainWraper = ({ children }) => {
    const navigate = useNavigate();
    const {captain, setCaptain}  = useContext(CaptainContextData);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            withCredentials: true, // Ensure cookies are sent with the request
           
        })
            .then(response => {
                if (response.status === 200) {
                    const data = response.data.data
                    setCaptain(data.captain)
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/captain-login');
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export{ 
    UserWraper,
    CaptainWraper
};
