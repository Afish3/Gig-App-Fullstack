import React, { useState, useEffect } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import GigsAPI from '../auth/api';
import Loading from '../_commonComponents/Loading';
import UserCard from '../_commonComponents/UserCard';
import { v4 as uuid } from 'uuid';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

function ChooseCandidateDrawer({ jobData, setJobData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (jobData.employees.length === 0) {
      setLoading(true);

      GigsAPI.findCandidates(jobData)
          .then((res) => {
              setCandidates(res)
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
  }, [jobData]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const container = document.getElementById('Choose-candidate-container');

  function handleAddCandidate(evt, employeeId) {
    if (selectedCount <= 3) {
      setJobData((prevJobData) => {
        // Create a new copy of jobData to avoid mutating the state directly
        const newJobData = { ...prevJobData };

        // Add the employeeId to the employees array if not added already
        // Else, filter and remove the employee from the employees array
        newJobData.employees = newJobData.employees.includes(employeeId)
          ? newJobData.employees.filter((candidateId) => candidateId !== employeeId)
          : [...newJobData.employees, employeeId];

        // Update the selected count
        setSelectedCount(newJobData.employees.length);
  
        // Return the updated chosen candidates
        return newJobData;
      });
    };
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Browse candidates</Button>
      </Box>
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>
            { loading && !jobData.employees.length
                ? <Loading /> 
                : `${candidates.length 
                    ? candidates.length 
                    : 'No'} 
                    results found` 
            }
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'end', p: 2, color: 'text.secondary' }}>
            { selectedCount ?
                `${selectedCount} chosen, add three candidates in case your first choice can't make it.` 
                : ""
            }
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          { loading 
            ? [1,2,3].map(() => (
                    <Skeleton key={uuid()} variant="rectangular" height="100%" />
                )) 
            : candidates.map((candidate) => (
                <UserCard 
                key={uuid()} 
                chosenCandidates={jobData.employees}
                userId={candidate.id}
                cardUser={candidate} 
                bookForJob={true} 
                handleAddCandidate={handleAddCandidate} 
                />
            )) || null
          }
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

export default ChooseCandidateDrawer;