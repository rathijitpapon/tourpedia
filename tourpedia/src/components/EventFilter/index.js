import React, {useState} from 'react';
import { Range } from 'rc-slider';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';

import 'rc-slider/assets/index.css';
import "./styles.css";

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

const EventFilter = () => {

    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const dateRange = [];
    let timestamps = new Date();
    for (let i = 0; i < 24; i++) {
        dateRange.push({
            value: timestamps.toISOString().split('T')[0],
            label: monthNames[timestamps.getMonth()] + ", " + timestamps.getFullYear(),
        });
        timestamps.setMonth(timestamps.getMonth() + 1);
    }

    const [duration, setDuration] = useState([1, 60]);
    const [minDate, setMinDate] = useState(dateRange);
    const [maxDateOption, setMaxDateOption] = useState(dateRange[0]);
    const [minDateOption, setMinDateOption] = useState(dateRange[dateRange.length - 1]);

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
        await fetchData();
    }

    const handleMinDate = async (newValue, actionMeta) => {
        setMinDateOption(newValue);
        await fetchData();
    }

    const fetchData = async () => {
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
            <br />

            <Collapsible 
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
                    onAfterChange={fetchData}
                />
                <br />
            </Collapsible>
            
            <br />

            <Collapsible 
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
                            <b>Tour Style:</b>
                        </div>
                        <IoIosArrowUp      
                            className="event-filter-section-header-icon" 
                        />
                    </div>
                }
            >
            
            </Collapsible>
        </Collapsible>
    );
}
 
export default EventFilter;