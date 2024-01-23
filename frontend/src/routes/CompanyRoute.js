import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../auth/UserContext";

/** Component for managing access to routes that require company authorization
 *
 * Used with Private.js to check if there is the correct user type on the current user in context and continues to the
 * route if so. If wrong user type, navigates to home page.
 */

const CompanyRoute = ({ exact, path, children }) => {
  const { currentUser } = useContext(UserContext);

  if ( currentUser.userType !== "company") {
    return <Navigate to="/" />;
  }

  return children
}

export default CompanyRoute;