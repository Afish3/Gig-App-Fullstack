import React, { useState, useEffect, useLayoutEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Rating from '@mui/material/Rating';
import Fab from '@mui/material/Fab';
import DescriptionIcon from '@mui/icons-material/Description';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';

import GigsApi from '../auth/api';
import {v4 as uuid} from 'uuid';
import './UserCard.css'

const resumeIframeStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

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

const UserCard = ({ userId, cardUser, handleAddCandidate, chosenCandidates, bookForJob = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [user, setUser] = useState(cardUser);
  const [isHeartRed, setHeartRed] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);

  const handleSettingsClick = () => setSettingsAnchor(!settingsAnchor);
  const handleSettingsClose = () => setSettingsAnchor(null);
  const settingsOpen = Boolean(settingsAnchor);

  const handleResumeOpen = () => setResumeOpen(true);
  const handleResumeClose = () => setResumeOpen(false);

  // const handleColorChange = useCallback(() => {
  //   console.log(chosenCandidates)
  //   setHeartRed(prevHeartRed => !prevHeartRed);
  // }, [chosenCandidates]);

  useLayoutEffect(() => {
    console.log(chosenCandidates)
    // Check if the current user is in the chosenCandidates array
    const isUserChosen = chosenCandidates.includes(userId);

    // Set the heartRed state based on the check
    setHeartRed(isUserChosen);
  }, [chosenCandidates, userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!cardUser && !user) {
          let res = await GigsApi.getUserById(userId);
          if (res) {
            setUser(res);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    console.log("Fetching Data...");
    fetchData();
  }, [cardUser, userId, user]);

  const handleAdd = (evt) => {
    if (bookForJob) {
     handleAddCandidate(evt, userId); 
    }
  };

  function getFullName (user) {
    const fullName = user.firstName + ' ' + user.lastName;
    return fullName;
  };

  return (
    <>
    { user ? 
    <Card sx={{ maxWidth: 800, marginBottom: "2rem" }} >
      <CardHeader
        avatar={ user.photo 
          ? <Avatar sx={{ bgcolor: blue[500] }} aria-label={`user ${getFullName(user)}`}>
              {user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}
            </Avatar>
          : <Avatar src={user.photo} aria-label={`user ${getFullName(user)}`}> </Avatar>
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
          onClose={handleSettingsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          >
            <Typography sx={{ p: 2 }}><Button variant="text">Book this user!</Button></Typography>
          </Popover>
        </>
        }
        title={getFullName(user)}
        subheader={
            <Rating aria-label={`rating ${user.rating} out of 5 stars`} value={user.rating} readOnly size="small"/>
        }
      />
      <CardContent >
        <Typography variant="body2" color="text.secondary" >
          {user.profile}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button onClick={(evt) => handleAdd(evt)} aria-label="add to favorites">
          <FavoriteIcon style={{ fill: isHeartRed ? 'red' : 'blue'}}/>
        </Button>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={`${expanded}`}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <List>
            Skills:
            {user.skills.split(',').map(skill => (
                    <ListItemText
                    key={uuid()}
                    primary={skill}
                    />
            ))}
          </List>

          <Fab variant="extended" aria-label="resume" color="primary" onClick={handleResumeOpen}>
            <DescriptionIcon sx={{ mr: 1 }} />
            Resume
          </Fab>

          <Modal
            open={resumeOpen}
            onClose={handleResumeClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={resumeIframeStyle}>
                <iframe style={{height: "80vh"}} width="100%" title={`${user.firstName}'s resume`} src={user.resume} ></iframe>
            </Box>
          </Modal>
        </CardContent>
      </Collapse>
    </Card>
    : "NO USeR"}
    </>
  );
}

export default UserCard;