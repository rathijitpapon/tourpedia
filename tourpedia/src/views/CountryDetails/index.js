import React, {useState, useEffect} from 'react';
import Carousel from "react-multi-carousel";
import {Image} from 'react-bootstrap';

import PlaceCard from '../../components/PlaceCard';
import TravelAgencyCard from '../../components/TravelAgencyCard';
import EventCard from '../../components/EventCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "react-multi-carousel/lib/styles.css";
import "./styles.css";

import countryData from "../../assets/dummyData/country.json";
import eventData from "../../assets/dummyData/event.json";
import travelAgencyData from "../../assets/dummyData/travelagency.json";

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

const CountryDetails = (props) => {
    const param = props.match.params.countryName ? props.match.params.countryName : "";

    const [isFound, setIsFound] = useState(true);
    const [country, setCountry] = useState(param);
    const [description, setDescription] = useState("");
    const [banner, setBanner] = useState("");

    const [places, setPlaces] = useState([]);
    const [events, setEvents] = useState([]);
    const [travelagencies, setTravelagencies] = useState([]);

    const fetchData = async () => {

        let valid = false;
        let data = [];

        for (const ctg of countryData) {
            if (param && param.toLowerCase() === ctg.name.toLowerCase()) {
                valid = true;
                setCountry(ctg.name);
                setDescription(ctg.description);
                setBanner(ctg.banner);
                data = [...data, ...ctg.place];
            }
        }
        setIsFound(valid);
        setPlaces(data);

        setTravelagencies(travelAgencyData);

        data = [];
        for (let i = 0; i < 10; i++) {
            data.push(eventData[0]);
        }
        setEvents(data);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            {
                isFound ? (
                <>
                <div className="country-details-title">{country ? country : ""}</div>
                <br />
                {
                    banner ? (
                        <Image 
                            src={banner}
                            className="country-details-banner-image"
                        />
                    ) : null
                }
                
                <div className="country-details-text">
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

                <div className="country-details-section-title">
                    Popular Places of {country ? country : ""}
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

                <div className="country-details-section-title">
                    Top Tour Events Happening in {country ? country : ""}
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

                <div className="country-details-section-title">
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
                </>
            ): (
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                    }}
                >
                    No Such Country Found
                </div>
            )}
        </LayoutWrapper>
     );
}
 
export default CountryDetails;