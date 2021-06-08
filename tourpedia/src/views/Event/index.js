import React, {useState, useEffect} from 'react';
import Select from 'react-select';

import Filter from '../../components/EventFilter';
import EventLongCard from '../../components/EventLongCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import countryData from "../../assets/dummyData/country.json";

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

const Event = () => {

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
        console.log("Ok");
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

        setPlace([{ value: 'All Place', label: 'All Place' }]);
        setPlaceOption({ value: 'All Place', label: 'All Place' });
    }

    useEffect(() => {
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
                    <Filter />
                </div>
                <div className="col-md-9 col-12">
                    <EventLongCard />
                    <EventLongCard />
                    <EventLongCard />
                    <EventLongCard />
                </div>
            </div>
        </LayoutWrapper>
     );
}
 
export default Event;