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

import "./LoginForm.css";

/** Login form for user. */

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

const LoginForm = ({ login }) => {
    const { currentUser } = useContext(UserContext);

    const INTIAL_STATE = {
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
        let result = await login(formData);
        if (result.success) {
            redirect("/");
        } else {
            setFormErrors(result.err);
        }
    }

    return (
            <div className="Login">
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
                <div className="Login-container">
                    <h1 className="Login-title">Gig Bear</h1>

                    {currentUser 
                    ? <>
                        <p className="Login-lead">Welcome back {currentUser.username}</p>
                    </>
                    : <>
                        <p className="Login-lead">Welcome to Gig Bears!</p>

                        <ThemeProvider theme={defaultTheme}>
                            <Container component="main" maxWidth="xs">
                                <CssBaseline />
                                <div className="avatarLocked"> 
                                    <Avatar sx={{ bgcolor: 'secondary.main' }} >
                                        <LockOutlinedIcon />
                                    </Avatar>
                                </div>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
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
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        />
                                    </Grid>

                                    {formErrors.length
                                        ? <Alert type="error" messages={formErrors} />
                                        : null
                                    }

                                    <Grid item xs={12} color="text.primary" >
                                    <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                    />
                                    </Grid>
                                    </Grid>
                                    <Button
                                    id="login-btn"
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    >
                                    Sign In
                                    </Button>
                                    <Grid container>
                                        <Grid item xs>
                                            <ReactLink to="/forgotPassword" style={{fontSize: '.8rem'}} >
                                            Forgot password?
                                            </ReactLink>
                                        </Grid>
                                        <Grid item xs>
                                            <ReactLink to="/signup" style={{fontSize: '.8rem'}}>
                                            Don't have an account? Sign up
                                            </ReactLink>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Copyright sx={{ mt: 5 }} />
                            </Container>
                        </ThemeProvider>
                    </>
                    }

                </div>
            </div>
    )
};

export default LoginForm;