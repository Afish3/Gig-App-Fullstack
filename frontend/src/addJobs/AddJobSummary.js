import React from 'react';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import UserCard from '../_commonComponents/UserCard';

const AddJobSummary = ({ job }) => {

    const choices = ['1st', '2nd', '3rd'];

    return (
        <Box sx={{ p: 2, overflowY: 'auto', maxHeight: '60vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography gutterBottom variant="h5" component="div" style={{ marginBottom: 20 }}>
                    {job.title}
                </Typography>
                <Typography gutterBottom variant="h5" color="text.secondary" component="div">
                    {moment(job.dateStart).fromNow()}
                </Typography>
            </Stack>
            <Typography variant="body2" style={{ marginBottom: 20 }}>
                {job.description}
            </Typography>
            <Typography variant="body2" style={{ marginBottom: 20 }}>
                {`$${job.salary} / hr`}
            </Typography>
            <Divider light />
            <Stack direction="row" alignItems="left" style={{ marginBottom: 20 }}>
                <PlaceIcon />
                <Typography variant="body2" style={{ padding: 5 }}>
                    {job.location.description}
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="left" style={{ marginBottom: 20 }}>
                <AccessTimeIcon />
                <Typography variant="body2" style={{ padding: 5 }}>
                    {moment(job.dateStart).format('llll')} - {moment(job.dateEnd).format('llll')}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                    {`${moment(job.dateEnd).diff(moment(job.dateStart), 'hours')} hr job`}
                </Typography>
            </Stack>
            <Divider light />
            <Typography gutterBottom variant="h5" component="div">
                Selected Employee Choices:
            </Typography>
            <Box sx={{ p: 2, overflowY: 'auto', maxHeight: '70vh' }}>
                <List sx={{ width: '100%', maxWidth: 360 }}>
                    <Stack direction="row" alignItems="left" >
                        {job.employees.map((employee, idx) => (
                            <>
                            <Typography variant="body2">
                                {`${choices[idx]} choice`}
                            </Typography>
                            <ListItem alignItems="flex-start">
                                <UserCard userId={employee} />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            </>
                        ))}
                    </Stack>
                </List>
            </Box>
        </Box>
    )
}

export default AddJobSummary