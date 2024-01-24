import React, { useContext, useState } from 'react';
import UserContext from "../auth/UserContext";
import JobCard from '../_commonComponents/JobCard';
import backgroundPhoto from '../static/gigBearPhoto.png';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MakeJobStepper from '../addJobs/MakeJobStepper';

import './Jobs.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Jobs = () => {
    const { currentUser } = useContext(UserContext);
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const acceptedJobs = currentUser.jobs.filter((job) => job.accepted);
    const bookedJobs = currentUser.jobs.filter((job) => !job.accepted);

    return (
        <div className='Jobs'>
        <div
            style={{
            backgroundImage: `url(${backgroundPhoto})`,
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
            ></div>
          <div className="Jobs-container">
            <h1 className="Jobs-title">Jobs</h1>

            {currentUser.userType === 'company' &&
                <>
                    <Button onClick={handleModalOpen}>Create new job!</Button>
                    <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={modalOpen}
                    onClose={handleModalClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                        timeout: 500,
                        },
                    }}
                    >
                    <Fade in={modalOpen}>
                        <Box sx={modalStyle}>
                            <Typography id="transition-modal-title" variant="h6" component="h2">
                                Create job
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                Follow the steps to create a job...
                            </Typography>
                            <MakeJobStepper closeModal={handleModalClose} />
                        </Box>
                    </Fade>
                    </Modal>
                </>
            }

            {acceptedJobs.length ? <p className="Jobs-lead">Accepted Jobs</p> : ""}
            <Divider light />
            {acceptedJobs.length 
                ? acceptedJobs.map((job) => (
                    <JobCard 
                    job={job} 
                    cardFor={currentUser.userType} />
                ))
                : ""
            }
            {bookedJobs.length ? <p className="Jobs-lead">Booked Jobs</p> : ""}
            <Divider light />
            {bookedJobs.length 
                ? bookedJobs.map((job) => (
                    <JobCard 
                    job={job} 
                    cardFor={currentUser.userType} />
                ))
                : ""
            }

            {!currentUser.jobs.length && <p>Sorry, no jobs found.</p>}
        </div>
        </div>
    )
}

export default Jobs;