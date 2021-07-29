import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import Lightbox from 'react-image-lightbox';
import {Image, Carousel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import MultiCarousel from "react-multi-carousel";
import {MdLocationOn, MdHotel} from 'react-icons/md';
import ReactPlayer from 'react-player';
import DayPlanCard from '../../components/DayPlanCard';
import PlaceCard from '../../components/PlaceCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import LoadingOverlay from 'react-loading-overlay';
import { toast } from 'react-toastify';

import 'react-image-lightbox/style.css';
import "./styles.css";

import tourplanService from '../../services/tourplanService';
import authService from '../../services/authService';
import userAuthService from '../../services/userAuthService';

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

const TourPlan = (props) => {

    const tourplanId = props.match.params.tourplanId;

    const [loading, setLoading] = useState(true);
    const color = "#ffffff";
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [videoURL, setVideoURL] = useState('');

    const [places, setPlaces] = useState([]);
    const [category, setCategory] = useState([]);
    const [dayPlans, setDayPlans] = useState([]);
    const [country, setCountry] = useState('');

    const [accomodationOption, setAccomodationOption] = useState([]);
    const [groupOption, setGroupOption] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isSaved, setIsSaved] = useState(false);

    const handleSavePlan = async () => {
        setLoading(true);
        const data = await tourplanService.saveTourplan(tourplanId, !isSaved);
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

    const handleDownloadPlan = async () => {
    }

    const fetchData = async () => {
        setLoading(true);
        const data = await tourplanService.getTourPlanById(tourplanId);
        if (data.status >= 300) {
            setNotFound(true);
        }
        else {
            setNotFound(false);
            setImages(data.data.imageURL);
            setVideoURL(data.data.videoURL);
            setName(data.data.name);
            setDescription(data.data.description);

            let formattedData = [];
            for (let i = 0; i < data.data.dayPlan.length; i++) {
                data.data.dayPlan[i]._id.day = "Day " + (i + 1);
                data.data.dayPlan[i]._id.isDay = true;
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

            setAccomodationOption(data.data.accomodationOption);
            setGroupOption(data.data.groupOption);
            setTotalCost(data.data.totalCost);
            setDuration(data.data.duration);

            const userId = authService.getUserId() ? authService.getUserId() : '';
            if (userId) {
                let user = await userAuthService.getProfile(authService.getUser());
                user = user.user;
                if (user.status >= 300) {
                    setIsSaved(false);
                }
                else {
                    setIsSaved(false);
                    for (const value of user.savedTourPlan) {
                        if (value._id._id.toString() === tourplanId) {
                            setIsSaved(true);
                        }
                    }
                }
            }
            else {
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
                id="content"
            >
            <>
                {
                    notFound ? (
                        <div className="tourplan-not-found">
                            Currently this tourplan is not exist
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
                                                        className="tourplan-img-container"
                                                        src={image}
                                                    />
                                                </Carousel.Item>
                                            ))
                                        }
                                    </Carousel>
                                </div>

                                <div className="col-lg-5 col-12">
                                    <div className="tourplan-title">{name}</div>
                                    <div 
                                        className="tourplan-travelagency"
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
                                        style={{
                                            lineHeight: '45px'
                                        }}
                                    >
                                        {
                                            category.map((ctg, index) => (
                                                <React.Fragment key={index}>
                                                <Link
                                                className="tourplan-category"
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
                                        className="tourplan-side-items col-6"
                                    >
                                        <strong>Tour Style: </strong>{groupOption}
                                    </div>
                                    <div 
                                        className="tourplan-side-items col-6"
                                    >
                                        <strong>Duration: </strong>{duration} Days
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
                                                    className="tourplan-cost"
                                                    >${totalCost}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br />

                            <div 
                                className="tourplan-section-title"
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
                                className="tourplan-section-title"
                            >
                                Description
                            </div>
                            <div className="tourplan-description">
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
                                className="tourplan-section-title"
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
                                className="tourplan-section-title"
                            >
                                <MdHotel style={{fontSize: "30px"}}/> &nbsp; Accomodation Options
                            </div>
                            <div>
                                {
                                    accomodationOption.map((acm, index) => (
                                        <span 
                                        key={index}
                                        className="tourplan-inclusion">{acm} &nbsp;</span> 
                                    ))
                                }
                            </div>
                            <br />
                            <br />

                            <div 
                                className="tourplan-bottom"
                            >     
                                <button 
                                    className="tourplan-enroll-button"
                                    onClick={handleSavePlan}
                                >
                                    {isSaved ? 'Unsave' : 'Save'}
                                </button>
                                <button 
                                    className="tourplan-enroll-button"
                                    onClick={handleDownloadPlan}
                                    hidden
                                >Download</button>           
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
 
export default TourPlan;