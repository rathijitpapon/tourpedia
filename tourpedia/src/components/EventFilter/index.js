import React, {useState, useEffect} from 'react';
import { Range } from 'rc-slider';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';

import 'rc-slider/assets/index.css';
import "./styles.css";

import fixedFilters from "../../assets/fixedFilters.json";
import categoryData from "../../assets/dummyData/category.json";

const customStyles = {
    control: base => ({
        ...base,
        backgroundColor: '#f7efef',
        borderColor: '#821616',
        borderWidth: '2px',
        height: '50px',
        marginBottom: '10px',
    }),
    menu: provided => ({ 
        ...provided, 
        zIndex: 9999,
    })
};

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const EventFilter = (props) => {

    const applyFilter = props.applyFilter;
    const currentDate = props.currentDate;
    const [isFilterOpen, setIsFilterOpen] = useState(true);

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

    const [category, setCategory] = useState([]);
    const [tourStyle, setTourStyle] = useState([]);
    const [physical, setPhysical] = useState([]);
    const [accomodation, setAccomodation] = useState([]);
    const [inclusion, setInclusion] = useState([]);
    const [quality, setQuality] = useState([]);
    const [roomSize, setRoomSize] = useState([1, 10]);
    const [participant, setParticipant] = useState([1, 100]);
    const [age, setAge] = useState([1, 100]);
    const [duration, setDuration] = useState([1, 60]);
    const [cost, setCost] = useState([1, 10000]);
    const [childAllowed, setChildAllowed] = useState(false);
    const [minDate, setMinDate] = useState(dateRange);
    const [maxDateOption, setMaxDateOption] = useState(dateRange[0]);
    const [minDateOption, setMinDateOption] = useState(dateRange[dateRange.length - 1]);

    const [durationCollaspible, setDurationCollaspible] = useState(true);
    const [costCollaspible, setCostCollaspible] = useState(true);
    const [tourStyleCollaspible, setTourStyleCollaspible] = useState(true);
    const [categoriesCollaspible, setCategoriesCollaspible] = useState(true);
    const [physicalCollaspible, setPhysicalCollaspible] = useState(true);
    const [ageCollaspible, setAgeCollaspible] = useState(true);
    const [participantCollaspible, setParticipantCollaspible] = useState(true);
    const [accomodationCollapsible, setAccomodationCollapsible] = useState(true);
    const [inclusionCollapsible, setInclusionCollaspible] = useState(true);
    const [qualityCollapsible, setQualityCollapsible] = useState(true);
    const [roomCollapsible, setRoomCollapsible] = useState(true);

    const handleMaxDate = async (newValue, actionMeta) => {
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

    const handleMinDate = async (newValue, actionMeta) => {
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

    const handleInclusion = async (index) => {
        const data = [...inclusion];
        data[index] = {...inclusion[index]};
        data[index].isSelected = !data[index].isSelected;
        setInclusion(data);
    }

    const handleAccomodation = async (index) => {
        const data = [...accomodation];
        data[index] = {...accomodation[index]};
        data[index].isSelected = !data[index].isSelected;
        setAccomodation(data);
    }

    const handlePhysical = async (index) => {
        const data = [...physical];
        data[index] = {...physical[index]};
        data[index].isSelected = !data[index].isSelected;
        setPhysical(data);
    }

    const handleQuality = async (index) => {
        const data = [...quality];
        data[index] = {...quality[index]};
        data[index].isSelected = !data[index].isSelected;
        setQuality(data);
    }

    const loadData = async () => {
        handleMaxDate(currentDate);

        let data = [];
        for (const item of fixedFilters.tourStyle) {
            data.push({
                value: item,
                isSelected: false,
            });
        }
        setTourStyle(data);

        data = [];
        for (const item of categoryData) {
            data.push({
                value: item.name,
                isSelected: false,
            });
        }
        setCategory(data);

        data = [];
        for (const item of fixedFilters.physicalRating) {
            data.push({
                value: item,
                isSelected: false,
            });
        }
        setPhysical(data);

        data = [];
        for (const item of fixedFilters.inclusion) {
            data.push({
                value: item,
                isSelected: false,
            });
        }
        setInclusion(data);

        data = [];
        for (const item of fixedFilters.accomodationOption) {
            data.push({
                value: item,
                isSelected: false,
            });
        }
        setAccomodation(data);

        data = [];
        for (const item of fixedFilters.accomodationQuality) {
            data.push({
                value: item,
                isSelected: false,
            });
        }
        setQuality(data);
    }

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    const fetchData = async (dataType, inputData) => {
        const filters = {};

        if (dataType && dataType === 'minDate')
            filters['minDate'] = inputData;
        else
            filters['minDate'] = minDateOption.value;

        if (dataType && dataType === 'maxDate')
            filters['maxDate'] = inputData;
        else
            filters['maxDate'] = maxDateOption.value;

        filters['minDuration'] = duration[0];
        filters['maxDuration'] = duration[1];
        filters['minCost'] = cost[0];
        filters['maxCost'] = cost[1];
        filters['minAge'] = age[0];
        filters['maxAge'] = age[1];
        filters['minParticipants'] = participant[0];
        filters['maxParticipants'] = participant[1];
        filters['minRoomSize'] = roomSize[0];
        filters['maxRoomSize'] = roomSize[1];

        let data = []
        let input = tourStyle;
        if (dataType && dataType === "tourStyle")
            input = inputData;
        for (const item of input) {
            if (item.isSelected) 
                data.push(item.value);
        }
        filters['tourStyle'] = data;

        data = []
        input = category;
        if (dataType && dataType === "category")
            input = inputData;
        for (const item of input) {
            if (item.isSelected) 
                data.push(item.value);
        }
        filters['category'] = data;

        data = []
        input = accomodation;
        if (dataType && dataType === "accomodation")
            input = inputData;
        for (const item of input) {
            if (item.isSelected) 
                data.push(item.value);
        }
        filters['accomodation'] = data;

        data = []
        input = inclusion;
        if (dataType && dataType === "inclusion")
            input = inputData;
        for (const item of input) {
            if (item.isSelected) 
                data.push(item.value);
        }
        filters['inclusion'] = data;

        data = []
        input = physical;
        if (dataType && dataType === "physical")
            input = inputData;
        for (const item of input) {
            if (item.isSelected) 
                data.push(item.value);
        }
        filters['physical'] = data;

        data = []
        input = quality;
        if (dataType && dataType === "quality")
            input = inputData;
        for (const item of input) {
            if (item.isSelected) 
                data.push(item.value);
        }
        filters['quality'] = data;
        filters['childAllowed'] = childAllowed;

        applyFilter(filters);
    }

    return (
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
            <div className="event-filter-apply" hidden={!isFilterOpen}>
            <button 
                className="btn btn-primary event-filter-apply-button" 
                onClick={() => fetchData()}
            >
                Apply Filter
            </button>
            </div>

            <br />

            <div className="event-filter-section-header">
                <div>
                    <b>Date</b>
                </div>
            </div>
            <Select 
                styles={customStyles}
                onChange={handleMaxDate}
                options={dateRange}
                value={maxDateOption}
            />
            <Select 
                styles={customStyles}
                onChange={handleMinDate}
                options={minDate}
                value={minDateOption}
            />
            
            <div style={{ marginBottom: '15px' }} />

            <Collapsible 
                open={durationCollaspible}
                handleTriggerClick={() => setDurationCollaspible(!durationCollaspible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Duration:</b> {duration[0]} to {duration[1]} Days
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Duration:</b> {duration[0]} to {duration[1]} Days
                        </div>
                        <IoIosArrowUp           
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                <Range
                    style={{
                        width: '86%',
                        marginLeft: '7%',
                        marginRight: '7%',
                    }}
                    trackStyle={[{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }]}
                    railStyle={{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }}
                    handleStyle={[
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                    ]}
                    min={1}
                    max={60}
                    value={duration}
                    onChange={value => setDuration(value)}
                />
                <br />
            </Collapsible>
            
            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={costCollaspible}
                handleTriggerClick={() => setCostCollaspible(!costCollaspible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Cost:</b> {cost[0]} to {cost[1]}{(cost[1] === 10000) ? '+' : ''} USD
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Cost:</b> {cost[0]} to {cost[1]}{(cost[1] === 10000) ? '+' : ''} USD
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                <Range
                    style={{
                        width: '86%',
                        marginLeft: '7%',
                        marginRight: '7%',
                    }}
                    trackStyle={[{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }]}
                    railStyle={{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }}
                    handleStyle={[
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                    ]}
                    min={1}
                    max={10000}
                    value={cost}
                    onChange={value => setCost(value)}
                />
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={tourStyleCollaspible}
                handleTriggerClick={() => setTourStyleCollaspible(!tourStyleCollaspible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Tour Style</b>
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Tour Style</b>
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
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
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={categoriesCollaspible}
                handleTriggerClick={() => setCategoriesCollaspible(!categoriesCollaspible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Tour Category</b>
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Tour Category</b>
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
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
                
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible 
                open={physicalCollaspible}
                handleTriggerClick={() => setPhysicalCollaspible(!physicalCollaspible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Physical Rating</b>
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Physical Rating</b>
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                {
                    physical.map((item, index) => (
                        <div key={index} className="event-filter-checkbox">
                            <input 
                                type="checkbox"
                                checked={item.isSelected}
                                onChange={() => handlePhysical(index)}
                            /> {item.value}
                        </div>
                    ))
                }
                
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={ageCollaspible}
                handleTriggerClick={() => setAgeCollaspible(!ageCollaspible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Age:</b> {age[0]} to {age[1]}{(age[1] === 100) ? '+' : ''} Years
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Age:</b> {age[0]} to {age[1]}{(age[1] === 100) ? '+' : ''} Years
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                <Range
                    style={{
                        width: '86%',
                        marginLeft: '7%',
                        marginRight: '7%',
                    }}
                    trackStyle={[{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }]}
                    railStyle={{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }}
                    handleStyle={[
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                    ]}
                    min={1}
                    max={100}
                    value={age}
                    onChange={value => setAge(value)}
                />
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <div className="event-filter-checkbox">
                <input 
                    type="checkbox"
                    checked={childAllowed}
                    onChange={async () => {
                        setChildAllowed(!childAllowed)
                    }}
                /> Child Allowance
            </div>

            <div style={{ marginBottom: '20px' }} />

            <Collapsible
                open={participantCollaspible}
                handleTriggerClick={() => setParticipantCollaspible(!participantCollaspible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Participants:</b> {participant[0]} to {participant[1]}{(participant[1] === 100) ? '+' : ''} Persons
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Participants:</b> {participant[0]} to {participant[1]}{(participant[1] === 100) ? '+' : ''} Persons
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                <Range
                    style={{
                        width: '86%',
                        marginLeft: '7%',
                        marginRight: '7%',
                    }}
                    trackStyle={[{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }]}
                    railStyle={{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }}
                    handleStyle={[
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                    ]}
                    min={1}
                    max={100}
                    value={participant}
                    onChange={value => setParticipant(value)}
                />
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={accomodationCollapsible}
                handleTriggerClick={() => setAccomodationCollapsible(!accomodationCollapsible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Accomodation Options</b>
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Accomodation Options</b>
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
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
                
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={inclusionCollapsible}
                handleTriggerClick={() => setInclusionCollaspible(!inclusionCollapsible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Inclusions</b>
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Inclusions</b>
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                {
                    inclusion.map((item, index) => (
                        <div key={index} className="event-filter-checkbox">
                            <input 
                                type="checkbox"
                                checked={item.isSelected}
                                onChange={() => handleInclusion(index)}
                            /> {item.value}
                        </div>
                    ))
                }
                
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={qualityCollapsible}
                handleTriggerClick={() => setQualityCollapsible(!qualityCollapsible)}
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Accomodation Quality</b>
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Accomodation Quality</b>
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                {
                    quality.map((item, index) => (
                        <div key={index} className="event-filter-checkbox">
                            <input 
                                type="checkbox"
                                checked={item.isSelected}
                                onChange={() => handleQuality(index)}
                            /> {item.value} Star
                        </div>
                    ))
                }
                
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />

            <Collapsible
                open={roomCollapsible}
                handleTriggerClick={() => setRoomCollapsible(!roomCollapsible)} 
                trigger={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Room Size:</b> {roomSize[0]} to {roomSize[1]}{(roomSize[1] === 10) ? '+' : ''} Persons
                        </div>
                        <IoIosArrowDown       
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
                triggerWhenOpen={
                    <div className="event-filter-section-header">
                        <div>
                            <b>Room Size:</b> {roomSize[0]} to {roomSize[1]}{(roomSize[1] === 10) ? '+' : ''} Persons
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
                <Range
                    style={{
                        width: '86%',
                        marginLeft: '7%',
                        marginRight: '7%',
                    }}
                    trackStyle={[{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }]}
                    railStyle={{
                        height: '16px',
                        backgroundColor: '#0A7BBD',
                    }}
                    handleStyle={[
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                        {
                            height: '25px',
                            width: '25px',
                            color: 'white',
                            borderColor: 'blue',
                        },
                    ]}
                    min={1}
                    max={10}
                    value={roomSize}
                    onChange={value => setRoomSize(value)}
                />
                <br />
            </Collapsible>

            <div style={{ marginBottom: '10px' }} />
        </Collapsible>
    );
}
 
export default EventFilter;