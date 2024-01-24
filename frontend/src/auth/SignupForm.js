import React, { useState, useContext } from "react";
import UserContext from "../auth/UserContext";
import { useNavigate, Link as ReactLink } from "react-router-dom";
import Alert from "../_commonComponents/Alert";
import BASE_URL from "../frontendUrl";
import backgroundPhoto from '../static/gigBearPhoto.png';


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import "./SignupForm.css";

/** Signup form for user. */

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href={BASE_URL}>
          Gig Bears
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const defaultTheme = createTheme();

const SignupForm =  ({ signup, userType }) => {
    const { currentUser } = useContext(UserContext);

    const INTIAL_STATE = {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
    }

    const redirect = useNavigate();
    const [formData, setFormData] = useState(INTIAL_STATE);

    const [formErrors, setFormErrors] = useState([]);

    function handleChange(evt) {
            const { name, value } = evt.target;
            setFormData(data => ({ ...data, [name]: value }));
        }

    async function handleSubmit(evt) {
        evt.preventDefault();
        let result = await signup(formData);
        if (result.success) {
            redirect("/");
        } else {
            setFormErrors(result.err);
        }
    }

    return (
            <div className="Signup">
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
                <div className="Signup-container">
                    <h1 className="Signup-title">Gig Bear</h1>

                    {currentUser 
                    ? <>
                        <p className="Signup-lead">Welcome back {currentUser.username}</p>
                    </>
                    : <>
                        <ThemeProvider theme={defaultTheme}>
                            <Container component="main" maxWidth="xs">
                                <CssBaseline />
                                <div className="avatarLocked"> 
                                    <Avatar sx={{ bgcolor: 'darkgreen' }} >
                                        <LockOutlinedIcon />
                                    </Avatar>
                                </div>
                                <Typography component="h1" variant="h5">
                                    Sign up
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>

                                { userType === "company" 
                                    ? <Grid item xs={12} >
                                        <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="Company Name"
                                        autoFocus
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        />
                                    </Grid>
                                    : <>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                            autoComplete="given-name"
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            autoFocus
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="family-name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            />
                                        </Grid>
                                    </>
                                    }

                                   { userType === "company" 
                                    ? <Grid item xs={12}>
                                        <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Company Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        />
                                    </Grid>
                                    : <Grid item xs={12}>
                                        <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        />
                                    </Grid>}
                                    <Grid item xs={12}>
                                        <TextField
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        />
                                    </Grid>

                                    {formErrors.length
                                        ? <Alert type="error" messages={formErrors} />
                                        : null
                                    }

                                    <Grid item xs={12} color="text.primary">
                                        <FormControlLabel
                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                        label="I want to receive inspirational quotes and updates via email."
                                        />
                                    </Grid>
                                    </Grid>
                                    <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    >
                                    Sign Up
                                    </Button>
                                    <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <ReactLink to="/login" style={{fontSize: '.9rem'}}>
                                        Already have an account? Sign in
                                        </ReactLink>
                                    </Grid>
                                    </Grid>
                                </Box>
                                <Copyright sx={{ mt: 4 }} />
                            </Container>
                        </ThemeProvider>
                    </>
                    }

                </div>
            </div>
    )
};

export default SignupForm;