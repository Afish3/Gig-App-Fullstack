import React from "react";
import { Routes,  Route } from "react-router-dom";
import PrivateRoute from "./Private";
import CompanyRoute from "./CompanyRoute";
import UserRoute from "./UserRoute";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import ProfileForm from "../pagesComponents/Profile";
import JobsPage from "../pagesComponents/Jobs";

const RoutesList = ({ login, signup, userType }) => (

        <Routes>
            <Route exact path="/" element={<Homepage userType={userType} />}> </Route>

            <Route exact path="/login" element={<LoginForm login={login} userType={userType} />}> </Route>

            <Route exact path="/signup" element={<SignupForm signup={signup} userType={userType} />}> </Route>

            <Route exact path="/company/profile" element={
                <PrivateRoute exact path="/company/profile">
                    <CompanyRoute exact path="/company/profile">
                        <ProfileForm />
                    </CompanyRoute>
                </PrivateRoute>
            }> </Route>

            <Route exact path="/company/jobs" element={
                <PrivateRoute exact path="/company/jobs">
                    <CompanyRoute exact path="/company/jobs">
                        <JobsPage />
                    </CompanyRoute>
                </PrivateRoute>
            }> </Route>

            <Route exact path="/user/jobs" element={
                <PrivateRoute exact path="/user/jobs">
                    <UserRoute exact path="/user/jobs">
                        <JobsPage />
                    </UserRoute>
                </PrivateRoute>
            }> </Route>

            <Route exact path="/user/profile" element={
                <PrivateRoute exact path="/user/profile">
                    <UserRoute exact path="/user/profile">
                        <ProfileForm />
                    </UserRoute>
                </PrivateRoute>
            }> </Route>

            <Route path="/" />
        </Routes>
    )

export default RoutesList;
