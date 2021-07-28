import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const EventLongCard = (props) => {
    const event = props.event;

    return ( 
        <div
            className="event-long-card-main"
        >
            <div className="event-long-card-main-child">
            <Link
                to={"/event/" + event.travelAgency._id.username + "/" + event._id}
            >
            <Image
                className="event-long-card-image"
                src={event.banner}
                alt="event img"
            />
            </Link>
            <div className="event-long-card-middle">
                <Link
                    to={"/event/" + event.travelAgency._id.username + "/" + event._id}
                >
                    <div className="event-long-card-title">
                        {event.name}
                    </div>
                </Link>
                <div className="event-long-card-description">
                    {event.description}
                </div>
                <table className="event-long-card-table">
                    <tbody>
                        <tr>
                            <th>Category</th>
                            <td>
                                <Link 
                                    style={{
                                        color: '#540750'
                                    }}
                                    to={"/category/" + event.category[0]._id.name}
                                >{event.category[0]._id.name}</Link>
                                {
                                    event.category.slice(1).map((category, index) => (
                                        <React.Fragment key={index}>
                                            , <Link
                                                style={{
                                                    color: '#540750'
                                                }}
                                                to={"/category/" + category._id.name} 
                                            >{category._id.name}
                                            </Link>
                                        </React.Fragment>
                                    ))
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Place</th>
                            <td>
                                <Link 
                                    style={{
                                        color: '#540750'
                                    }}
                                    to={"/place/" + event.place[0]._id.name}
                                >{event.place[0]._id.name}</Link>
                                {
                                    event.place.slice(1).map((place, index) => (
                                        <React.Fragment key={index}>
                                            , <Link 
                                                style={{
                                                    color: '#540750'
                                                }}
                                                to={"/place/" + place._id.name} 
                                            >{place._id.name}
                                            </Link>
                                        </React.Fragment>
                                    ))
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Style</th>
                            <td>{event.groupOption}</td>
                        </tr>
                        <tr>
                            <th>Age</th>
                            <td>{event.minimumAge} to {event.maximumAge} Years Old</td>
                        </tr>
                        <tr>
                            <th>Agency</th>
                            <td>{event.travelAgency._id.fullname}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
            <div className="event-long-card-side-parent">
            <div className="event-long-card-side-main">
                <div className="event-long-card-side-first">
                    <div className="event-long-card-side-text">
                        Duration <br />
                        <b>{event.duration} Days</b>
                    </div>
                    <div className="event-long-card-side-text">
                        Cost <br />
                        <b>{event.totalCost} USD</b>
                    </div>
                </div>
                <div className="event-long-card-side-first">
                    <div>
                        <button className="btn btn-primary event-long-card-button">Enroll</button>
                    </div>
                    <div>
                        <button className="btn btn-secondary event-long-card-button">Save</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
     );
}
 
export default EventLongCard;