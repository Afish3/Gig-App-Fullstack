import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Rating from '@mui/material/Rating';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';

import moment from 'moment';
import GigsApi from '../auth/api';
import useAlert from '../hooks/useAlert';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})

(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const JobCard = ({ job, cardFor = 'user' }) => {
  const [expanded, setExpanded] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const { handleAlert } = useAlert();

  const handleExpandClick = () => setExpanded(!expanded);

  const handleSettingsClick = () => setSettingsAnchor(!settingsAnchor);
  const handleSettingsClose = () => setSettingsAnchor(null);
  const settingsOpen = Boolean(settingsAnchor);

  const handleJobAccept = async () => {
    if (!isAccepted) {
        let res = await GigsApi.editJob(job.id, { accepted: job.userId1 });
        handleAlert(res.accepted, res.companyId, res, 'accepted');
        setIsAccepted(true);
    }
  }

  const handleJobDecline = async () => {
    if (!isDeclined) {
        let res = await GigsApi.editJob(job.id, { userId1: job.userId2, userId2: job.userId3, userId3: null });
        handleAlert(res.userId1, res.companyId, res, 're-booked');
        // GigsApi.setUserAcceptTimeout(res.userId1, 10);
        setIsDeclined(true);
    }
  }

  return (
    <Card sx={{ maxWidth: 800, marginBottom: "2rem" }} >
      <CardHeader
        avatar={ job.companyPhoto
          ? <Avatar sx={{ bgcolor: blue[500] }} aria-label={`company ${job.companyName}`}>
              {job.companyName[0].toUpperCase()}
            </Avatar>
          : <Avatar src={job.companyPhoto} aria-label={`company ${job.companyName}`}> </Avatar>
        }
        action={
        <>
          <IconButton aria-label="settings" 
          onClick={handleSettingsClick}
          expand={settingsAnchor}
          >
            <MoreVertIcon />
          </IconButton> 
          <Popover
          open={settingsOpen}
          anchorEl={settingsAnchor}
          onClose={handleSettingsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          >
            <Typography sx={{ p: 2 }}>
                <Button variant="text">
                    {cardFor === 'user' ? 'See Company!' : 'See User!'}
                </Button>
            </Typography>
          </Popover>
        </>
        }
        title={job.title}
        subheader={
            <Typography aria-label={`Job start ${moment(job.dateStart).fromNow()}`}>
                {moment(job.dateStart).fromNow()}
            </Typography>
        }
      />
      <CardContent >
        <Typography variant="body2" color="text.secondary">
          {job.description}
        </Typography>
      </CardContent>

      { cardFor === 'user' &&
      <CardActions disableSpacing>
        {(!job.accepted && !isDeclined) && <>
        <IconButton aria-label="accept" onClick={handleJobAccept}>
          <ThumbUpAltIcon />
        </IconButton>
        <IconButton aria-label="decline" onClick={handleJobDecline}>
          <ThumbDownAltIcon />
        </IconButton>
        </>}
        {job.accepted &&
            <Typography aria-label="accepted" style={{ color: 'green'}}>
                <b> Accepted! </b>
            </Typography>}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
           { cardFor === 'user'
            ? <>
              <Typography aria-label={job.companyName}>
                <b>Company: </b> {` ${job.companyName}`}
              </Typography>
              <Rating 
              aria-label={`rating ${job.companyRating} out of 5 stars`} 
              value={job.companyRating} 
              readOnly 
              size="small"
              />
              </>
            : <>
              <Typography aria-label={job.username}>
                <b>Employee: </b> {` ${job.username}`}
              </Typography>
              <Rating aria-label={`rating ${job.userRating} out of 5 stars`} 
              value={job.userRating} 
              readOnly 
              size="small"
              />
              </>}
              <Typography aria-label={`job location ${job.location.description}`}>
                <b>Job location: </b> {` ${job.location.description}`}
              </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default JobCard;