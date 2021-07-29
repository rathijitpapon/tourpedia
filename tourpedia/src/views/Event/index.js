import React, {useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";
import Select from 'react-select';
import {Modal, Fade, Backdrop} from '@material-ui/core';
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';

import PlanMyHoliday from '../../components/PlanMyHoliday';
import Filter from '../../components/EventFilter';
import EventLongCard from '../../components/EventLongCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from "../../services/exploreService";
import eventService from "../../services/eventService";
import authService from "../../services/authService";
import userAuthService from "../../services/userAuthService";

import fixedFilters from "../../assets/fixedFilters.json";

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

const defaultFilters = {
    durationSort: -1,
    costSort: -1,
    participantSort: -1,
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
    category: [],
    country: [],
    place: [],
    limit: 10000000000,
    skip: 0,
}

const Event = () => {

    const location = useLocation();
    const [currentDate, setCurrentDate] = useState(new Date());

    const [loading, setLoading] = useState(true);
    const color = "#ffffff";

    const options = [
        { value: 'Most Popular', label: 'Most Popular' },
        { value: 'Longest Duration' , label: 'Longest Duration'},
        { value: 'Shortest Duration' , label: 'Shortest Duration'},
        { value: 'Highest Price' , label: 'Highest Price'},
        { value: 'Lowest Price' , label: 'Lowest Price'},
    ];
    const [sortOption, setSortOption] = useState(options[0]);
    const [countryOption, setCountryOption] = useState("");
    const [placeOption, setPlaceOption] = useState("");

    const [country, setCountry] = useState([]);
    const [place, setPlace] = useState([]);
    const [allCountryPlaceData, setAllCountryPlaceData] = useState([]);

    const [events, setEvents] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    const [openPlanModal, setOpenPlanModal] = useState(false);
    const [filters, setFilters] = useState(defaultFilters);

    const handleSortOptionChange = async (newValue, actionMeta) => {
        setSortOption(newValue);
        const filterData = {...filters};

        if (newValue.value === "Most Popular") {
            filterData.participantSort = -1;
        }
        if (newValue.value === "Longest Duration") {
            filterData.durationSort = -1;
        }
        if (newValue.value === "Shortest Duration") {
            filterData.durationSort = 1;
        }
        if (newValue.value === "Highest Price") {
            filterData.costSort = -1;
        }
        if (newValue.value === "Lowest Price") {
            filterData.costSort = 1;
        }

        await getDataFromAPI(filterData);
    };

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

    const getDataFromAPI = async (filterData) => {
        setLoading(true);
        setFilters(filterData);

        let data = await eventService.getManyEvents(filterData);
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
        data = data.data;
        setEvents(data);
        setLoading(false);
    }

    const handleCountryOptionChange = async (newValue, actionMeta, hasData, givenData) => {
        setCountryOption(newValue);
        const placeOptions = [{ value: 'All Place', label: 'All Place', id: '-1' }];
        let cpData = allCountryPlaceData;
        if (hasData) {
            cpData = givenData;
        }
        for (const data of cpData) {
            if (data.name === newValue.value) {
                for (const placeData of data.place) {
                    placeOptions.push({
                        value: placeData._id.name,
                        label: placeData._id.name,
                        id: placeData._id._id,
                    });
                }
                break;
            }
        }
        setPlace(placeOptions);
        setPlaceOption(placeOptions[0]);

        const filterData = {...filters};
        filterData.country = newValue.id === '-1' ? [] : [newValue.id];
        filterData.place = [];

        await getDataFromAPI(filterData);
    }

    const handlePlaceOptionChange = async (newValue, action) => {
        setPlaceOption(newValue);

        const filterData = {...filters};
        filterData.place = [newValue.id];

        await getDataFromAPI(filterData);
    }

    const fetchData = async () => {
        setLoading(true);
        let data = await exploreService.getAllExplore("country");
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 4000,
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
        setAllCountryPlaceData(data);

        const formattedData = [{
            value: "All Country",
            label: "All Country",
            id: "-1"
        }];
        for (const country of data) {
            formattedData.push({
                value: country.name,
                label: country.name,
                id: country._id,
            });
        }
        setCountry(formattedData);
        setCountryOption(formattedData[0]);

        setPlace([{ value: 'All Place', label: 'All Place' }]);
        setPlaceOption({ value: 'All Place', label: 'All Place' });

        if (location.state) {
            handleCountryOptionChange({
                value: location.state.country,
                label: location.state.country,
                id: location.state.id,
            }, '', true, data);
            setCurrentDate(new Date(location.state.minDate));
        }
        else {
            await getDataFromAPI(defaultFilters);
            setLoading(false);
        }
    }

    const handlePlanModal = (val) => {
        setOpenPlanModal(val);
    }

    const applyFilter = async (inputFilters) => {
        const filterData = {...filters};
        filterData.accomodationOption = inputFilters.accomodation.length > 0 ? inputFilters.accomodation : fixedFilters.accomodationOption;
        filterData.inclusion = inputFilters.inclusion.length > 0 ? inputFilters.inclusion : fixedFilters.inclusion;
        filterData.physicalRating = inputFilters.physical.length > 0 ? inputFilters.physical : fixedFilters.physicalRating;
        filterData.groupOption = inputFilters.tourStyle.length > 0 ? inputFilters.tourStyle : fixedFilters.tourStyle;
        filterData.age = [inputFilters.minAge, inputFilters.maxAge];
        filterData.cost = [inputFilters.minCost, inputFilters.maxCost];
        filterData.date = [new Date(inputFilters.minDate), new Date(inputFilters.maxDate)];
        filterData.duration = [inputFilters.minDuration, inputFilters.maxDuration];
        filterData.participantLimit = [inputFilters.minParticipants, inputFilters.maxParticipants];
        filterData.roomSize = [inputFilters.minRoomSize, inputFilters.maxRoomSize];
        filterData.childAllowed = inputFilters.childAllowed;

        let minQuality = 1, maxQuality = 100;
        for (const value of inputFilters.quality) {
            minQuality = Math.min(minQuality, +value);
            maxQuality = Math.max(maxQuality, +value);
        }
        filterData.accomodationQuality = [minQuality, maxQuality];

        await getDataFromAPI(filterData);
    }

    const handleLoadMore = () => {
        const data = [...events];
        for (let i = 0; i < 5; i++) {
            data.push(data[0]);
        }

        setEvents(data);
        setHasMore(false);
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
            <div className="event-title">
                Top Events
            </div>
            <div className="enter-description">
                The world is a book and those who do not travel read only one page. <br /> Explore the top tour events here & find your suitable one.
            </div>

            <div className="container">
                <button 
                    className="btn btn-secondary event-plan-button"
                    onClick={() => setOpenPlanModal(true)}
                >
                    Plan My Holiday
                </button>
            </div>

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

            <br />
            <div className="container">
                <Select 
                    styles={customStyles}
                    className="col-md-4 col-12 enter-sort-container"
                    onChange={handleCountryOptionChange}
                    options={country}
                    value={countryOption}
                />
                <Select 
                    styles={customStyles}
                    className="col-md-4 col-12 enter-sort-container"
                    onChange={handlePlaceOptionChange}
                    options={place}
                    value={placeOption}
                />
                <Select 
                    styles={customStyles}
                    className="col-md-4 col-12 enter-sort-container"
                    onChange={handleSortOptionChange}
                    options={options}
                    value={sortOption}
                />
            </div>

            <br />
            <br />

            <div className="row">
                <div className="col-md-3 col-12">
                    <Filter 
                        applyFilter={applyFilter}
                        currentDate={{
                            value: currentDate.toISOString().split('T')[0],
                            label: monthNames[currentDate.getMonth()] + ", " + currentDate.getFullYear(),
                        }}
                    />
                </div>
                <div className="col-md-9 col-12">
                    {
                        events.map((event, index) => (
                            <EventLongCard
                                key={index}
                                event={event}
                                index={index}
                                handleSaveEvent={handleSaveEvent}
                                handleEnrollEvent={handleEnrollEvent}
                            />
                        ))
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

            <br /><br />
            <br /><br />
            <br />
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default Event;