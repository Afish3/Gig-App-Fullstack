import React from 'react';
import { AlertContext } from '../AlertContext';

export const useAlertContext = () => {
    const context = React.useContext(AlertContext);
    if (!context) {
      throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
  };