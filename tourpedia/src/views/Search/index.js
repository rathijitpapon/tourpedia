import React, {useState, useEffect} from 'react';
import Collapsible from 'react-collapsible';
import Select from 'react-select';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';
import {toast} from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';

import TravelAgencyLongCard from "../../components/TravelAgencyLongCard";
import PlaceLongCard from "../../components/PlaceLongCard";
import TourPlanLongCard from "../../components/TourPlanLongCard";
import EventLongCard from '../../components/EventLongCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import fixedFilters from "../../assets/fixedFilters.json";

import exploreService from "../../services/exploreService";
import eventService from "../../services/eventService";
import tourplanService from "../../services/tourplanService";
import travelagencyService from "../../services/travelagencyService";
import authService from "../../services/authService";
import userAuthService from "../../services/userAuthService";

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

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const searchKey = props.match.params.key;

    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [curSelection, setCurSelection] = useState("place");

    const [country, setCountry] = useState([]);
    const [countryOption, setCountryOption] = useState("");
    const [category, setCategory] = useState([]);

    const [hasMore, setHasMore] = useState(false);
    const [events, setEvents] = useState([]);
    const [tourplans, setTourplans] = useState([]);
    const [places, setPlaces] = useState([]);
    const [travelagencies, setTravelagencies] = useState([]);

    const searchData = (placeData, planData,eventData, agencyData) => {
        let filteredData = [];
        for (const data of placeData) {
            if (data.name.toLowerCase().includes(searchKey.toLowerCase())) {
                filteredData.push(data);
            }
        }
        setPlaces(filteredData);

        filteredData = [];
        for (const data of planData) {
            if (data.name.toLowerCase().includes(searchKey.toLowerCase())) {
                filteredData.push(data);
            }
        }
        setTourplans(filteredData);

        filteredData = [];
        for (const data of eventData) {
            if (data.name.toLowerCase().includes(searchKey.toLowerCase())) {
                filteredData.push(data);
            }
        }
        setEvents(filteredData);

        filteredData = [];
        for (const data of agencyData) {
            if (data.fullname.toLowerCase().includes(searchKey.toLowerCase())) {
                filteredData.push(data);
            }
        }
        setTravelagencies(filteredData);
    }

    const getDataFromAPI = async (categoryData, countryData) => {
        setLoading(true);
        let data = await exploreService.getManyPlaces(categoryData, countryData);
        if (data.status >= 300) {
            toast.error(data.message, {
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
        const placeData = data.data;

        data = await travelagencyService.getManyTravelAgency(categoryData);
        if (data.status >= 300) {
            toast.error(data.message, {
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
        const agencyData = data.data;

        const queryMatcher = {
            durationSort: 1,
            costSort: 1,
            participantSort: 1,
            date: [new Date('2000-01-01'), new Date('2100-01-01')],
            roomSize: [1, 100],
            accomodationQuality: [1, 100],
            groupOption: fixedFilters.tourStyle,
            inclusion: fixedFilters.inclusion,
            childAllowed: false,
            physicalRating: fixedFilters.physicalRating,
            accomodationOption: fixedFilters.accomodationOption,
            participantLimit: [1, 100000000],
            duration: [1, 100000000],
            age: [1, 1000],
            cost: [1, 10000000000000],
            category: categoryData,
            country: countryData,
            place: [],
            limit: 10000000000,
            skip: 0,
        };

        data = await eventService.getManyEvents(queryMatcher);
        if (data.status >= 300) {
            toast.error(data.message, {
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
        for (let i = 0; i < data.data.length; i++) {
            const userId = authService.getUserId() ? authService.getUserId() : '';
            if (userId) {
                let user = await userAuthService.getProfile(authService.getUser());
                user = user.user;
                if (user.status >= 300) {
                    data.data[i].isEnrolled = false;
                    data.data[i].isSaved = false;
                }
                else {
                    data.data[i].isEnrolled = false;
                    for (const value of data.data[i].enrolledUser) {
                        if (value._id.toString() === userId) {
                            data.data[i].isEnrolled = true;
                        }
                    }
                    data.data[i].isSaved = false;
                    for (const value of user.savedEvent) {
                        if (value._id._id.toString() === data.data[i]._id) {
                            data.data[i].isSaved = true;
                        }
                    }
                }
            }
            else {
                data.data[i].isEnrolled = false;
                data.data[i].isSaved = false;
            }
        }
        const eventData = data.data;

        data = await tourplanService.getManyTourPlans(queryMatcher);
        if (data.status >= 300) {
            toast.error(data.message, {
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
        const planData = data.data;

        setLoading(false);
        searchData(placeData, planData, eventData, agencyData);
    }

    const handleCountryOptionChange = async (newValue, actionMeta) => {
        setCountryOption(newValue);

        const countryData = [];
        if (newValue.id !== "-1") {
            countryData.push(newValue.id);
        }

        const categoryData = [];
        for (const ctg of category) {
            if (ctg.isSelected) {
                categoryData.push(ctg.id);
            }
        }

        await getDataFromAPI(categoryData, countryData);
    }

    const handleCategory = async (index) => {
        const data = [...category];
        data[index] = {...category[index]};
        data[index].isSelected = !data[index].isSelected;
        setCategory(data);

        const countryData = [];
        if (countryOption.id !== "-1") {
            countryData.push(countryOption.id);
        }

        const categoryData = [];
        for (const ctg of data) {
            if (ctg.isSelected) {
                categoryData.push(ctg.id);
            }
        }

        await getDataFromAPI(categoryData, countryData);
    }

    const handleSaveEvent = async (index) => {
        setLoading(true);
        const data = await eventService.saveEvent(events[index]._id, !events[index].isSaved);
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

        const eventData = events;
        eventData[index].isSaved = !eventData[index].isSaved;
        setEvents(eventData);
        setLoading(false);
    }

    const handleEnrollEvent = async (index) => {
        setLoading(true);
        const data = await eventService.enrollEvent(events[index]._id, !events[index].isEnrolled);
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

        const eventData = events;
        eventData[index].isEnrolled = !eventData[index].isEnrolled;
        setEvents(eventData);
        setLoading(false);
    }

    const loadData = async () => {
        setLoading(true);
        let data = await exploreService.getAllExplore('country');
        if (data.status >= 300) {
            toast.error(data.message, {
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
        data = data.data;
        let formattedData = [
            { value: 'All Country', label: 'All Country', id: '-1' }
        ];
        for (const coun of data) {
            formattedData.push({
                value: coun.name,
                label: coun.name,
                name: coun.name,
                description: coun.description,
                banner: coun.banner,
                id: coun._id,
            });
        }
        setCountry(formattedData);
        setCountryOption(formattedData[0]);

        data = await exploreService.getAllExplore('category');
        if (data.status >= 300) {
            toast.error(data.message, {
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
        data = data.data;
        formattedData = [];
        for (const coun of data) {
            formattedData.push({
                value: coun.name,
                label: coun.name,
                name: coun.name,
                description: coun.description,
                banner: coun.banner,
                id: coun._id,
                isSelected: false,
            });
        }
        setCategory(formattedData);
        setLoading(false);

        getDataFromAPI([], []);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey]);

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
            <LoadingOverlay
                active={loading}
                spinner={
                    <ClipLoader color={color} loading={loading} size={50} />
                }
                className="loading-height"
            >
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
                                setHasMore(false);
                            }}
                        >Places</div>
                        <div 
                            className={"col-6 col-lg-3 search-section-title " + (curSelection === "event" ? "search-selected" : "")}
                            onClick={() => {
                                setCurSelection("event");
                                setHasMore(false);
                            }}
                        >Events</div>
                        <div 
                            className={"col-6 col-lg-3 search-section-title " + (curSelection === "tourplan" ? "search-selected" : "")}
                            onClick={() => {
                                setCurSelection("tourplan");
                                setHasMore(false);
                            }}
                        >Tour Plan</div>
                        <div 
                            className={"col-6 col-lg-3 search-section-title " + (curSelection === "agency" ? "search-selected" : "")}
                            onClick={() => {
                                setCurSelection("agency");
                                setHasMore(false);
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
                                    index={index}
                                    handleSaveEvent={handleSaveEvent}
                                    handleEnrollEvent={handleEnrollEvent}
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
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Search;