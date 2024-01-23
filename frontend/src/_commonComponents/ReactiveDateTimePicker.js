import React from 'react';
import Stack from '@mui/material/Stack';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const ResponsiveDateTimePicker = ({ dateStart, setDateStart, dateEnd, setDateEnd }) => (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DemoContainer components={['DateTimePicker']}>
      <Stack direction="row" spacing={2}>
        <DemoItem label="Start"> 
          <DateTimePicker value={dateStart} onChange={(newValue) => setDateStart(newValue)}/>   
        </DemoItem>
        <p style={{display: "flex", alignItems: "end", marginLeft: 20, marginRight: 20}}> -- </p>
        <DemoItem label="End"> 
          <DateTimePicker value={dateEnd} onChange={(newValue) => setDateEnd(newValue)}/>   
        </DemoItem>
      </Stack>
      </DemoContainer>
    </LocalizationProvider>
  )

export default ResponsiveDateTimePicker;