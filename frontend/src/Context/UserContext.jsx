import React, { createContext, useEffect, useState } from 'react'

export const UserContextData = createContext()

const UserContext = ({children}) => {
    
  const [user, setUser] = useState(() => {
    try {
        const savedUser = localStorage.getItem("user");
        return savedUser && savedUser !== "undefined"
            ? JSON.parse(savedUser)
            : null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
});

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

// ✅ Save user state to localStorage only if it's valid
useEffect(() => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    } 
}, [user]);

const updateUser = (userData) => {
    setUser(userData);
};

const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    updateUser,
};

            


  return (
    <div>
      <UserContextData.Provider value={value}>
      {children}
      </UserContextData.Provider>
    </div>
  )
}

export default UserContext
