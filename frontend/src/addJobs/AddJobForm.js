import React, { useEffect, useState } from 'react';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';

import LocationSelector from '../_commonComponents/LocationSelector';
import ReactiveDateTimePicker from '../_commonComponents/ReactiveDateTimePicker';

const AddJobForm = ({ formData, setFormData }) => {
  const [location, setLocation] = useState(null);
  const [dateStart, setDateStart] = useState(moment());
  const [dateEnd, setDateEnd] = useState(moment());

  useEffect(() => {
    setFormData(data => ({ 
        ...data, 
        location: location, 
        dateStart: dateStart, 
        dateEnd: dateEnd}));
  }, 
    [location, 
    setLocation, 
    setDateStart, 
    dateStart, 
    setDateEnd, 
    dateEnd,
    setFormData]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

    return (
        <Box
        component="form"
        sx={{
            '& > :not(style)': { m: 1 },
        }}
        noValidate
        autoComplete="off"
        >
            <TextField
            required
            id="outlined-required"
            label="Title"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            />
            <TextField
            id="outlined-textarea"
            label="Description"
            name="description"
            placeholder="Job description"
            value={formData.description}
            onChange={handleChange}
            multiline
            />
            <LocationSelector value={location} setValue={setLocation} />
            <ReactiveDateTimePicker dateStart={dateStart}
            setDateStart={setDateStart}
            dateEnd={dateEnd}
            setDateEnd={setDateEnd}
            />
            <FormControl  sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-amount">Salary</InputLabel>
                <Input
                    id="standard-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    name='salary'
                    placeholder='Hourly Salary'
                    value={formData.salary}
                    onChange={handleChange}
                />
            </FormControl>
        </Box>
    )
}

export default AddJobForm