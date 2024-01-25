import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import API from "../auth/api";
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import Modal from 'react-modal';

import LoadingSaveButton from '../_commonComponents/LoadingSaveButton';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import './Calendar.css';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

const InteractiveCalendar = withDragAndDrop(Calendar);

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const GigsCalendar = ({ username, availability }) => {
    const [events, setEvents] = useState( availability || [] );
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [selectModalIsOpen, setSelectModalIsOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: null,
        end: null,
      });

    useEffect(() => {
        const updateAPI = async () => {
            let res = await API.editProfile(username, { availability: [ ...events ] });
            return res;
        }
        updateAPI();
    }, [events, username])

    const openCreateModal = () => setCreateModalIsOpen(true);
    const closeCreateModal = () => setCreateModalIsOpen(false);

    const openSelectModal = () => setSelectModalIsOpen(true);
    const closeSelectModal = () => setSelectModalIsOpen(false);

    const handleSelectSlot = useCallback(
        ({ start, end }) => {
            setNewEvent({
                id: uuid(),
                title: '',
                start,
                end,
            });
            openCreateModal();
        },
        []
    );

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        openSelectModal();
    };

    const handleDeleteEvent = () => {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        );
        setSelectModalIsOpen(false);
        setSelectedEvent(null);
    };

    const onEventResize = useCallback(
        (data) => {
          const { start, end } = data;
    
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === data.event.id ? { ...event, start, end } : event
            )
          );
        },
        [setEvents]
    );

    const onEventDrop = useCallback(
        (data) => {
            const { start, end } = data;

            setEvents((prevEvents) => 
                prevEvents.map((event) =>
                    event.id === data.event.id ? { ...event, start, end } : event
                )
            );
        }, 
        [setEvents]
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          [name]: value,
        }));
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    async function handleSubmit() {
        try {
            setEvents(prevEvents => [...prevEvents, newEvent]);
            closeCreateModal();
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Stack spacing={20} direction="row">
            <InteractiveCalendar
                defaultDate={new Date()}
                defaultView="month"
                events={events}
                localizer={localizer}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                selectable
                resizable
                scrollToTime={new Date(2024, 1, 12)}
                style={{ height: "70vh", color: 'black'  }}
            />
            <div>
                <p>Interact with the calendar</p>
                <p>to update availabile dates and times.</p>
                <p>Click to update when you are finished!</p>
                <LoadingSaveButton text="Update availability" handleClick={handleSubmit} style={{display: 'flex', justifyContent: 'center'}} />

            </div>
            <Modal
                isOpen={createModalIsOpen}
                onRequestClose={closeCreateModal}
                contentLabel="Event Form"
                className="modal-content" 
                overlayClassName="modal-overlay"
            >
                <h2>Add Availability</h2>
                <form>
                    <label>
                        Title:
                        <input
                        type="text"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Start Date/Time:
                        <input
                        type="datetime-local"
                        name="start"
                        value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                        onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        End Date/Time:
                        <input
                        type="datetime-local"
                        name="end"
                        value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                        onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <Button color='success' onClick={handleSubmit}>
                        Create Event
                    </Button>
                </form>
            </Modal>
            <Modal
                isOpen={selectModalIsOpen}
                onRequestClose={closeSelectModal}
                contentLabel="Event Form"
                className="modal-content" 
                overlayClassName="modal-overlay"
            >
                <Button color='error' onClick={handleDeleteEvent} >
                    Delete Availability
                </Button>
            </Modal>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Availability has been updated!
                </Alert>
            </Snackbar>
        </Stack>
    )}

export default GigsCalendar;