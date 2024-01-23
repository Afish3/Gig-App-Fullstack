import React from "react";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {v4 as uuid} from "uuid";

/** Used to alert error messages when logging in or signing up with invalid
 * credentials. */

const BasicAlert = ({ type = "error", messages = [] }) => {

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
        {messages.map(error => (
            <Alert severity={type} key={uuid()}>
              {error}
            </Alert>
        ))}
      </Stack>
  );
}

export default BasicAlert;
