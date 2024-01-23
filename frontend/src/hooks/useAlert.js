import React from 'react';
import { useAlertContext } from './useAlertContext';
import UserContext from '../auth/UserContext';
import GigsApi from '../auth/api';

const useAlert = () => {
    const currentUser = React.useContext(UserContext);
    const { addAlert } = useAlertContext();
  
    const handleAlert = async (userId, companyId, job, messageType) => {
      try {
        let message;
        const currUser = currentUser.currentUser.id
        if (currUser === userId) {
            message = messageType === 'accepted' ? 'You have a job!' : 'Action required for your job booking!';
        } else if (currUser === companyId) {
            if (messageType === 'accepted') message = 'Your job has been accepted';
            if (messageType === 'booked') message = 'We will notify you once your job is accepted';
        }
        if (message) {
            // Add alert to the context
            addAlert({ message });
        }
  
        // Handle API calls for alerting via email
        await handleBackendAlert(userId, companyId, job, messageType);
      } catch (error) {
        console.error('Error handling alert:', error);
      }
    };
  
    const handleBackendAlert = async (userId, companyId, job, messageType) => {
      await GigsApi.sendEmailAlert({ userId, companyId, job, messageType });
    };
  
    return { handleAlert };
  };
  
  export default useAlert;