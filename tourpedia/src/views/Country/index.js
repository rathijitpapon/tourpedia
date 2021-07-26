import React, {useState, useEffect} from 'react';

import CountryCard from '../../components/CountryCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import countryData from "../../assets/dummyData/country.json";

const Country = () => {

    const [categories, setCategories] = useState([]);

    const fetchData = async () => {
        const data = [];

        for (let i = 0; i < countryData.length; i++) {
            data.push(countryData[i]);
        }
        setCategories(data);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="country-title">
                Countries To Visit
            </div>

            <br />

            <div className="row">
                {
                    categories.map((country, index) => (
                        <div
                            key={index}
                            className="col-md-4 col-12"
                        >
                            <CountryCard 
                                country={country}
                            />
                            <br />
                        </div>
                    ))
                }
            </div>

            <br />
            
        </LayoutWrapper>
     );
}
 
export default Country;