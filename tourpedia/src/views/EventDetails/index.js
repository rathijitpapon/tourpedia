import React, {useState, useEffect} from 'react';
import { css } from "@emotion/react";
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

import PlanMyHoliday from '../../components/PlanMyHoliday';
import PlaceCard from '../../components/PlaceCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import 'react-image-lightbox/style.css';
import "./styles.css";

import eventData from "../../assets/dummyData/event.json";
import fixedFilters from "../../assets/fixedFilters.json";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

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

    const eventName = props.match.params.eventName;
    // const agencyName = props.match.params.agencyName;

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const [event, setEvent] = useState({});
    const [images, setImages] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [openPlanModal, setOpenPlanModal] = useState(false);

    const handlePlanModal = (val) => {
        setOpenPlanModal(val);
    }

    const handleSaveEvent = () => {

    }

    const handleEnrollEvent = () => {

    }

    const fetchData = async () => {
        let isFound = false;

        const splitted = eventName.split('-');
        for (const data of eventData) {
            if (data.id === splitted[splitted.length - 1]) {
                isFound = true;
                setEvent(data);

                setImages([data.banner, ...data.imageURL]);

                let start = new Date(data.dayPlan[0].date);
                let end = new Date(data.dayPlan[data.dayPlan.length - 1].date);
                setStartDate(start.getDate() + " " + monthNames[start.getMonth()] + ", " + start.getFullYear());
                setEndDate(end.getDate() + " " + monthNames[end.getMonth()] + ", " + end.getFullYear());

                break;
            }
        }

        // await new Promise(resolve => setTimeout(resolve, 2000));

        setNotFound(!isFound);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            {
                loading ? (
                    <div className="sweet-loading brief-details-spinner">
                        <ClipLoader color={"#ffffff"} loading={loading} css={override} size={150} />
                    </div>
                ) : (
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
                                            <div className="event-details-title">{event.name}</div>
                                            <div 
                                                className="event-details-travelagency"
                                            >
                                                <MdLocationOn
                                                    style={{
                                                        fontSize: '22px',
                                                    }}
                                                /> <Link 
                                                    to={"/country/" + event.country.name}
                                                >
                                                 <strong>{event.country.name}</strong>
                                                </Link>
                                            </div>
                                            <div 
                                                className="event-details-travelagency"
                                            >
                                                Hosted By <Link 
                                                    to={"/agency/" + event.travelAgency.username}
                                                >
                                                 <strong>{event.travelAgency.fullname}</strong>
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
                                                   event.category.map((ctg, index) => (
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
                                                <strong>Tour Style: </strong>{event.groupOption}
                                            </div>
                                            <div 
                                                className="event-details-side-items col-6"
                                            >
                                                <strong>Max Participants: </strong>{event.participantLimit}
                                            </div>
                                            <div 
                                                className="event-details-side-items col-6"
                                            >
                                                <strong>Physical Rating: </strong>{event.physicalRating}
                                            </div>
                                            <div 
                                                className="event-details-side-items col-6"
                                            >
                                                <strong>Age Limit: </strong>{event.minimumAge} to {event.maximumAge}
                                            </div>
                                            <div 
                                                className="event-details-side-items col-6"
                                            >
                                                <strong>Child Allowance: </strong>{event.childAllowed ? "Yes" : "No"}
                                            </div>
                                            <div 
                                                className="event-details-side-items col-6"
                                            >
                                                <strong>Currently Enrolled: </strong>{event.enrolledUserCount}
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
                                                            >${event.totalCost}
                                                        </strong>
                                                    </div>
                                                </div>
                                                <div 
                                                    className="event-details-side-items col-6"
                                                >
                                                    <strong>Possible Extra Cost: </strong>US ${event.possibleAdditionalCost}
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
                                        event.place.map((plc, index) => (
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
                                        {event.description}
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
                                        url={event.videoURL}
                                    />

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
                                                        event.inclusion.includes(inc) ? <BiCheckCircle style={{fontSize: "28px"}}/> : <GiCancel style={{fontSize: "28px"}}/>
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
                                            event.accomodationOption.map((acm, index) => (
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
                                            >Save</button>
                                            <button 
                                                className="event-details-enroll-button"
                                                onClick={handleEnrollEvent}
                                            >Enroll</button>
                                        </div>
                                    </div>

                                    <br />
                                    <br />
                                </div>
                            )
                        }
                    </>
                )
            }
        </LayoutWrapper>
     );
}
 
export default EventDetails;