import React, {useState, useEffect} from 'react';
import Carousel from "react-multi-carousel";
import {Image} from 'react-bootstrap';

import PlaceCard from '../../components/PlaceCard';
import TravelAgencyCard from '../../components/TravelAgencyCard';
import BlogCard from '../../components/BlogCard';
import EventCard from '../../components/EventCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "react-multi-carousel/lib/styles.css";
import "./styles.css";

import categoryData from "../../assets/dummyData/category.json";
import placeData from "../../assets/dummyData/place.json";
import eventData from "../../assets/dummyData/event.json";
import travelAgencyData from "../../assets/dummyData/travelagency.json";
import blogData from "../../assets/dummyData/blog.json";

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

    const [isFound, setIsFound] = useState(true);
    const [category, setCategory] = useState(param);
    const [description, setDescription] = useState("");
    const [banner, setBanner] = useState("");

    const [places, setPlaces] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [events, setEvents] = useState([]);
    const [travelagencies, setTravelagencies] = useState([]);

    const fetchData = async () => {

        let valid = false;

        for (const ctg of categoryData) {
            if (param && param.toLowerCase() === ctg.name.toLowerCase()) {
                valid = true;
                setCategory(ctg.name);
                setDescription(ctg.description);
                setBanner(ctg.banner);
            }
        }
        setIsFound(valid);

        setPlaces(placeData);
        setTravelagencies(travelAgencyData);

        let data = [];
        for (let i = 0; i < 10; i++) {
            data.push(eventData[0]);
        }
        setEvents(data);

        data = [];
        for (let i = 0; i < 10; i++) {
            data = [...data, ...blogData];
        }
        setBlogs(data);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
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

                <div className="category-details-section-title">
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

                <div className="category-details-section-title">
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

                <br />

                <div className="category-details-section-title">
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

                <div className="category-details-section-title">
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
        </LayoutWrapper>
     );
}
 
export default CategoryDetails;