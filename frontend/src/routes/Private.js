import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../auth/UserContext";

/** Component for managing access to routes that require authorization
 *
 * Used in Routes.js to check if there is a current user in contect and continues to the
 * route if so. If no user is present, navigates to login form.
 */

const Private = ({ exact, path, children }) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children
}

export default Private;