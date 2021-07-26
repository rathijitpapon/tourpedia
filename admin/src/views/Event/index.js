import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';
import {Table} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import fixedFilters from "../../assets/fixedFilters.json";
import eventService from "../../services/eventService";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Event = () => {
    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const [events, setEvents] = useState([]);

    const handleBanEvent = async (index, isBanned) => {
        const eventId = events[index]._id;

        setLoading(true);
        const data = await eventService.changeBanEvent(eventId, isBanned);
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

    const handleApproveEvent = async (index, isApproved) => {
        const eventId = events[index]._id;

        setLoading(true);
        const data = await eventService.changeApproveEvent(eventId, isApproved);
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

        const queryMatcher = {
            durationSort: 1,
            costSort: 1,
            participantSort: 1,
            date: [new Date('2000-01-01'), new Date('2100-01-01')],
            roomSize: [1, 100],
            accomodationQuality: [1, 100],
            groupOption: fixedFilters.groupOption,
            inclusion: fixedFilters.inclusion,
            childAllowed: false,
            physicalRating: fixedFilters.physicalRating,
            accomodationOption: fixedFilters.accomodationOption,
            participantLimit: [1, 100000000],
            duration: [1, 100000000],
            age: [1, 1000],
            cost: [1, 10000000000000],
            category: [],
            country: [],
            place: [],
            limit: 10000000000,
            skip: 0,
        };

        const data = await eventService.getManyEvents(queryMatcher);
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
        
        setEvents(data.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
                active={loading}
                spinner={
                    <ClipLoader color={color} loading={loading} size={50} />
                }
                className="plan-main-container"
            >
            <div className="event-title">All Events</div>
                <Table striped responsive className="plan-list-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Start Date</th>
                            <th>Duration</th>
                            <th>Current Users</th>
                            <th>Approval Status</th>
                            <th>Ban Status</th>
                            <th>Actions</th>
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
                                <td>{event.isApproved ? "Approved" : "Pending"}</td>
                                <td>{event.isBanned ? "Banned" : "Not Banned"}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleApproveEvent(index, !event.isApproved)}
                                    >
                                        {event.isApproved ? "Disapprove" : "Approve"}
                                    </button> &nbsp;
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => handleBanEvent(index, !event.isBanned)}
                                    >
                                        {event.isBanned ? "Allow" : "Ban"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                {
                    events.length === 0 ? (
                        <div className="plan-text">Currently No Events Added</div>
                    ) : null
                }
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Event;