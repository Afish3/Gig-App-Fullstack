import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ProfileProgressDisplay = ({ progress, size="12rem" }) => {
    
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }} >
            <CircularProgress variant="determinate" 
            value={progress} 
            size={size} 
            thickness={2} 
            data-testid="progressbar" />
            <Box
            data-testid="outer-box"
            sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: `${size}`,
                backgroundColor: 'rgba(5, 5, 5, 0.1)',
            }}
            >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
      );
  }

  export default ProfileProgressDisplay;