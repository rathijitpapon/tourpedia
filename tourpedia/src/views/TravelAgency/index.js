import React, {useState, useEffect} from 'react';
import {Image} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay'

import EventLongCard from "../../components/EventLongCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import travelagencyService from "../../services/travelagencyService";

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
                            <div className="profile-my-items">
                                Running Events
                            </div>
                            
                            <br />

                            {
                                events.map((event, index) => (
                                    <EventLongCard
                                        key={index}
                                        event={event}
                                    />
                                ))
                            }
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