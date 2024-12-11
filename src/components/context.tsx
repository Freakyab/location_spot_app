import React, { createContext, useContext, useState } from "react";

// Location Context
export const locationContext = createContext({
  location: { lat: 0, long: 0 },
  setLocation: (location: { lat: number; long: number }) => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState({ lat: 0, long: 0 });

  return (
    <locationContext.Provider value={{ location, setLocation }}>
      {children}
    </locationContext.Provider>
  );
};

export default LocationProvider;

export const useLocation = () => useContext(locationContext);

// Authentication Context
const AuthContext = createContext({
  userDetails: {
    name: "",
    email: "",
    pic: "",
    token: null as string | null,
  },
  handleSavingUserDetails: (userDetails: {
    name: string;
    email: string;
    pic: string;
    token: string | null;
  }) => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    return storedUserDetails
      ? JSON.parse(storedUserDetails)
      : { name: "", email: "", pic: "", token: null };
  });

  const handleSavingUserDetails = (userDetails: {
    name: string;
    email: string;
    pic: string;
    token: string | null;
  }) => {
    if (userDetails.token === null) {
      localStorage.removeItem("userDetails");
      setUserDetails({ name: "", email: "", pic: "", token: null });
    } else {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      setUserDetails(userDetails);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        handleSavingUserDetails,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
