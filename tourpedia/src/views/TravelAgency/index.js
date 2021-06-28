import React, {useState, useEffect} from 'react';
import {Image} from 'react-bootstrap';

import EventLongCard from "../../components/EventLongCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import eventData from "../../assets/dummyData/event.json";
import travelAgencyData from "../../assets/dummyData/travelagency.json";

const TravelAgency = (props) => {
    const agencyName = props.match.params.agencyName;

    const [isFetched, setIsFetched] = useState(false);
    const [fullname, setFullname] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isBanned, setIsBanned] = useState(false);
    const [about, setAbout] = useState('');
    const [hasUser, setHasUser] = useState(false);

    const [events, setEvents] = useState([]);

    const fetchData = async () => {
        for (const agency of travelAgencyData) {
            if (agency.username === agencyName) {
                setAbout(agency.about);
                setProfileImage(agency.profileImage);
                setFullname(agency.fullname);
                setEvents(eventData);
                setHasUser(true);
                setIsFetched(true);
                setIsBanned(false);
                return;
            }
        }
        
        setHasUser(false);
        setIsFetched(true);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            {
                isFetched ? (
                    <React.Fragment>
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
                    </React.Fragment>
                ) : null
            }
        </LayoutWrapper>
     );
}
 
export default TravelAgency;