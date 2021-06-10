import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const travelagencyLongCard = (props) => {
    const travelagency = props.travelagency;

    return ( 
        <div
            className="travelagency-long-card-main"
        >
            <Link
                to={"/agency/" + travelagency.username}
            >
            <Image
                className="travelagency-long-card-image"
                src={travelagency.profileImage}
                alt="travelagency img"
            />
            </Link>
            <div className="travelagency-long-card-middle">
                <Link
                    to={"/agency/" + travelagency.username}
                >
                    <div className="travelagency-long-card-title">
                        {travelagency.fullname}
                    </div>
                </Link>
                <div className="travelagency-long-card-description">
                    {travelagency.about}
                </div>
                <table className="travelagency-long-card-table">
                    <tbody>
                        <tr>
                            <th>Category</th>
                            <td>
                                <Link 
                                    style={{
                                        color: '#540750'
                                    }}
                                    to={"/category/" + travelagency.category[0]}
                                >{travelagency.category[0]}</Link>
                                {
                                    travelagency.category.slice(1).map((category, index) => (
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
 
export default travelagencyLongCard;