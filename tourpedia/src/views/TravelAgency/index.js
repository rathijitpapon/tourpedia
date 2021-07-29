import React, {useState, useEffect} from 'react';
import {Image} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay'
import {toast} from 'react-toastify';
import EventLongCard from "../../components/EventLongCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import travelagencyService from "../../services/travelagencyService";
import eventService from "../../services/eventService";
import authService from "../../services/authService";
import userAuthService from "../../services/userAuthService";

const TravelAgency = (props) => {
    const agencyName = props.match.params.agencyName;

    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const [fullname, setFullname] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isBanned, setIsBanned] = useState(false);
    const [about, setAbout] = useState('');
    const [hasUser, setHasUser] = useState(false);

    const [events, setEvents] = useState([]);

    const handleSaveEvent = async (index) => {
        setLoading(true);
        const data = await eventService.saveEvent(events[index]._id, !events[index].isSaved);
        if (data.status >= 300) {
            toast.error("You are not logged in. Please Login to save the event.", {
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

        const eventData = events;
        eventData[index].isSaved = !eventData[index].isSaved;
        setEvents(eventData);
        setLoading(false);
    }

    const handleEnrollEvent = async (index) => {
        setLoading(true);
        const data = await eventService.enrollEvent(events[index]._id, !events[index].isEnrolled);
        if (data.status >= 300) {
            toast.error("You are not logged in. Please Login to enroll in the event.", {
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

        const eventData = events;
        eventData[index].isEnrolled = !eventData[index].isEnrolled;
        setEvents(eventData);
        setLoading(false);
    }

    const fetchData = async () => {
        setLoading(true);
        let data = await travelagencyService.getProfile(agencyName, 'agency');
        if (data.status >= 300) {
            setHasUser(false);
        }
        else if (data.user.isBanned) {
            setIsBanned(true);
            setHasUser(true);
        }
        else {
            setAbout(data.user.about);
            setProfileImage(data.user.profileImage);
            setFullname(data.user.fullname);
            let formattedData = [];
            for (let i = 0; i < data.user.event.length; i++) {
                const userId = authService.getUserId() ? authService.getUserId() : '';
                if (userId) {
                    let user = await userAuthService.getProfile(authService.getUser());
                    user = user.user;
                    if (user.status >= 300) {
                        data.user.event[i]._id.isEnrolled = false;
                        data.user.event[i]._id.isSaved = false;
                    }
                    else {
                        data.user.event[i]._id.isEnrolled = false;
                        for (const value of data.user.event[i]._id.enrolledUser) {
                            if (value._id.toString() === userId) {
                                data.user.event[i]._id.isEnrolled = true;
                            }
                        }
                        data.user.event[i]._id.isSaved = false;
                        for (const value of user.savedEvent) {
                            if (value._id._id.toString() === data.user.event[i]._id._id) {
                                data.user.event[i]._id.isSaved = true;
                            }
                        }
                    }
                }
                else {
                    data.user.event[i]._id.isEnrolled = false;
                    data.user.event[i]._id.isSaved = false;
                }

                formattedData.push(data.user.event[i]._id);
            }
            setEvents(formattedData);
            setHasUser(true);
            setIsBanned(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
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
                className="loading-height"
            >
            {
                hasUser ? (
                    <div className="profile-main-wrapper">
                    {
                        !isBanned ? (
                            <>
                            <div className="profile-main-container">
                                <Image className="profile-image-container" src={profileImage} roundedCircle />
                                <div>
                                    <div 
                                        className="profile-fullname-container"
                                    >{fullname}</div>
                                    <div 
                                        className="profile-about-container"
                                    >{about}</div>
                                </div>
                            </div>
                            <br /><br />
                            <div className="profile-my-items" hidden={events.length === 0}>
                                Running Events
                            </div>
                            
                            <br />

                            {
                                events.map((event, index) => (
                                    <EventLongCard
                                        key={index}
                                        event={event}
                                        index={index}
                                        handleSaveEvent={handleSaveEvent}
                                        handleEnrollEvent={handleEnrollEvent}
                                    />
                                ))
                            }

                            <div className="profile-no-data-text" hidden={events.length > 0}>This Travel Agency Has No Running Events</div>
                            </>
                        ) : (
                            <div className="profile-fullname-container" style={{ textAlign: 'center' }}>This user is banned</div>
                        )
                    }
                    </div>
                ) : (
                    <div className="profile-fullname-container" style={{ textAlign: 'center' }}>No user exists with this username</div>
                )
            }
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default TravelAgency;