import React, {useEffect, useState} from 'react';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import Lightbox from 'react-image-lightbox';
import {Image, Carousel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import MultiCarousel from "react-multi-carousel";
import {MdLocationOn} from 'react-icons/md';
import ReactPlayer from 'react-player';

import TourPlanCard from '../../components/TourPlanCard';
import EventCard from '../../components/EventCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import eventData from "../../assets/dummyData/event.json";
import tourplanData from "../../assets/dummyData/tourplan.json";
import pediaData from "../../assets/dummyData/pedia.json";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

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

const PlaceDetails = (props) => {

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState([]);

    const [pedia, setPedia] = useState("");
    const [tourplan, setTourPlan] = useState([]);
    const [event, setEvent] = useState([]);

    const [curSelection, setCurSelection] = useState("area");

    const fetchData = async () => {
        let isFound = false;

        // await new Promise(resolve => setTimeout(resolve, 2000));
        setPedia(pediaData);

        setTourPlan([...tourplanData, ...tourplanData, ...tourplanData, ...tourplanData, ...tourplanData, ...tourplanData, ...tourplanData, ...tourplanData, ...tourplanData, ...tourplanData]);

        setEvent([...eventData, ...eventData, ...eventData, ...eventData, ...eventData, ...eventData, ...eventData, ...eventData, ...eventData, ...eventData]);

        setImages([pediaData.place.banner, ...pediaData.imageURL]);

        setNotFound(isFound);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
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
                                    There is No Such Place
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
                                                                className="place-details-image-container"
                                                                src={image}
                                                            />
                                                        </Carousel.Item>
                                                    ))
                                                }
                                            </Carousel>
                                        </div>
                                        <div className="col-lg-5 col-12">
                                            <div
                                                style={{
                                                    fontSize: "35px",
                                                }}
                                                className="event-details-title">{pedia.place.name}
                                            </div>
                                            <div 
                                                className="event-details-travelagency"
                                            >
                                                <MdLocationOn
                                                    style={{
                                                        fontSize: '22px',
                                                    }}
                                                /> <Link 
                                                    to={"/country/" + pedia.country.name}
                                                >
                                                    <strong>{pedia.country.name}</strong>
                                                </Link>
                                            </div>
                                            <br />
                                            <div
                                                style={{
                                                    lineHeight: '45px'
                                                }}
                                            >
                                               {
                                                   pedia.category.map((ctg, index) => (
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
                                        </div>
                                    </div>

                                    <br />

                                    <div 
                                        style={{
                                            fontSize: "22px",
                                        }}
                                        className="event-details-section-title"
                                    >
                                        About {pedia.place.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "18px",
                                        }}
                                        className="event-details-description">
                                        {pedia.place.description}
                                    </div>

                                    <br />
                                    <br />

                                    <ReactPlayer
                                        style={{
                                            display: 'block',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                        width={"90%"}
                                        controls
                                        url={pedia.videoURL}
                                    />

                                    <br />
                                    <br />

                                    <div
                                        className="place-details-selection-container"
                                    >
                                        <div 
                                            className={"place-details-section-title " + (curSelection === "area" ? "place-details-section-selected" : "")}
                                            onClick={() => {
                                                setCurSelection("area");
                                            }}
                                        >Places To Visit</div>
                                        <div 
                                            className={"place-details-section-title " + (curSelection === "food" ? "place-details-section-selected" : "")}
                                            onClick={() => {
                                                setCurSelection("food");
                                            }}
                                        >Top Food Items</div>
                                    </div>

                                    <br />
                                    <br />

                                    {
                                    curSelection === "area" ? (
                                    <>
                                    {
                                        pedia.area.map((area, index) => (
                                            <div
                                                key={index}
                                                className="place-details-area-container"
                                            >
                                                <div        
                                                    className="place-details-area-title"
                                                >
                                                    {area.name}
                                                </div>
                                                <div className="row">
                                                <div className="col-12">
                                                <Carousel
                                                    fade prevIcon={null} 
                                                    nextIcon={null}
                                                >
                                                    {
                                                        area.imageURL.map((image, index) => (
                                                            <Carousel.Item 
                                                                interval={5000} 
                                                                key={index}
                                                            >
                                                                <Image
                                                                    className="place-details-area-image"
                                                                    src={image}
                                                                />
                                                            </Carousel.Item>
                                                        ))
                                                    }
                                                </Carousel>
                                                </div>
                                                </div>
                                                <div        
                                                    className="place-details-area-description"
                                                >
                                                    {area.description}
                                                </div>
                                            </div>
                                        ))
                                    } 
                                    </> ): null}

                                    {
                                    curSelection === "food" ? (
                                    <>
                                    {
                                        pedia.food.map((food, index) => (
                                            <div
                                                key={index}
                                                className="place-details-area-container"
                                            >
                                                <div        
                                                    className="place-details-area-title"
                                                >
                                                    {food.name}
                                                </div>
                                                <div className="row">
                                                <div className="col-12">
                                                <Carousel
                                                    fade prevIcon={null} 
                                                    nextIcon={null}
                                                >
                                                    {
                                                        food.imageURL.map((image, index) => (
                                                            <Carousel.Item 
                                                                interval={5000} 
                                                                key={index}
                                                            >
                                                                <Image
                                                                    className="place-details-area-image"
                                                                    src={image}
                                                                />
                                                            </Carousel.Item>
                                                        ))
                                                    }
                                                </Carousel>
                                                </div>
                                                </div>
                                                <div        
                                                    className="place-details-area-description"
                                                >
                                                    {food.description}
                                                </div>
                                            </div>
                                        ))
                                    } 
                                    </> ): null}

                                    <br />

                                    <div className="country-details-section-title">
                                        Tour Plans For {pedia.place.name}
                                    </div>
                                    <MultiCarousel
                                        responsive={responsive}
                                    >
                                    {
                                        tourplan.map((plan, index) => (
                                            <TourPlanCard 
                                                key={index}
                                                tourplan={plan}
                                            />
                                        ))
                                    }
                                    </MultiCarousel>

                                    <br />

                                    <div className="country-details-section-title">
                                        Top Tour Events Happening Near {pedia.place.name}
                                    </div>
                                    <MultiCarousel
                                        responsive={responsive}
                                    >
                                    {
                                        event.map((ev, index) => (
                                            <EventCard 
                                                key={index}
                                                event={ev}
                                            />
                                        ))
                                    }
                                    </MultiCarousel>

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
 
export default PlaceDetails;