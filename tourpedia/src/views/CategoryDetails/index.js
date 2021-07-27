import React, {useState, useEffect} from 'react';
import Carousel from "react-multi-carousel";
import {Image} from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';

import PlaceCard from '../../components/PlaceCard';
import TravelAgencyCard from '../../components/TravelAgencyCard';
import BlogCard from '../../components/BlogCard';
import EventCard from '../../components/EventCard';
import TourPlanCard from "../../components/TourPlanCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "react-multi-carousel/lib/styles.css";
import "./styles.css";

import exploreService from "../../services/exploreService";

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

const CategoryDetails = (props) => {
    const param = props.match.params.categoryName ? props.match.params.categoryName : "";

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const [isFound, setIsFound] = useState(true);
    const [category, setCategory] = useState(param);
    const [description, setDescription] = useState("");
    const [banner, setBanner] = useState("");

    const [places, setPlaces] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [events, setEvents] = useState([]);
    const [travelagencies, setTravelagencies] = useState([]);
    const [tourplans, setTourplans] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        let data = await exploreService.getExploreByName(param, 'category');
        if (data.status >= 300) {
            setIsFound(false);
        } else {
            setIsFound(true);

            let formattedData = [];
            for (let i = 0; i < data.data.place.length; i++) {
                formattedData.push(data.data.place[i]._id);
            }
            setPlaces(formattedData);

            formattedData = [];
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
            for (let i = 0; i < data.data.travelAgency.length; i++)  {
                formattedData.push(data.data.travelAgency[i]._id);
            }
            setTravelagencies(formattedData);

            formattedData = [];
            for (let i = 0; i < data.data.tourPlan.length; i++)  {
                formattedData.push(data.data.tourPlan[i]._id);
            }
            setTourplans(formattedData);

            setCategory(data.data.name);
            setDescription(data.data.description);
            setBanner(data.data.banner);
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
                isFound ? (
                <>
                <div className="category-details-title">{category ? category : ""}</div>
                <br />
                {
                    banner ? (
                        <Image 
                            src={banner}
                            className="category-details-banner-image"
                        />
                    ) : null
                }
                
                <div className="category-details-text">
                    {description ? (
                        description.split("\n").map((line, index) => (
                            <div 
                                style={{
                                    marginBottom: '15px'
                                }}
                                key={index}
                            >
                                {line}
                            </div>
                        ))
                    ) : ""}
                </div>
                <br />

                <div
                    hidden={places.length === 0}
                    className="category-details-section-title">
                    Popular Places For {category ? category : ""}
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    places.map((place, index) => (
                        <PlaceCard 
                            key={index}
                            place={place}
                        />
                    ))
                }
                </Carousel>

                <br />

                <div
                    hidden={events.length === 0} 
                    className="category-details-section-title">
                    Top Tour Events For {category ? category : ""}
                </div>
                <Carousel
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
                </Carousel>

                <div
                    hidden={tourplans.length === 0}   
                    className="country-details-section-title">
                    Top Tour Plans For {category ? category : ""}
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    tourplans.map((event, index) => (
                        <TourPlanCard 
                            key={index}
                            event={event}
                        />
                    ))
                }
                </Carousel>

                <br />

                <div
                    hidden={travelagencies.length === 0}  
                    className="category-details-section-title">
                    Travel Agencies
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    travelagencies.map((travelagency, index) => (
                        <TravelAgencyCard 
                            key={index}
                            travelagency={travelagency}
                        />
                    ))
                }
                </Carousel>

                <br />

                <div 
                    hidden={blogs.length === 0}  
                    className="category-details-section-title">
                    Popular Blogs About {category ? category : ""}
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    blogs.map((blog, index) => (
                        <div
                            key={index}
                        >
                            <BlogCard 
                                blog={blog}
                            />
                        </div>
                    ))
                }
                </Carousel>
                </>
            ): (
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                >
                    No Such Category Found
                </div>
            )}
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default CategoryDetails;