import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Collapsible from 'react-collapsible';
import {Image} from 'react-bootstrap';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';

import "./styles.css";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const PlaceCard = (props) => {
    const dayPlan = props.dayPlan;

    const [isOpen, setIsOpen] = useState(false);
    const date = new Date(dayPlan.date);

    return (
        <Collapsible
            open={isOpen}
            handleTriggerClick={() => setIsOpen(!isOpen)}
            trigger={
                <div className="day-plan-header-title">
                    <b>
                        {date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear()}
                    </b> &nbsp; &nbsp;<IoIosArrowDown       
                        className="day-plan-header-icon" 
                    />
                </div>
            }
            triggerWhenOpen={
                <div className="day-plan-header-title">
                    <b>
                        {date.getDate() + " " + monthNames[date.getMonth()] + ", " + date.getFullYear()}
                    </b> &nbsp; &nbsp;<IoIosArrowUp      
                        className="day-plan-header-icon" 
                    />
                </div>
            }
        >
            <div
                className="day-plan-card-main"
            >
                <Image
                    className="day-plan-card-image"
                    src={dayPlan.imageURL}
                    alt="dayPlan img"
                />
                <div className="day-plan-card-middle">
                    <div className="day-plan-card-description">
                        {dayPlan.description}
                    </div>

                    <div>
                        <div className="day-plan-section-tilte">On This Day</div>
                        {
                            dayPlan.activity.map((activity, index) => (
                                <React.Fragment>
                                <span
                                className="event-details-category"
                                >
                                {activity}
                                </span> &nbsp; </React.Fragment>
                            ))
                        }
                    </div>

                    <br />

                    <div>
                        <div className="day-plan-section-tilte">Visiting Places</div>
                        {
                            dayPlan.place.map((place, index) => (
                                <React.Fragment>
                                <Link
                                className="event-details-category"
                                to={"/place/" + place.name}
                                >
                                {place.name}
                                </Link> &nbsp; </React.Fragment>
                            ))
                        }
                    </div>
                </div>
            </div>
        
        </Collapsible>
     );
}
 
export default PlaceCard;