import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import GigsApi from './auth/api';
import jwt from "jsonwebtoken";
import Loading from './_commonComponents/Loading';
import UserContext from './auth/UserContext';
import { AlertProvider } from './AlertContext';
import ToastNotification from './_commonComponents/ToastNotification';
import Nav from './nav/Nav';
import Routes from './routes/Routes';
import UserType from './UserType';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

function App() {
  /** State for the current user, loading status, users applications and the users
   * jwt token from the API are stored in the App component.
   * 
   * jwt token is stored in state as well as local storage so long as there is a value.
   * 
   * User types are stored in local storage being either users or companies.
   * 
   * see hooks/useLocalStorage.js for more information on the custom useLocalStorage hook.
   */
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useLocalStorage("jwt-gigs");

  const [userType, setUserType] = useState(null);

  /** useEffect hook is called anytime there are changes to the `token` state such as 
   * logging in a user.
   * 
   * Token is grabbed from state after logging in or signing up and added to the API class.
   * 
   * The username is decoded from the token and used to get the users details for
   * saving the currentUser and the current users applications information in state.
   */

  useEffect(() => {
    async function getCurrentUser() {
      if (token) {
        try {
          GigsApi.token = token;

          let { id } = jwt.decode(token);
          let currentUser = await GigsApi.getCurrentUser(id);

          setCurrentUser(currentUser);
        } catch (err) {
          console.error("Error loading user info", err);
        }
      } else {
        loginWithGoogle();
      }
    }
    setIsLoaded(false);
    if (!currentUser) {
      getCurrentUser();
    } else {
      setIsLoaded(true);
    }
  }, [token, currentUser]);

  async function loginWithGoogle() {
    try {
      let user = await GigsApi.getGoogleUser();
      setCurrentUser(user);
      setIsLoaded(true);
    } catch (err) {
      console.error("Error loading user info from the Google OAuth endpoint", err);
    }
  }

  /** singup function asynchronously calls the API and awaits a res token.
   * 
   * Token is set in state.
   */

  async function signup(signupData) {
    try {
      let token = await GigsApi.signup({ ...signupData, userType });
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("signup failed", err);
      return { success: false, err };
    }
  }

  /** login function asynchronously calls the API and awaits a res token.
   * 
   * Token is set in state.
   */

  async function login(loginData) {
    try {
      let token = await GigsApi.login({ ...loginData });
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("login failed", err);
      return { success: false, err };
    }
  }

  /** Log out a user. Clear storage and local storage. */
  async function logout() {
    setToken(null);
    setCurrentUser(null);
    await GigsApi.logout();
    setToken(null);
    setCurrentUser(null);
  }

  if (!isLoaded) return <Loading />;

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <AlertProvider>
        <ToastNotification />
        <BrowserRouter>
          <div className="App">
            <header className="App-header">
              <Nav logout={logout}/>
              { (!userType && !currentUser) 
                ? <UserType setType={setUserType} /> 
                : <Routes login={login} signup={signup} userType={userType} /> 
              }
            </header>
          </div>
        </BrowserRouter>
      </AlertProvider>
    </UserContext.Provider>
  );
}

export default App;