import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import ChooseCandidateDrawer from './ChooseCandidateDrawer';
import GigsApi from '../auth/api';
import AddJobForm from './AddJobForm';
import AddJobSummary from './AddJobSummary';
import UserContext from "../auth/UserContext";
import useAlert from '../hooks/useAlert';


const steps = ['Job details', 'Choose candidate', 'Confirm'];

export default function MakeJobStepper({ closeModal}) {
  const { currentUser } = useContext(UserContext);
  const [activeStep, setActiveStep] = useState(0);
  const { handleAlert } = useAlert();

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    dateStart: "",
    dateEnd: "",
    company: currentUser.id,
    employees: [],
  });

  const handleNext = () => {
    if (activeStep === 0 && jobData.location === "") {
      alert('Please select at job location.');
      return;
    }
    if (activeStep === 1 && jobData.employees.length === 0) {
      // User should never be able to make this code run, buttons should be disabled until candidates are chosen.
      alert('Please select at least 1 candidate.');
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    console.log(jobData);
    let res = await GigsApi.createJob(jobData);
    handleAlert(res.userId1, res.companyId, res, 'booked');
    // GigsApi.setUserAcceptTimeout(res.userId1, 10);
    closeModal();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleSubmit}>Finish</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }} id="Choose-candidate-container">
            {activeStep === 0 &&
             <AddJobForm formData={jobData} setFormData={setJobData} />
            }
            {activeStep === 1 &&
             <ChooseCandidateDrawer jobData={jobData} setJobData={setJobData} />
            }
            {activeStep === 2 &&
             <AddJobSummary job={jobData} />
            }
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button 
            onClick={handleNext}
            disabled={
              (activeStep === 1 && jobData.employees.length === 0) // Disable if no candidates are chosen.
            }
            >
              {activeStep === steps.length - 1 ? 'Last Step!' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}