import React, {useState, useEffect} from 'react';
import {Image} from 'react-bootstrap';
import Select from 'react-select';
import {Modal, Fade, Backdrop} from '@material-ui/core';
import Carousel from "react-multi-carousel";
import {useHistory} from 'react-router-dom';

import PlaceCard from '../../components/PlaceCard';
import CountryCard from '../../components/CountryCard';
import TravelAgencyCard from '../../components/TravelAgencyCard';
import EventCard from '../../components/EventCard';
import CategoryCard from '../../components/CategoryCard';
import BlogCard from '../../components/BlogCard';
import PlanMyHoliday from '../../components/PlanMyHoliday';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import placeData from "../../assets/dummyData/place.json";
import categoryData from "../../assets/dummyData/category.json";
import eventData from "../../assets/dummyData/event.json";
import travelAgencyData from "../../assets/dummyData/travelagency.json";
import countryData from "../../assets/dummyData/country.json";
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

const customStyles = {
    control: base => ({
        ...base,
        backgroundColor: '#f7efef',
        borderColor: '#821616',
        borderWidth: '2px',
        height: '50px',
    }),
    menu: provided => ({ ...provided, zIndex: 9999 })
};

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Home = () => {

    const history = useHistory();

    const dateRange = [];
    let timestamps = new Date();
    for (let i = 0; i < 24; i++) {
        timestamps.setDate(1);
        dateRange.push({
            value: timestamps.toISOString().split('T')[0],
            label: monthNames[timestamps.getMonth()] + ", " + timestamps.getFullYear(),
        });
        timestamps.setMonth(timestamps.getMonth() + 1);
    }

    const [countryOptions, setCountryOptions] = useState([]);
    const [countryOption, setCountryOption] = useState("");
    const months = dateRange;
    const [monthOption, setMonthOption] = useState(dateRange[0]);

    const [blogs, setBlogs] = useState([]);
    const [events, setEvents] = useState([]);
    const [travelagencies, setTravelagencies] = useState([]);
    const [countries, setCountries] = useState([]);
    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    const handlePlanModal = (val) => {
        setOpenModal(val);
    }

    const handlePlaceChange = (newValue, action) => {
        setCountryOption(newValue);
    }

    const hanldeMonthChange = async (newValue, actionMeta) => {
        setMonthOption(newValue);
    }

    const handleSearch = () => {
        history.push({
            pathname: '/event',
            state: {
                minDate: monthOption.value,
                country: countryOption.value, 
            }
        })
    }

    const backgroundImage = "https://www.planetware.com/wpimages/2019/12/nepal-in-pictures-beautiful-places-to-photograph-annapurna-range.jpg";

    const fetchData = async () => {
        let data = [];

        for (let i = 0; i < countryData.length; i++) {
            data.push({
                value: countryData[i].name,
                label: countryData[i].name,
            });
        }
        setCountryOptions(data);
        setCountryOption(data[0]);

        setPlaces(placeData);
        setCountries(countryData);
        setTravelagencies(travelAgencyData);
        setEvents(eventData);
        setCategories(categoryData);

        data = [];
        for (let i = 0; i < 10; i++) {
            data = [...data, ...blogData];
        }
        setBlogs(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div>
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openModal}>
                        <div className="event-plan-modal-body">
                            <PlanMyHoliday 
                                handlePlanModal={handlePlanModal}
                            />
                        </div>
                    </Fade>
                </Modal>

                <Image
                    src={backgroundImage}
                    className="home-header-img" 
                    alt="home img"
                />

                <div className="home-main-container">
                    <div className="home-header-title">
                        Tour Pedia
                    </div>
                    <div className="home-header-description">
                        Explore Different Places & Categories. Search, Compare & Join Our Events.
                    </div>

                    <div 
                        className="btn btn-secondary home-header-plan-button"
                        onClick={() => handlePlanModal(true)}
                    >
                        Plan My Modal
                    </div>

                    <div className="home-header-search-options">
                        <Select 
                            styles={customStyles}
                            className="col-md-4 col-12 enter-sort-container"
                            onChange={handlePlaceChange}
                            options={countryOptions}
                            value={countryOption}
                        />
                        <Select 
                            styles={customStyles}
                            className="col-md-4 col-12 enter-sort-container"
                            onChange={hanldeMonthChange}
                            options={months}
                            value={monthOption}
                        />
                        <div 
                            className="btn btn-primary home-header-search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </div>
                    </div>
                </div>

                <br /><br />
                
                <div className="home-section-title">
                    Top Events
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    events.map((event, index) => (
                        <div
                            key={index}
                        >
                            <EventCard 
                                event={event}    
                            />
                        </div>
                    ))
                }
                </Carousel>

                <br />

                <div className="home-section-title">
                    Places To Visit
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    places.map((place, index) => (
                        <div
                            key={index}
                        >
                            <PlaceCard 
                                place={place}
                            />
                        </div>
                    ))
                }
                </Carousel>

                <br />

                <div className="home-section-title">
                    Tour Categories
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    categories.map((category, index) => (
                        <div
                            key={index}
                        >
                            <CategoryCard 
                                category={category}
                            />
                        </div>
                    ))
                }
                </Carousel>

                <br />

                <div className="home-section-title">
                    Countries To Visit
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    countries.map((country, index) => (
                        <div
                            key={index}
                        >
                            <CountryCard 
                                country={country}
                            />
                        </div>
                    ))
                }
                </Carousel>

                <br />

                <div className="home-section-title">
                    Well Known Travel Agencies
                </div>
                <Carousel
                    responsive={responsive}
                >
                {
                    travelagencies.map((travelagency, index) => (
                        <div
                            key={index}
                        >
                            <TravelAgencyCard 
                                travelagency={travelagency}
                            />
                        </div>
                    ))
                }
                </Carousel>

                <br />

                <div className="home-section-title">
                    Recent Tour Blogs
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

                <br /><br /><br />
            </div>
        </LayoutWrapper>
     );
}
 
export default Home;