import React, {useState, useEffect} from 'react';
import { useLocation } from "react-router-dom";
import Select from 'react-select';
import {Modal, Fade, Backdrop} from '@material-ui/core';

import PlanMyHoliday from '../../components/PlanMyHoliday';
import Filter from '../../components/EventFilter';
import EventLongCard from '../../components/EventLongCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import countryData from "../../assets/dummyData/country.json";
import eventData from "../../assets/dummyData/event.json";

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

const Event = () => {

    const location = useLocation();
    const [currentDate, setCurrentDate] = useState(new Date());

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
    const [hasMore, setHasMore] = useState(true);

    const [openPlanModal, setOpenPlanModal] = useState(false);

    const handleSortOptionChange = (newValue, actionMeta) => {
        setSortOption(newValue);
    };

    const handleCountryOptionChange = (newValue, actionMeta) => {
        setCountryOption(newValue);
        const placeOptions = [{ value: 'All Place', label: 'All Place' }];
        for (const data of allCountryPlaceData) {
            if (data.name === newValue.value) {
                for (const placeData of data.place) {
                    placeOptions.push({
                        value: placeData.name,
                        label: placeData.name
                    })
                }
                break;
            }
        }
        setPlace(placeOptions);
        setPlaceOption(placeOptions[0]);
    }

    const handlePlaceOptionChange = (newValue, action) => {
        setPlaceOption(newValue);
    }

    const fetchData = async () => {
        setAllCountryPlaceData(countryData);

        const placeOptions = [
            { value: 'All Country', label: 'All Country' }
        ];
        for (const data of countryData) {
            placeOptions.push({
                value: data.name,
                label: data.name
            });
        }
        setCountry(placeOptions);
        setCountryOption(placeOptions[0]);

        if (location.state) {
            setCountryOption({
                value: location.state.country,
                label: location.state.country
            });
            setCurrentDate(new Date(location.state.minDate));
        }

        setPlace([{ value: 'All Place', label: 'All Place' }]);
        setPlaceOption({ value: 'All Place', label: 'All Place' });

        const data = []
        for (let i = 0; i < 10; i++) {
            data.push(eventData[0]);
        }
        setEvents(data);
    }

    const handlePlanModal = (val) => {
        setOpenPlanModal(val);
    }

    const applyFilter = async (filters) => {
        console.log(filters);
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

            <br />
            <br />
        </LayoutWrapper>
     );
}
 
export default Event;