import React, { createContext, useCallback, useState } from "react";

/** Set a global context around App children for current alerts. */

const AlertContext = createContext();

const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((alert) => {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, clearAlerts }}>
      {children}
    </AlertContext.Provider>
  );
}

export { AlertContext, AlertProvider };