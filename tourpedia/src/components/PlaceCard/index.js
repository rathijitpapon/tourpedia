import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const placeCard = (props) => {
    const place = props.place;

    return ( 
        <Link
            to={"/place/" + place.name}
            className="place-card-main"
        >
            <Image
                className="place-card-image"
                src={place.banner}
                alt="place img"
            />
            <div className="place-card-middle">
               <div className="place-card-title">
                    {place.name}
                </div>
                <div className="place-card-description">
                    {place.description}
                </div>
            </div>
        </Link>
     );
}
 
export default placeCard;