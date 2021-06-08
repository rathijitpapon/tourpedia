import React from 'react';
import {Image} from 'react-bootstrap';

import "./styles.css";

const EventLongCard = () => {

    return ( 
        <div className="event-long-card-main">
            <Image 
                className="event-long-card-image"
                src="https://cdn.tourradar.com/s3/tour/232x170/102289_46ecee.jpg"
                alt="event img"
            />
            <div className="event-long-card-middle">
                <div className="event-long-card-title">Greece, Italy, Switzerland and Paris</div>
                <div className="event-long-card-description">
                    Start in Athens and end in Paris! With the Discovery tour Greece, Italy, Switzerland and Paris, you have a 13 days tour package taking you through Athens, Greece and 22 other destinations in Europe. Greece, Italy, Switzerland and Paris includes accommodation in a hotel as well as an expert guide, insurance, meals, transport and more.
                </div>
                <table className="event-long-card-table">
                    <tbody>
                        <tr>
                            <th>Category</th>
                            <td>Adventure, Historical, Discovery</td>
                        </tr>
                        <tr>
                            <th>Place</th>
                            <td>Greece, Italy, Vatican City, Switzerland, France</td>
                        </tr>
                        <tr>
                            <th>Style</th>
                            <td>Group</td>
                        </tr>
                        <tr>
                            <th>Age</th>
                            <td>10 to 35 Years Old</td>
                        </tr>
                        <tr>
                            <th>Agency</th>
                            <td>Europamundo</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="event-long-card-side-main">
                <div className="event-long-card-side-first">
                    <div className="event-long-card-side-text">
                        Duration <br />
                        <b>10 Days</b>
                    </div>
                    <div className="event-long-card-side-text">
                        Cost <br />
                        <b>100 USD</b>
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
     );
}
 
export default EventLongCard;