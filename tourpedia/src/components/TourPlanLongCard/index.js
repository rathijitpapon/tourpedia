import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const TourPlanLongCard = (props) => {
    const tourplan = props.tourplan;

    return ( 
        <div
            className="tour-plan-long-card-main"
        >
            <Link
                to={"/tourplan/" + tourplan._id}
            >
            <Image
                className="tour-plan-long-card-image"
                src={tourplan.banner}
                alt="tourplan img"
            />
            </Link>
            <div className="tour-plan-long-card-middle">
                <Link
                    to={"/tourplan/" + tourplan._id}
                >
                    <div className="tour-plan-long-card-title">
                        {tourplan.name}
                    </div>
                </Link>
                <div className="tour-plan-long-card-description">
                    {tourplan.description}
                </div>
                <table className="tour-plan-long-card-table">
                    <tbody>
                        <tr>
                            <th>Category</th>
                            <td>
                                <Link 
                                    style={{
                                        color: '#540750'
                                    }}
                                    to={"/category/" + tourplan.category[0]._id.name}
                                >{tourplan.category[0]._id.name}</Link>
                                {
                                    tourplan.category.slice(1).map((category, index) => (
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
                                    to={"/place/" + tourplan.place[0]._id.name}
                                >{tourplan.place[0]._id.name}</Link>
                                {
                                    tourplan.place.slice(1).map((place, index) => (
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
                            <td>{tourplan.groupOption}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="tour-plan-long-card-side-main">
                <div className="tour-plan-long-card-side-first">
                    <div className="tour-plan-long-card-side-text">
                        Duration <br />
                        <b>{tourplan.duration} Days</b>
                    </div>
                    <div className="tour-plan-long-card-side-text">
                        Cost <br />
                        <b>{tourplan.totalCost} USD</b>
                    </div>
                </div>
                <div className="tour-plan-long-card-side-first">
                    <div>
                        <button className="btn btn-secondary tour-plan-long-card-button">Download Plan</button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default TourPlanLongCard;