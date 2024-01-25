import React, { useState, useEffect } from 'react'; 
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import backgroundVideo from './static/gigBearVid.mp4';
import './UserType.css';

/** Site UserType */

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#4caf50'
    }
  },
});

const UserType = ({ setType }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const video = document.getElementById('userType-background-video');

    if (video) {
      const handleVideoLoaded = () => {
        // Start the video when the component mounts
        video.play();
        // Simulate a delay for 2 seconds before showing the content
        const timer = setTimeout(() => {
          setShowContent(true);
        }, 2000);

        return () => clearTimeout(timer);
      };
  
      video.addEventListener('loadedmetadata', handleVideoLoaded);
  
      return () => {
        video.removeEventListener('loadedmetadata', handleVideoLoaded);
      };
    }
  }, [showContent]);

  const handleUser = () => {
    setType("user");
  };

  const handleCompany = () => {
    setType("company");
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`UserType${showContent ? ' show-content' : ''}`}>
        <video
        id="userType-background-video"
        className="background-video"
        muted
        autoPlay
        playsInline
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
        <div className="UserType-container">
          <h1 className="UserType-title">Gig Bears</h1>
          <p className="UserType-lead">Choose Bear type!</p>
            <div>
                <Stack direction="column" spacing={2}>
                    <Button id="user-btn" color="primary" variant="contained" size="small" onClick={handleUser}>
                        <p className="btn">Cub / Employee </p>
                    </Button>
                    <Button id="company-btn" color="secondary" variant="contained" size="small" onClick={handleCompany}>
                        <p className="btn">Big Bear / Employer </p>
                    </Button>
                </Stack>
            </div>
        </div>
      </div>
      </ThemeProvider>
  );
}

export default UserType;
