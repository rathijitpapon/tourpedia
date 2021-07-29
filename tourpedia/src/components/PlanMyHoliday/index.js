import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {ImCross} from 'react-icons/im';
import {BsArrowLeft} from 'react-icons/bs';
import { Range } from 'rc-slider';
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay'

import TourPlanLongCard from "../../components/TourPlanLongCard";

import 'rc-slider/assets/index.css';
import "./styles.css";

import fixedFilters from "../../assets/fixedFilters.json";
import exploreService from "../../services/exploreService";
import tourplanService from "../../services/tourplanService";
import authService from '../../services/authService';
import userAuthService from '../../services/userAuthService';

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

const PlanMyHoliday = (props) => {

    const [loading, setLoading] = useState(false);
    const color = "#ffffff";

    const handlePlanModal = props.handlePlanModal;
    const dateRange = [];
    let timestamps = new Date();
    for (let i = 0; i < 24; i++) {
        dateRange.push({
            value: timestamps.toISOString().split('T')[0],
            label: monthNames[timestamps.getMonth()] + ", " + timestamps.getFullYear(),
        });
        timestamps.setMonth(timestamps.getMonth() + 1);
    }

    const [minDate, setMinDate] = useState(dateRange);
    const [maxDateOption, setMaxDateOption] = useState(dateRange[0]);
    const [minDateOption, setMinDateOption] = useState(dateRange[dateRange.length - 1]);

    const [category, setCategory] = useState([]);
    const [tourStyle, setTourStyle] = useState([]);
    const [accomodation, setAccomodation] = useState([]);
    const [duration, setDuration] = useState([1, 60]);
    const [cost, setCost] = useState([1, 10000]);

    const [tourplans, setTourplans] = useState([]);

    const handleSaveTourplan = async (index) => {
        const data = await tourplanService.saveTourplan(tourplans[index]._id, !tourplans[index].isSaved);
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
            return;
        }

        const tourplanData = tourplans;
        tourplanData[index].isSaved = !tourplanData[index].isSaved;
        setTourplans(tourplanData);
    }

    const handleMaxDate = (newValue, actionMeta) => {
        setMaxDateOption(newValue);
        setMinDateOption(dateRange[dateRange.length - 1]);

        let index = 0;
        for (let i = 0; i < dateRange.length; i++) {
            if (dateRange[i].value === newValue.value) {
                index = i;
                break;
            }
        }
        setMinDate(dateRange.slice(index));
    }

    const handleMinDate = (newValue, actionMeta) => {
        setMinDateOption(newValue);
    }

    const handleCategory = async (index) => {
        const data = [...category];
        data[index] = {...category[index]};
        data[index].isSelected = !data[index].isSelected;
        setCategory(data);
    }

    const handleTourStyle = async (index) => {
        const data = [...tourStyle];
        data[index] = {...tourStyle[index]};
        data[index].isSelected = !data[index].isSelected;
        setTourStyle(data);
    }

    const handleAccomodation = async (index) => {
        const data = [...accomodation];
        data[index] = {...accomodation[index]};
        data[index].isSelected = !data[index].isSelected;
        setAccomodation(data);
    }

    const loadData = async () => {
        let data = [];
        for (const item of fixedFilters.tourStyle) {
            data.push({
                value: item,
                isSelected: false,
            });
        }
        setTourStyle(data);

        data = [];
        for (const item of fixedFilters.accomodationOption) {
            data.push({
                value: item,
                isSelected: false,
            });
        }
        setAccomodation(data);
    }

    const[curPage, setCurPage] = useState(1);

    const [countryOption, setCountryOption] = useState("");
    const [placeOption, setPlaceOption] = useState([]);

    const [country, setCountry] = useState([]);
    const [place, setPlace] = useState([]);
    const [allCountryPlaceData, setAllCountryPlaceData] = useState([]);

    const handleCountryOptionChange = (newValue, actionMeta) => {
        setCountryOption(newValue);
        const placeOptions = [];
        for (const data of allCountryPlaceData) {
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
        setPlaceOption([placeOptions[0]]);
    }

    const handlePlaceOptionChange = (newValue, action) => {
        setPlaceOption(newValue);
    }

    const handleFetchTourplans = async () => {

        const countryData = countryOption.id === "-1" ? [] : [countryOption.id];
        const categoryData = [];
        for (const ctg of category) {
            if (ctg.isSelected) {
                categoryData.push(ctg.id); 
            }
        }
        const placeData = [];
        for (const plc of placeOption) {
            placeData.push(plc.id);
        }

        let tourStyleData = [];
        for (const tst of tourStyle) {
            if (tst.isSelected) {
                tourStyleData.push(tst.value);
            }
        }
        if (tourStyleData.length === 0) {
            tourStyleData = fixedFilters.tourStyle;
        }

        let accomationData = [];
        for (const acc of accomodation) {
            if (acc.isSelected) {
                accomationData.push(acc.value);
            }
        }
        if (accomationData.length === 0) {
            accomationData = fixedFilters.accomodationOption;
        }

        const queryMatcher = {
            durationSort: duration,
            costSort: 1,
            participantSort: 1,
            date: [new Date(minDateOption.value), new Date(maxDateOption.value)],
            roomSize: [1, 100],
            accomodationQuality: [1, 100],
            groupOption: tourStyleData,
            inclusion: fixedFilters.inclusion,
            childAllowed: false,
            physicalRating: fixedFilters.physicalRating,
            accomodationOption: accomationData,
            participantLimit: [1, 100000000],
            duration: duration,
            age: [1, 1000],
            cost: cost,
            category: categoryData,
            country: countryData,
            place: placeData,
            limit: 10000000000,
            skip: 0,
        };
        queryMatcher.date[0].setDate(1);
        queryMatcher.date[1].setMonth(queryMatcher.date[1].getMonth() + 1);
        queryMatcher.date[1].setDate(1);
        queryMatcher.date[1].setDate(queryMatcher.date[1].getDate() - 1);

        setLoading(true);
        let data = await tourplanService.getManyTourPlans(queryMatcher);
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
            let user = await userAuthService.getProfile(authService.getUser());
            user = user.user;
            if (userId) {
                if (user.status >= 300) {
                    data.data[i].isSaved = false;
                }
                else {
                    data.data[i].isSaved = false;
                    for (const value of user.savedTourPlan) {
                        if (value._id._id.toString() === data.data[i]._id) {
                            data.data[i].isSaved = true;
                        }
                    }
                }
            }
            else {
                data.data[i].isSaved = false;
            }
        }
        data = data.data;
        setLoading(false);
        
        setTourplans(data);
    }

    const fetchData = async () => {
        loadData();
        

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
            
            return;
        }
        data = data.data;
        setAllCountryPlaceData(data);

        let formattedData = [
            {
                value: 'All Country',
                label: 'All Country',
                id: "-1",
            }
        ];
        for (const country of data) {
            formattedData.push({
                value: country.name,
                label: country.name,
                id: country._id,
            });
        }
        setCountry(formattedData);
        setCountryOption(formattedData[0]);

        data = await exploreService.getAllExplore("category");
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
            
            return;
        }
        data = data.data;
        formattedData = [];
        for (const ctg of data) {
            formattedData.push({
                value: ctg.name,
                label: ctg.name,
                id: ctg._id,
                isSelected: false,
            });
        }
        setCategory(formattedData);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <div>
            <div className="plan-holiday-header">
                {
                    curPage >= 4 ? (
                        <BsArrowLeft
                            className="plan-holiday-cancel"
                            style={{
                                fontSize: '35px',
                            }}
                            onClick={() => setCurPage(curPage - 1)}
                        />
                    ) : (
                        <div></div>
                    )
                }
                <div className="plan-holiday-title">Plan My Holiday</div>
                <ImCross 
                    className="plan-holiday-cancel" 
                    onClick={() => handlePlanModal(false)}
                />
            </div>

            {
                curPage === 1 ? (
                    <>
                        <div className="plan-holiday-section-title">Where To Visit</div>

                        <div className="plan-holiday-item-title">Country</div>
                        <Select 
                            styles={customStyles}
                            className="plan-holiday-select-container"
                            onChange={handleCountryOptionChange}
                            options={country}
                            value={countryOption}
                        />

                        <div className="plan-holiday-item-title">Place</div>
                        <Select 
                            isMulti
                            styles={customStyles}
                            className="plan-holiday-select-container"
                            onChange={handlePlaceOptionChange}
                            options={place}
                            value={placeOption}
                        />
                    </>
                ) : null
            }

            {
                curPage === 2 ? (
                    <>
                        <div className="plan-holiday-section-title">When To Visit</div>

                        <div className="plan-holiday-item-title">From</div>
                        <Select 
                            styles={customStyles}
                            className="plan-holiday-select-container"
                            onChange={handleMaxDate}
                            options={dateRange}
                            value={maxDateOption}
                        />

                        <div className="plan-holiday-item-title">To</div>
                        <Select 
                            styles={customStyles}
                            className="plan-holiday-select-container"
                            onChange={handleMinDate}
                            options={minDate}
                            value={minDateOption}
                        />
                    </>
                ) : null
            }

            {
                curPage === 3 ? (
                    <>
                        <div className="plan-holiday-section-title">Tour Options</div>

                        <div className="plan-holiday-item-title">
                            <b>Cost:</b> {cost[0]} to {cost[1]}{(cost[1] === 10000) ? '+' : ''} USD
                        </div>
                        <Range
                            style={{
                                width: '86%',
                                marginLeft: '7%',
                                marginRight: '7%',
                            }}
                            trackStyle={[{
                                height: '12px',
                                backgroundColor: '#0A7BBD',
                            }]}
                            railStyle={{
                                height: '12px',
                                backgroundColor: '#0A7BBD',
                            }}
                            handleStyle={[
                                {
                                    height: '20px',
                                    width: '20px',
                                    color: 'white',
                                    borderColor: 'blue',
                                },
                                {
                                    height: '20px',
                                    width: '20px',
                                    color: 'white',
                                    borderColor: 'blue',
                                },
                            ]}
                            min={1}
                            max={10000}
                            value={cost}
                            onChange={value => setCost(value)}
                            onAfterChange={fetchData}
                        />
                        <br />

                        <div className="plan-holiday-item-title">
                            <b>Duration:</b> {duration[0]} to {duration[1]} Days
                        </div>
                        <Range
                            style={{
                                width: '86%',
                                marginLeft: '7%',
                                marginRight: '7%',
                            }}
                            trackStyle={[{
                                height: '12px',
                                backgroundColor: '#0A7BBD',
                            }]}
                            railStyle={{
                                height: '12px',
                                backgroundColor: '#0A7BBD',
                            }}
                            handleStyle={[
                                {
                                    height: '20px',
                                    width: '20px',
                                    color: 'white',
                                    borderColor: 'blue',
                                },
                                {
                                    height: '20px',
                                    width: '20px',
                                    color: 'white',
                                    borderColor: 'blue',
                                },
                            ]}
                            min={1}
                            max={60}
                            value={duration}
                            onChange={value => setDuration(value)}
                            onAfterChange={fetchData}
                        />
                        <br />

                        <div className="plan-holiday-item-title">
                            <b>Tour Style</b>
                        </div>

                        {
                            tourStyle.map((item, index) => (
                                <div key={index} className="event-filter-checkbox">
                                    <input 
                                        type="checkbox"
                                        checked={item.isSelected}
                                        onChange={() => handleTourStyle(index)}
                                    /> {item.value}
                                </div>
                            ))
                        }
                        <br />

                        <div className="plan-holiday-item-title">
                            <b>Tour Category</b>
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
                    </>
                ) : null
            }

            {
                curPage === 4 ? (
                    <>
                        <div className="plan-holiday-section-title">Accomodation Options</div>

                        {
                            accomodation.map((item, index) => (
                                <div key={index} className="event-filter-checkbox">
                                    <input 
                                        type="checkbox"
                                        checked={item.isSelected}
                                        onChange={() => handleAccomodation(index)}
                                    /> {item.value}
                                </div>
                            ))
                        }
                    </>
                ) : null
            }

            {
                curPage === 5 ? (
                    <LoadingOverlay
                        active={loading}
                        spinner={
                            <ClipLoader color={color} loading={loading} size={50} />
                        }
                        style={{
                            minHeight: '80vh',
                        }}
                    >
                        {
                            tourplans.map((tourplan, index) => (
                                <TourPlanLongCard
                                    key={index}
                                    tourplan={tourplan}
                                    index={index}
                                    handleSaveTourplan={handleSaveTourplan}
                                />
                            ))
                        }
                        <div className="profile-no-data-text" hidden={tourplans.length > 0 || loading}>No Tour Plans Found</div>
                    </LoadingOverlay>
                ) : null
            }

            {
                curPage <= 3 ? (
                    <div className="plan-holiday-button-group">
                        {
                            curPage > 1 ? (
                                <button 
                                    className="btn btn-secondary plan-holiday-button"
                                    onClick={() => setCurPage(curPage - 1)}
                                >Back</button>
                            ) : null
                        }
                        <button 
                            className="btn btn-primary plan-holiday-button"
                            onClick={() => setCurPage(curPage + 1)}
                        >Next</button>
                    </div>
                ) : null
            }

            {
                curPage === 4 ? (
                    <div className="plan-holiday-button-last-group">
                        <button 
                            className="btn btn-secondary plan-holiday-last-button"
                            onClick={() => {
                                setCurPage(curPage + 1);
                                handleFetchTourplans();
                            }}
                        >View Tour Plans</button>
                        <button className="btn btn-primary plan-holiday-last-button">Request Private Event</button>
                    </div>
                ) : null
            }
        </div>
    );
}
 
export default PlanMyHoliday;