import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import Lightbox from 'react-image-lightbox';
import {Image, Carousel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import MultiCarousel from "react-multi-carousel";
import {MdLocationOn, MdHotel} from 'react-icons/md';
import {BiCheckCircle} from 'react-icons/bi';
import {GiCancel} from 'react-icons/gi';
import ReactPlayer from 'react-player';
import {Modal, Fade, Backdrop} from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';
import {toast} from 'react-toastify';

import DayPlanCard from '../../components/DayPlanCard'
import PlanMyHoliday from '../../components/PlanMyHoliday';
import PlaceCard from '../../components/PlaceCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import 'react-image-lightbox/style.css';
import "./styles.css";

import fixedFilters from "../../assets/fixedFilters.json";

import eventService from "../../services/eventService";
import userAuthService from "../../services/userAuthService";
import authService from "../../services/authService";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1000 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1000, min: 800 },
        items: 3
    },
    miniTablet: {
        breakpoint: { max: 800, min: 600 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1
    }
}

const EventDetails = (props) => {

    const eventId = props.match.params.eventId;

    const [loading, setLoading] = useState(true);
    const color = "#ffffff";
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [videoURL, setVideoURL] = useState('');
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [places, setPlaces] = useState([]);
    const [category, setCategory] = useState([]);
    const [dayPlans, setDayPlans] = useState([]);
    const [country, setCountry] = useState('');

    const [inclusion, setInclusion] = useState([]);
    const [accomodationOption, setAccomodationOption] = useState([]);
    const [groupOption, setGroupOption] = useState('');
    const [physicalRating, setPhysicalRating] = useState('');
    const [childAllowed, setChildAllowed] = useState(false);
    const [age, setAge] = useState([1, 100]);
    const [totalCost, setTotalCost] = useState(0);
    const [possibleAdditionalCost, setPossibleAdditionalCost] = useState(0);
    const [participantLimit, setParticipantLimit] = useState(0);
    const [enrolledUserCount, setEnrolledUserCount] = useState(0);
    const [travelAgencyUserName, setTravelAgencyUserName] = useState('');
    const [travelAgencyFullname, setTravelAgencyFullname] = useState('');

    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [openPlanModal, setOpenPlanModal] = useState(false);

    const handlePlanModal = (val) => {
        setOpenPlanModal(val);
    }

    const handleSaveEvent = async () => {
        setLoading(true);
        const data = await eventService.saveEvent(eventId, !isSaved);
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

        setIsSaved(!isSaved);
        setLoading(false);
    }

    const handleEnrollEvent = async () => {
        setLoading(true);
        const data = await eventService.enrollEvent(eventId, !isEnrolled);
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

        setIsEnrolled(!isEnrolled);
        setLoading(false);
    }

    const fetchData = async () => {
        setLoading(true);
        const data = await eventService.getEventById(eventId);
        if (data.status >= 300) {
            setNotFound(true);
        }
        else {
            setNotFound(false);
            setImages(data.data.imageURL);
            setVideoURL(data.data.videoURL);
            setName(data.data.name);
            setDescription(data.data.description);

            let start = new Date(data.data.dayPlan[0]._id.date);
            let end = new Date(data.data.dayPlan[data.data.dayPlan.length - 1]._id.date);
            setStartDate(start.getDate() + " " + monthNames[start.getMonth()] + ", " + start.getFullYear());
            setEndDate(end.getDate() + " " + monthNames[end.getMonth()] + ", " + end.getFullYear());

            let formattedData = [];
            for (let i = 0; i < data.data.dayPlan.length; i++) {
                formattedData.push(data.data.dayPlan[i]._id);
            }
            setDayPlans(formattedData);

            formattedData = [];
            for (let i = 0; i < data.data.place.length; i++) {
                formattedData.push(data.data.place[i]._id);
            }
            setPlaces(formattedData);

            formattedData = [];
            for (let i = 0; i < data.data.category.length; i++) {
                formattedData.push(data.data.category[i]._id);
            }
            setCategory(formattedData);

            setCountry(data.data.country._id.name);

            setInclusion(data.data.inclusion);
            setAccomodationOption(data.data.accomodationOption);
            setGroupOption(data.data.groupOption);
            setPhysicalRating(data.data.physicalRating);
            setChildAllowed(data.data.childAllowed);
            setAge([data.data.minimumAge, data.data.maximumAge]);
            setTotalCost(data.data.totalCost);
            setPossibleAdditionalCost(data.data.possibleAdditionalCost);
            setParticipantLimit(data.data.participantLimit);
            setTravelAgencyFullname(data.data.travelAgency._id.fullname);
            setTravelAgencyUserName(data.data.travelAgency._id.username);
            setEnrolledUserCount(data.data.enrolledUser.length);

            const userId = authService.getUserId() ? authService.getUserId() : '';
            if (userId) {
                let user = await userAuthService.getProfile(authService.getUser());
                user = user.user;
                if (user.status >= 300) {
                    setIsEnrolled(false);
                    setIsSaved(false);
                }
                else {
                    setIsEnrolled(false);
                    for (const value of data.data.enrolledUser) {
                        if (value._id.toString() === userId) {
                            setIsEnrolled(true);
                        }
                    }
                    setIsSaved(false);
                    for (const value of user.savedEvent) {
                        if (value._id._id.toString() === eventId) {
                            setIsSaved(true);
                        }
                    }
                }
            }
            else {
                setIsEnrolled(false);
                setIsSaved(false);
            }
            
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
            <>
                {
                    notFound ? (
                        <div className="event-details-not-found">
                            Currently this event is not exist or it is a private event
                        </div>
                    ) : (
                        <div>
                            <br />
                            {isImageOpen && (
                                <Lightbox
                                    mainSrc={images[imageIndex]}
                                    nextSrc={images[(imageIndex + 1) % images.length]}
                                    prevSrc={images[(imageIndex + images.length - 1) % images.length]}
                                    onCloseRequest={() => setImageOpen(false)}
                                    onMovePrevRequest={() =>
                                        setImageIndex(
                                            (imageIndex + images.length - 1) % images.length
                                        )
                                    }
                                    onMoveNextRequest={() =>
                                        setImageIndex(
                                            (imageIndex + 1) % images.length
                                        )
                                    }
                                />
                            )}

                            <Modal
                                open={openPlanModal}
                                onClose={() => setOpenPlanModal(false)}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                                <Fade in={openPlanModal}>
                                    <div className="event-plan-modal-body">
                                        <PlanMyHoliday 
                                            handlePlanModal={handlePlanModal}
                                        />
                                    </div>
                                </Fade>
                            </Modal>

                            <div className="row">
                                <div 
                                    className="col-lg-7 col-12"
                                    style={{
                                        marginBottom: '20px'
                                    }}
                                >
                                    <Carousel
                                        activeIndex={imageIndex}
                                        onSelect={(selectedIndex, e) => {
                                            setImageIndex(selectedIndex);
                                        }}
                                        fade prevIcon={null} 
                                        nextIcon={null}
                                    >
                                        {
                                            images.map((image, index) => (
                                                <Carousel.Item 
                                                    interval={5000} 
                                                    key={index}
                                                >
                                                    <Image
                                                        onClick={() => setImageOpen(true)}
                                                        className="event-details-img-container"
                                                        src={image}
                                                    />
                                                </Carousel.Item>
                                            ))
                                        }
                                    </Carousel>
                                </div>

                                <div className="col-lg-5 col-12">
                                    <div className="event-details-title">{name}</div>
                                    <div 
                                        className="event-details-travelagency"
                                    >
                                        <MdLocationOn
                                            style={{
                                                fontSize: '22px',
                                            }}
                                        /> <Link 
                                            to={"/country/" + country}
                                        >
                                            <strong>{country}</strong>
                                        </Link>
                                    </div>
                                    <div 
                                        className="event-details-travelagency"
                                    >
                                        Hosted By <Link 
                                            to={"/agency/" + travelAgencyUserName}
                                        >
                                            <strong>{travelAgencyFullname}</strong>
                                        </Link>
                                    </div>
                                    <div className="event-details-date">
                                        <strong>{startDate}</strong> To <strong>{endDate}</strong>
                                    </div>
                                    <div
                                        style={{
                                            lineHeight: '45px'
                                        }}
                                    >
                                        {
                                            category.map((ctg, index) => (
                                                <React.Fragment key={index}>
                                                <Link
                                                className="event-details-category"
                                                to={"/category/" + ctg.name}
                                                >
                                                {ctg.name}
                                                </Link> &nbsp; </React.Fragment>
                                            ))
                                        }
                                    </div>

                                    <br />

                                    <div 
                                        className="row"
                                        style={{
                                            marginBottom: "10px",
                                        }}
                                    >
                                    <div 
                                        className="event-details-side-items col-6"
                                    >
                                        <strong>Tour Style: </strong>{groupOption}
                                    </div>
                                    <div 
                                        className="event-details-side-items col-6"
                                    >
                                        <strong>Max Participants: </strong>{participantLimit}
                                    </div>
                                    <div 
                                        className="event-details-side-items col-6"
                                    >
                                        <strong>Physical Rating: </strong>{physicalRating}
                                    </div>
                                    <div 
                                        className="event-details-side-items col-6"
                                    >
                                        <strong>Age Limit: </strong>{age[0]} to {age[1]}
                                    </div>
                                    <div 
                                        className="event-details-side-items col-6"
                                    >
                                        <strong>Child Allowance: </strong>{childAllowed ? "Yes" : "No"}
                                    </div>
                                    <div 
                                        className="event-details-side-items col-6"
                                    >
                                        <strong>Currently Enrolled: </strong>{enrolledUserCount}
                                    </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-6">
                                            <span
                                                style={{
                                                    fontSize: "18px",
                                                    fontWeight: "bold",
                                                }}
                                                >Total Cost</span>
                                                <div style={{
                                                    fontSize: "20px",
                                                }}>
                                                US <strong 
                                                    className="event-details-cost"
                                                    >${totalCost}
                                                </strong>
                                            </div>
                                        </div>
                                        <div 
                                            className="event-details-side-items col-6"
                                        >
                                            <strong>Possible Extra Cost: </strong>US ${possibleAdditionalCost}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br />

                            <div 
                                className="event-details-section-title"
                            >
                                Destinations For This Tour
                            </div>
                            <MultiCarousel
                                responsive={responsive}
                            >
                            {
                                places.map((plc, index) => (
                                    <PlaceCard 
                                        key={index}
                                        place={plc}
                                    />
                                ))
                            }
                            </MultiCarousel>

                            <br />

                            <div 
                                className="event-details-section-title"
                            >
                                Description
                            </div>
                            <div className="event-details-description">
                                {description}
                            </div>

                            <br />

                            <ReactPlayer
                                style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                                width={"90%"}
                                controls
                                url={videoURL}
                            />

                            <br />
                            <br />

                            <div 
                                className="event-details-section-title"
                                style={{
                                    marginBottom: "20px",
                                }}
                            >
                                Day Plan
                            </div>
                            {
                                dayPlans.map((plan, index) => (
                                    <DayPlanCard
                                        key={index}
                                        dayPlan={plan}
                                    />
                                ))
                            }

                            <br />
                            
                            <div 
                                className="event-details-section-title"
                            >
                                Inclusions
                            </div>
                            <div>
                                {
                                    fixedFilters.inclusion.map((inc, index) => (
                                        <div 
                                            key={index}
                                            className="event-details-inclusion"
                                        >
                                            {
                                                inclusion.includes(inc) ? <BiCheckCircle style={{fontSize: "28px"}}/> : <GiCancel style={{fontSize: "28px"}}/>
                                            } &nbsp; {inc}
                                        </div>
                                    ))
                                }
                            </div>

                            <br />

                            <div 
                                className="event-details-section-title"
                            >
                                <MdHotel style={{fontSize: "30px"}}/> &nbsp; Accomodation Options
                            </div>
                            <div>
                                {
                                    accomodationOption.map((acm, index) => (
                                        <span 
                                        key={index}
                                        className="event-details-inclusion">{acm} &nbsp;</span> 
                                    ))
                                }
                            </div>
                            <br />
                            <br />

                            <div className="event-details-bottom">
                                <div className="event-details-plan-button-wrapper"
                                onClick={() => handlePlanModal(true)}
                                >
                                    <button className="event-details-plan-button">Plan My Holiday</button>
                                </div>
                                
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end'
                                    }}
                                >
                                    <button 
                                        className="event-details-save-button"
                                        onClick={handleSaveEvent}
                                    >{isSaved ? 'Unsave' : 'Save'}</button>
                                    <button 
                                        className="event-details-enroll-button"
                                        onClick={handleEnrollEvent}
                                    >{isEnrolled ? 'Leave' : 'Enroll'}</button>
                                </div>
                            </div>

                            <br />
                            <br />
                        </div>
                    )
                }
            </>
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default EventDetails;