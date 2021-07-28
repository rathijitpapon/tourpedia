import React, {useEffect, useState} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import Lightbox from 'react-image-lightbox';
import {Image, Carousel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {MdLocationOn} from 'react-icons/md';
import ReactPlayer from 'react-player';
import LoadingOverlay from 'react-loading-overlay';
import MultiCarousel from 'react-multi-carousel';

import TourPlanCard from '../../components/TourPlanCard';
import EventCard from '../../components/EventCard';
import BlogCard from '../../components/BlogCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";


import exploreService from "../../services/exploreService";
import pediaService from '../../services/pediaService';

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
    const param = props.match.params.placeName ? props.match.params.placeName : "";

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [videoURL, setVideoURL] = useState("");

    const [place, setPlace] = useState(param);
    const [country, setCountry] = useState("");
    const [description, setDescription] = useState("");

    const [events, setEvents] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [tourplans, setTourplans] = useState([]);
    const [categories, setCategories] = useState([]);

    const [areas, setAreas] = useState([]);
    const [foods, setFoods] = useState([]);

    const [curSelection, setCurSelection] = useState("area");

    const fetchData = async () => {
        setLoading(true);
        let data = await exploreService.getExploreByName(param, 'place');
        if (data.status >= 300) {
            setNotFound(true);
        } else {
            const pediaData = await pediaService.getPediaById(data.data.pedia._id);
            if (pediaData.status >= 300) {
                setNotFound(true);
            } else {
                setNotFound(false);

                let formattedData = [];
                for (let i = 0; i < data.data.blog.length; i++)  {
                    formattedData.push(data.data.blog[i]._id);
                }
                setBlogs(formattedData);

                formattedData = [];
                for (let i = 0; i < data.data.event.length; i++)  {
                    formattedData.push(data.data.event[i]._id);
                }
                setEvents(formattedData);

                formattedData = [];
                for (let i = 0; i < data.data.tourPlan.length; i++)  {
                    formattedData.push(data.data.tourPlan[i]._id);
                }
                setTourplans(formattedData);

                formattedData = [];
                for (let i = 0; i < data.data.category.length; i++)  {
                    formattedData.push(data.data.category[i]._id);
                }
                setCategories(formattedData);

                setPlace(data.data.name);
                setCountry(data.data.country._id.name);
                setDescription(data.data.description);

                setImages([data.data.banner, ...pediaData.data.imageURL]);
                setVideoURL(pediaData.data.videoURL);
                setAreas(pediaData.data.area);
                setFoods(pediaData.data.food);
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
                <div>
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
                                        className="event-details-title">{place}
                                    </div>
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
                                    <br />
                                    <div
                                        style={{
                                            lineHeight: '45px'
                                        }}
                                    >
                                        {
                                            categories.map((ctg, index) => (
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
                                About {place}
                            </div>
                            <div
                                style={{
                                    fontSize: "18px",
                                }}
                                className="event-details-description">
                                {description}
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
                                url={videoURL}
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
                                areas.map((area, index) => (
                                    <div
                                        key={index}
                                        className="place-details-area-container"
                                    >
                                        <div        
                                            className="place-details-area-title"
                                        >
                                            {area._id.name}
                                        </div>
                                        <div className="row">
                                        <div className="col-12">
                                        <Carousel
                                            fade prevIcon={null} 
                                            nextIcon={null}
                                        >
                                            {
                                                area._id.imageURL.map((image, index) => (
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
                                            {area._id.description}
                                        </div>
                                    </div>
                                ))
                            } 
                            </> ): null}

                            {
                            curSelection === "food" ? (
                            <>
                            {
                                foods.map((food, index) => (
                                    <div
                                        key={index}
                                        className="place-details-area-container"
                                    >
                                        <div        
                                            className="place-details-area-title"
                                        >
                                            {food._id.name}
                                        </div>
                                        <div className="row">
                                        <div className="col-12">
                                        <Carousel
                                            fade prevIcon={null} 
                                            nextIcon={null}
                                        >
                                            {
                                                food._id.imageURL.map((image, index) => (
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
                                            {food._id.description}
                                        </div>
                                    </div>
                                ))
                            } 
                            </> ): null}

                            <br />

                            <div
                                hidden={events.length === 0}   
                                className="country-details-section-title">
                                Top Tour Events Happening in {place ? place : ""}
                            </div>
                            <MultiCarousel
                                responsive={responsive}
                            >
                            {
                                events.map((event, index) => (
                                    <EventCard 
                                        key={index}
                                        event={event}
                                    />
                                ))
                            }
                            </MultiCarousel>

                            <div
                                hidden={tourplans.length === 0}   
                                className="country-details-section-title">
                                Top Tour Plans of {place ? place : ""}
                            </div>
                            <MultiCarousel
                                responsive={responsive}
                            >
                            {
                                tourplans.map((tourplan, index) => (
                                    <TourPlanCard 
                                        key={index}
                                        tourplan={tourplan}
                                    />
                                ))
                            }
                            </MultiCarousel>

                            <br />

                            <div 
                                hidden={blogs.length === 0}  
                                className="category-details-section-title">
                                Popular Blogs of {place ? place : ""}
                            </div>
                            <MultiCarousel
                                responsive={responsive}
                            >
                            {
                                blogs.map((blog, index) => (
                                    <div
                                        key={index}
                                        className="all-small-card-height"
                                    >
                                        <BlogCard 
                                            blog={blog}
                                        />
                                    </div>
                                ))
                            }
                            </MultiCarousel>

                            <br />
                            <br />
                        </div>
                    )
                }
            </div>
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default PlaceDetails;