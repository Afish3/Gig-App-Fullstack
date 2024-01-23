import React, { useContext, useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import UserContext from "../auth/UserContext";
import API from "../auth/api.js";
import ProfileProgressDisplay from '../_commonComponents/ProfileProgressDisplay';
import LoadingSaveButton from '../_commonComponents/LoadingSaveButton';
import Loading from '../_commonComponents/Loading';
import skillsList from '../skills.json';
import Calendar from "../_commonComponents/Calendar";
import LocationSelector from '../_commonComponents/LocationSelector';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './Profile.css';

/** Site Profile */

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = ({ ...props }) => {
  const { currentUser } = useContext(UserContext);

  const INITIAL_STATE = currentUser.userType === 'user' ? {
    profile: currentUser.profile || "",
    areaCode: currentUser.areaCode || "",
    photo: currentUser.photo || "",
    skills: currentUser.skills || "",
    resume: currentUser.resume || "",
  } : {
    profile: currentUser.profile || "",
    areaCode: currentUser.areaCode || "",
    photo: currentUser.photo || "",
  };

  function formatAvailability(user) {
    const userAvailabilitiesRaw = String(user.availability);
    const cleanedAvailabilities = userAvailabilitiesRaw.replace(/\\/g, '');
    // Remove quotation marks before curly braces
    const stringWithoutQuotesBefore = cleanedAvailabilities.replace(/"({)/g, '$1');
    // Remove quotation marks after curly braces
    const stringWithoutQuotesAfter = stringWithoutQuotesBefore.replace(/(})"/g, '$1');
    const formattedAvailabilities = '[' + stringWithoutQuotesAfter.substring(1, stringWithoutQuotesAfter.length - 1) + ']';

    return JSON.parse(formattedAvailabilities);
  }

  const [ formData, setFormData ] = useState(INITIAL_STATE);
  const [ loading, setLoading ] = useState(false);
  const [open, setOpen] = useState(false);

  const locJSON = JSON.parse(currentUser.areaCode)
  const loc = locJSON ? locJSON.description : "";
  const [location, setLocation] = useState(loc);

  useEffect(() => {
    setFormData(data => ({ 
        ...data, 
        areaCode: location }));
  }, 
    [location, setLocation]);

  const redirect = useNavigate();

  async function handleAsyncClick() {
    setLoading(true);
    await skillsList.skills;
    setLoading(true);
  }

  function handleSkillsChange(event, newSkill) {
    setFormData(data => ({ ...data, skills: [newSkill].join(", ")}))
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  async function handleSubmit(evt) {
    await API.editProfile(currentUser.username, formData);
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
      <div className="Profile">
        {loading && <Loading/>}
        <div className="Profile-container">
          <h1 className="Profile-title">{currentUser.firstName + " " + currentUser.lastName}</h1>
          <p className="Profile-lead">Profile</p>
          <Stack spacing={20} direction="row">
          <form>
            <Box
                sx={{
                    width: 500,
                    maxWidth: '100%',
                }}
                >
                    <TextField fullWidth label="Profile Bio" 
                        style={{ marginBottom: "1rem"}}
                        name="profile"
                        id="fullWidth" 
                        autoFocus
                        value={formData.profile}
                        onChange={handleChange}/>
                    <LocationSelector value={location} setValue={setLocation} />
                    <TextField fullWidth label="Profile Photo" 
                        style={{ marginBottom: "1rem", marginTop: "1rem" }}
                        name="photo" 
                        id="fullWidth" 
                        autoFocus
                        value={formData.photo}
                        onChange={handleChange} />
                    { currentUser.userType === 'user' &&
                    <>
                        <Autocomplete
                            multiple
                            limitTags={3}
                            id="multiple-limit-tags"
                            options={skillsList.skills}
                            getOptionLabel={(option) => option}
                            defaultValue={currentUser.skills ? currentUser.skills.split(",") : []}
                            onChange={handleSkillsChange}
                            onClick={handleAsyncClick}
                            renderInput={(params) => (
                                <TextField {...params} label="Skills" placeholder="Skills" />
                            )}
                            sx={{ width: '500px', marginBottom: "1rem" }}/>
                        <TextField fullWidth label="Resume" 
                            style={{ marginBottom: "1rem"}}
                            name="resume" 
                            id="fullWidth" 
                            autoFocus
                            value={formData.resume}
                            onChange={handleChange} />
                    </>}
                </Box>

            <Stack spacing={2} direction="row" style={{marginBottom: "2rem"}}>
                <Button variant="outlined" onClick={() => redirect("/")}>Cancel</Button>
                {/* <Button variant="contained" onClick={handleSubmit}>Save</Button> */}
                <LoadingSaveButton text="Save" handleClick={handleSubmit} />
            </Stack>

            </form>

            <div style={{height: "10rem"}}>
                {currentUser.profileProgress < 100 
                ? <p> Continue completing your profile! </p>
                : <p> You've completed your profile! </p>}
                <ProfileProgressDisplay size="10rem" progress={currentUser.profileProgress || 0} />
            </div>
            </Stack>

            { currentUser.userType === 'user' &&
              <Calendar username={currentUser.username} availability={ currentUser.availability ? () => formatAvailability(currentUser) : [] }/>
            }
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Profile has been updated!
          </Alert>
        </Snackbar>
      </div>
  );
}

export default Profile;
