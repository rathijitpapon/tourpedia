import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const CountryCard = (props) => {
    const country = props.country;

    return ( 
        <Link
            to={"/country/" + country.name}
            className="country-card-main"
        >
           <Image
                className="country-card-image"
                src={country.banner}
                alt="country img"
            />
            <div className="country-card-middle">
                <div className="country-card-title">
                    {country.name}
                </div>
                <div className="country-card-description">
                    {country.description}
                </div>
            </div>
        </Link>
     );
}
 
export default CountryCard;