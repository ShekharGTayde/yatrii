import { createContext, useState, useEffect } from "react";

export const CaptainContextData = createContext();

const CaptainContext = ({ children }) => {
    // ✅ Safe parsing with a fallback to null
    const [captain, setCaptain] = useState(() => {
        try {
            const savedCaptain = localStorage.getItem("captain");
            return savedCaptain && savedCaptain !== "undefined"
                ? JSON.parse(savedCaptain)
                : null;
        } catch (error) {
            console.error("Error parsing captain from localStorage:", error);
            return null;
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Save captain state to localStorage only if it's valid
    useEffect(() => {
        if (captain) {
            localStorage.setItem("captain", JSON.stringify(captain));
        } 
    }, [captain]);

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain,
    };

    return (
        <CaptainContextData.Provider value={value}>
            {children}
        </CaptainContextData.Provider>
    );
};

export default CaptainContext;
