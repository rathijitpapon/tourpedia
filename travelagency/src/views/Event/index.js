import React, {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import {Link, useHistory} from 'react-router-dom';
import {Table} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import userAuthService from '../../services/userAuthService';
import eventService from '../../services/eventService';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Event = () => {
    const [events, setEvents] = useState([]);
    const [isGuide, setIsGuide] = useState(true);

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const handleRemoveEvent = async (index) => {
        const eventId = events[index]._id;

        setLoading(true);
        const data = await eventService.deleteEvent(eventId);
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            return;
        }
        
        setLoading(false);
        await fetchData();
    }

    const fetchData = async () => {
        setLoading(true);
        const travelagency = userAuthService.getSavedAuthInfo();
        if (!travelagency) {
            toast.error('Unauthorized', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            history.push("/");
            return;
        }

        let data = [];
        if (travelagency.isAgency === 'guide') {
            data = await eventService.getGuidedEvents();
            setIsGuide(true);
        }
        else {
            data = await eventService.getManyEvents();
            setIsGuide(false);
        }

        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setLoading(false);
            return;
        }
        setLoading(false);
        setEvents(data.data);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
                active={loading}
                spinner={
                    <ClipLoader color={color} loading={loading} size={50} />
                }
                className="event-main-container"
            >
                <div className="event-title">All Events</div>
                <Table striped responsive className="guide-list-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Start Date</th>
                            <th>Duration</th>
                            <th>Current Users</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        events.map((event, index) => (
                            <tr key={index}>
                                <td>{event.name}</td>
                                <td>{(new Date(event.dayPlan[0]._id.date)).getDate() + "," + monthNames[(new Date(event.dayPlan[0]._id.date)).getMonth()] + " " + (new Date(event.dayPlan[0]._id.date)).getFullYear()}</td>
                                <td>{event.duration}</td>
                                <td>{event.enrolledUser.length}</td>
                                <td hidden={isGuide}>
                                    <Link to={"/event/edit/" + event._id}>
                                        <button 
                                            className="btn btn-primary"
                                        >
                                            Edit
                                        </button>
                                    </Link> &nbsp;
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleRemoveEvent(index)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                {
                    events.length === 0 ? (
                        <div className="guide-text">Currently No Events Added</div>
                    ) : null
                }
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Event;