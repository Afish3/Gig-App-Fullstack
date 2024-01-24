import * as React from 'react';
import UserContext from "../auth/UserContext";

import {v4 as uuid} from 'uuid';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';

import { NavLink, useNavigate } from "react-router-dom";
import './Nav.css';

const pages = ['Jobs', 'Profile', 'Settings'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];



const theme = createTheme({
    palette: {
      primary: {
        main: lightBlue[500]
      },
    },
  });

const NavigationBar = ({ logout }) => {
    const { currentUser } = React.useContext(UserContext);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const redirectTo =  useNavigate();

    const NavigationLoggedOut = () => (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ width: '100vw' }}>
                    <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <NavLink to="/" style={{textDecoration: "none", color: "black"}}>
                        Gig Bears
                        </NavLink>
                    </Typography>
                    <Button color="inherit"><NavLink to="/login" className="Nav-link">Login</NavLink></Button>
                    <Button color="inherit"><NavLink to="/signup" className="Nav-link">Sign Up</NavLink></Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    )

    const NavigationLoggedIn = () => {

        const handleLogout = () => {
            logout();
            return redirectTo('/');
        }

        const handleOpenNavMenu = (event) => {
            setAnchorElNav(event.currentTarget);
          };

        const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
        };
    
        const handleCloseNavMenu = () => {
        setAnchorElNav(null);
        };
    
        const handleCloseUserMenu = () => {
        setAnchorElUser(null);
        };
    
        return (
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                    <FlutterDashIcon color={'white'} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        textDecoration: 'none',
                        color: 'white'
                        }}
                    >
                        <NavLink to={"/"}> 
                            GigBears
                        </NavLink>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                        id="menu-btn"
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        >
                        <MenuIcon />
                        </IconButton>
                        <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                        >
                        {pages.map((page) => (
                            <MenuItem key={page.toLowerCase()}  id={page.toLowerCase()} onClick={handleCloseNavMenu}>
                            <Typography textAlign="center" style={{color: 'black'}}>
                                <Button id={page.toLowerCase() + '-btn'} color="inherit">
                                    <NavLink to={"/" + currentUser.userType + "/" + page.toLowerCase()} className="Nav-link"> 
                                        {page} 
                                    </NavLink>
                                </Button>
                            </Typography>
                            </MenuItem>
                        ))}
                        </Menu>
                    </Box>
                    <FlutterDashIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        GigBears
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <NavLink to={"/" + currentUser.userType + "/" + page.toLowerCase()} className="Nav-link"> 
                                {page} 
                            </NavLink>
                        </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt={currentUser.firstName} src='../static/userAvatar/avatar.jpg' />
                        </IconButton>
                        </Tooltip>
                        <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        >
                        <MenuItem key={uuid()} onClick={handleCloseUserMenu}>
                            <Typography textAlign="center"><Button onClick={handleLogout}> Logout </Button></Typography>
                        </MenuItem>
                        </Menu>
                    </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            )
        }

    return (
        <>
            {currentUser ? NavigationLoggedIn() : NavigationLoggedOut()}
        </>
    )
}

export default NavigationBar;