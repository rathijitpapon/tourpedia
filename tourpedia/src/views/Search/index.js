import React, {useState, useEffect} from 'react';
import Collapsible from 'react-collapsible';
import Select from 'react-select';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';

import TravelAgencyLongCard from "../../components/TravelAgencyLongCard";
import PlaceLongCard from "../../components/PlaceLongCard";
import TourPlanLongCard from "../../components/TourPlanLongCard";
import EventLongCard from '../../components/EventLongCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import categoryData from "../../assets/dummyData/category.json";
import countryData from "../../assets/dummyData/country.json";
import eventData from "../../assets/dummyData/event.json";
import tourplanData from "../../assets/dummyData/tourplan.json";
import placeData from "../../assets/dummyData/place.json";
import travelAgencyData from "../../assets/dummyData/travelagency.json";

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

const Search = (props) => {

    const searchKey = props.match.params.key;

    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [curSelection, setCurSelection] = useState("place");

    const [country, setCountry] = useState([]);
    const [countryOption, setCountryOption] = useState("");
    const [category, setCategory] = useState([]);

    const [hasMore, setHasMore] = useState(true);
    const [events, setEvents] = useState([]);
    const [tourplans, setTourplans] = useState([]);
    const [places, setPlaces] = useState([]);
    const [travelagencies, setTravelagencies] = useState([]);

    const handleCountryOptionChange = async (newValue, actionMeta) => {
        setCountryOption(newValue);
        await fetchData("country", newValue.value);
    }

    const handleCategory = async (index) => {
        const data = [...category];
        data[index] = {...category[index]};
        data[index].isSelected = !data[index].isSelected;
        setCategory(data);
        await fetchData("category", data);
    }

    const fetchData = async (dataType, inputData) => {
        console.log(dataType, inputData);
    }

    const loadData = async () => {
        console.log(searchKey);
        let data = [];
        for (const item of categoryData) {
            data.push({
                value: item.name,
                isSelected: false,
            });
        }
        setCategory(data);

        const countryOptions = [
            { value: 'All Country', label: 'All Country' }
        ];
        for (const data of countryData) {
            countryOptions.push({
                value: data.name,
                label: data.name
            });
        }
        setCountry(countryOptions);
        setCountryOption(countryOptions[0]);

        data = []
        for (let i = 0; i < 10; i++) {
            data.push(eventData[0]);
        }
        setEvents(data);

        data = [];
        for (let i = 0; i < 10; i++) {
            data.push(tourplanData[0]);
        }
        setTourplans(data);

        data = [];
        for (let i = 0; i < placeData.length; i++) {
            data.push(placeData[i]);
        }
        setPlaces(data);

        data = [];
        for (let i = 0; i < travelAgencyData.length; i++) {
            data.push(travelAgencyData[i]);
        }
        setTravelagencies(data);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = () => {
        if (curSelection === "place") {
            const data = [...places];
            for (let i = 0; i < 5; i++) {
                data.push(data[0]);
            }
            setPlaces(data);
            setHasMore(false);
        }
        if (curSelection === "event") {
            const data = [...events];
            for (let i = 0; i < 5; i++) {
                data.push(data[0]);
            }
            setEvents(data);
            setHasMore(false);
        }
        if (curSelection === "tourplan") {
            const data = [...tourplans];
            for (let i = 0; i < 5; i++) {
                data.push(data[0]);
            }
            setTourplans(data);
            setHasMore(false);
        }
        if (curSelection === "agency") {
            const data = [...travelagencies];
            for (let i = 0; i < 5; i++) {
                data.push(data[0]);
            }
            setTravelagencies(data);
            setHasMore(false);
        }
    }

    return ( 
        <LayoutWrapper>
            <br />
            <div className="row">
                <div className="col-md-3 col-12">
                    <Collapsible
                        open={isFilterOpen}
                        handleTriggerClick={() => setIsFilterOpen(!isFilterOpen)}
                        trigger={
                            <div className="event-filter-main">
                                <div>
                                    <b>Filter Options</b>
                                </div>
                                <IoIosArrowDown       
                                    className="event-filter-section-header-icon" 
                                />
                            </div>
                        }
                        triggerWhenOpen={
                            <div className="event-filter-main">
                                <div>
                                    <b>Filter Options</b>
                                </div>
                                <IoIosArrowUp           
                                    className="event-filter-section-header-icon" 
                                />
                            </div>
                        }
                    >

                        <div className="event-filter-section-header">
                            <div>
                                <b>Country</b>
                            </div>
                        </div>

                        <Select 
                            styles={customStyles}
                            className="col-12 enter-sort-container"
                            onChange={handleCountryOptionChange}
                            options={country}
                            value={countryOption}
                        />

                        <br />
                        <br />

                        <div className="event-filter-section-header">
                            <div>
                                <b>Tour Category</b>
                            </div>
                        </div>
                        {
                            category.map((item, index) => (
                                <div key={index} className="event-filter-checkbox">
                                    <input 
                                        type="checkbox"
                                        checked={item.isSelected}
                                        onChange={() => handleCategory(index)}
                                    /> {item.value}
                                </div>
                            ))
                        }
                    </Collapsible>
                </div>
                <div className="col-md-9 col-12">
                    <div className="row">
                        <div 
                            className={"col-6 col-lg-3 search-section-title " + (curSelection === "place" ? "search-selected" : "")}
                            onClick={() => {
                                setCurSelection("place");
                                setHasMore(true);
                            }}
                        >Places</div>
                        <div 
                            className={"col-6 col-lg-3 search-section-title " + (curSelection === "event" ? "search-selected" : "")}
                            onClick={() => {
                                setCurSelection("event");
                                setHasMore(true);
                            }}
                        >Events</div>
                        <div 
                            className={"col-6 col-lg-3 search-section-title " + (curSelection === "tourplan" ? "search-selected" : "")}
                            onClick={() => {
                                setCurSelection("tourplan");
                                setHasMore(true);
                            }}
                        >Tour Plan</div>
                        <div 
                            className={"col-6 col-lg-3 search-section-title " + (curSelection === "agency" ? "search-selected" : "")}
                            onClick={() => {
                                setCurSelection("agency");
                                setHasMore(true);
                            }}
                        >Travel Agencies</div>
                    </div>

                    <br />

                    {
                        curSelection === "place" ? (
                            places.map((place, index) => (
                                <PlaceLongCard
                                    key={index}
                                    place={place}
                                />
                            ))
                        ) : null
                    }

                    {
                        curSelection === "event" ? (
                            events.map((event, index) => (
                                <EventLongCard
                                    key={index}
                                    event={event}
                                />
                            ))
                        ) : null
                    }

                    {
                        curSelection === "tourplan" ? (
                            tourplans.map((tourplan, index) => (
                                <TourPlanLongCard
                                    key={index}
                                    tourplan={tourplan}
                                />
                            ))
                        ) : null
                    }  

                    {
                        curSelection === "agency" ? (
                            travelagencies.map((travelagency, index) => (
                                <TravelAgencyLongCard
                                    key={index}
                                    travelagency={travelagency}
                                />
                            ))
                        ) : null
                    }  

                    {
                        hasMore ? (
                            <button
                                className="btn btn-primary event-load-more"
                                onClick={handleLoadMore}
                            >Load More...</button>
                        ) : null
                    }
                </div>
            </div>

            <br />
            <br />
        </LayoutWrapper>
     );
}
 
export default Search;