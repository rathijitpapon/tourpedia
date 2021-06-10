import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const EventCard = (props) => {
    const event = props.event;

    let startDate = new Date(event.dayPlan[0].date);
    let endDate = new Date(event.dayPlan[event.dayPlan.length - 1].date);
    
    startDate = startDate.getDate() + " " + monthNames[startDate.getMonth()] + ", " + startDate.getFullYear();
    endDate = endDate.getDate() + " " + monthNames[endDate.getMonth()] + ", " + endDate.getFullYear();

    return ( 
        <Link
            to={"/event/" + event.travelAgency.username + "/" + event.name + "-" + event.id}
            className="event-card-main"
        >
            <Image
                className="event-card-image"
                src={event.banner}
                alt="event img"
            />
            <div className="event-card-middle">
                <div className="event-card-title">
                    {event.name}
                </div>
                <div className="event-card-description">
                    {event.description}
                </div>
                <div className="event-card-info">
                    <b>{startDate} - {endDate}</b>
                </div>
                <div className="event-card-info">
                    <b>Agency:</b> {event.travelAgency.fullname}
                </div>
            </div>
        </Link>
     );
}
 
export default EventCard;