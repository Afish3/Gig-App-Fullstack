import React, { useEffect } from 'react';
import { useAlertContext } from '../hooks/useAlertContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
  const { alerts, clearAlerts } = useAlertContext();

  useEffect(() => {
    alerts.forEach((alert) => {
      // Display toast for each alert
      toast(`${alert.message}`);
    });

  }, [alerts]);

  useEffect(() => {
    console.log("Setting timeout to clear alerts");
    const timeoutId = setTimeout(() => {
        console.info("Clearing alerts");
        clearAlerts();
    }, 5000); // Clear alerts after 5 seconds

    return () => {
        // Clear alerts when the component unmounts
        console.info("Clearing timeout");
        clearTimeout(timeoutId);
    };
  }, [clearAlerts]);

  return <ToastContainer />;
};

export default ToastNotification;