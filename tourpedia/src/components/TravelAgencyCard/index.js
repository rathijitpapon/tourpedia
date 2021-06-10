import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const TravelAgencyCard = (props) => {
    const travelagency = props.travelagency;

    return ( 
        <Link
            to={"/agency/" + travelagency.username}
            className="travelagency-card-main"
        >
            <Image
                className="travelagency-card-image"
                src={travelagency.profileImage}
                alt="travelagency img"
            />
            <div className="travelagency-card-middle">
                <div className="travelagency-card-title">
                    {travelagency.fullname}
                </div>
                <div className="travelagency-card-description">
                    {travelagency.about}
                </div>
            </div>
        </Link>
     );
}
 
export default TravelAgencyCard;