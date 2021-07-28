import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const TourPlanCard = (props) => {
    const tourplan = props.tourplan;

    return ( 
        <Link
            to={"/tourplan/" + tourplan._id}
            className="tour-plan-card-main"
        >
            <Image
                className="tour-plan-card-image"
                src={tourplan.banner}
                alt="tourplan img"
            />
            <div className="tour-plan-card-middle">
                <div className="tour-plan-card-title">
                    {tourplan.name}
                </div>
                <div className="tour-plan-card-description">
                    {tourplan.description}
                </div>
            </div>
        </Link>
     );
}
 
export default TourPlanCard;