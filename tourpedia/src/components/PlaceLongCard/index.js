import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const placeLongCard = (props) => {
    const place = props.place;

    return ( 
        <div
            className="place-long-card-main"
        >
            <Link
                to={"/place/" + place.name}
            >
            <Image
                className="place-long-card-image"
                src={place.banner}
                alt="place img"
            />
            </Link>
            <div className="place-long-card-middle">
                <Link
                    to={"/place/" + place.name}
                >
                    <div className="place-long-card-title">
                        {place.name}
                    </div>
                </Link>
                <div className="place-long-card-description">
                    {place.description}
                </div>
                <table className="place-long-card-table">
                    <tbody>
                        <tr>
                            <th>Category</th>
                            <td>
                                <Link 
                                    style={{
                                        color: '#540750'
                                    }}
                                    to={"/category/" + place.category[0]}
                                >{place.category[0]}</Link>
                                {
                                    place.category.slice(1).map((category, index) => (
                                        <React.Fragment key={index}>
                                            , <Link
                                                style={{
                                                    color: '#540750'
                                                }}
                                                to={"/category/" + category} 
                                            >{category}
                                            </Link>
                                        </React.Fragment>
                                    ))
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
     );
}
 
export default placeLongCard;