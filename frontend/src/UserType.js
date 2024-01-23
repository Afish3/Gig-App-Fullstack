import React from 'react'; 
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import './UserType.css';

/** Site UserType */

const UserType = ({ setType }) => {

  const handleUser = () => {
    setType("user");
  };

  const handleCompany = () => {
    setType("company");
  };

  return (
      <div className="UserType">
        <div className="UserType-container">
          <h1 className="UserType-title">Gig Bears</h1>
          <p className="UserType-lead">Choose Bear type!</p>
            <div>
                <Stack direction="column" spacing={2}>
                    <Button id="user-btn" color="primary" variant="contained" size="small" onClick={handleUser}>
                        <p className="btn">Cub / Employee </p>
                    </Button>
                    <Button id="company-btn" color="info" variant="contained" size="small" onClick={handleCompany}>
                        <p className="btn">Big Bear / Employer </p>
                    </Button>
                </Stack>
            </div>
        </div>
      </div>
  );
}

export default UserType;
