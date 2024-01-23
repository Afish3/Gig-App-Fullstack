import React, { useContext } from 'react'; 
import UserContext from "../auth/UserContext";

import ProfileProgressDisplay from '../_commonComponents/ProfileProgressDisplay';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Logo from '../static/google-logo.svg';
import { Link } from "react-router-dom";
import './Homepage.css';

/** Site homepage */

const Homepage = ({ userType }) => {
  const { currentUser } = useContext(UserContext);

  const googleLogin = () => {
    window.open("http://localhost:3001/auth/google", "_self");
  }

  return (
      <div className="Homepage">
        <div className="Homepage-container">
          <h1 className="Homepage-title">Gig Bear</h1>
          <p className="Homepage-lead">Welcome to Gig Bears!</p>
          
          {currentUser
              ? <>
                <h2 id="welcome-lead" style={{color: 'black'}}>
                  Welcome Back, {currentUser.firstName || currentUser.username}!
                </h2>
                {currentUser.profileProgress < 100 
                ? <p> Continue completing your profile! </p>
                : <p> You've completed your profile! </p>}
                <ProfileProgressDisplay progress={currentUser.profileProgress || 0} />
              </>
              : (
                  <div>
                    <Stack direction="column" spacing={2}>
                        {userType === "user" ? <Button color="primary" variant="contained" size="small" onClick={googleLogin}>
                          <div className="Google-logo">
                            <img src={Logo} alt="Google logo" style={{width: '4rem'}} />
                          </div>
                          <p className="btn">Log in with Google</p>
                        </Button> : null}
                        <Button id="email-login-btn" color="info" variant="contained" size="small">
                        <Link className="btn"
                            to="/login">
                            Log in with email
                        </Link>
                        </Button>
                        <Button color="warning" variant="contained" size="small">
                        <Link className="btn"
                            to="/signup">
                            Sign up
                        </Link>
                        </Button>
                      </Stack>
                  </div>
              )}
        </div>
      </div>
  );
}

export default Homepage;
