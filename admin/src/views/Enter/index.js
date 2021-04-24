import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';

import userAuthService from "../../services/userAuthService";

import Signin from '../../components/Signin';

import "./styles.css";

import enterpage4 from "../../assets/enterpage/enterpage4.jpg";

const Enter = () => {

    const history = useHistory();
    const enterpage = [
        enterpage4,
    ];

    const fetchData = async () => {
        const data = await userAuthService.getSavedAuthInfo();
        if(data) {
            history.push("/home");
        }
    }

    useEffect(() => {
        fetchData();
    });

    return ( 
        <Carousel fade prevIcon={null} nextIcon={null} indicators={false} keyboard={false} controls={false} pause={false}>
            {
                enterpage.map((image, index) => (
                    <Carousel.Item interval={2000} key={index}>
                        <div 
                            className="enter-main-container"
                            style={{ 
                                backgroundImage: `url(${[image]})`,
                            }}
                        >
                            <div className="row">
                                <div className="col col-md-6 col-12 enter-header-container">
                                    <div className="enter-title-container">
                                        Tour Pedia
                                    </div>
                                    <br />
                                    <div className="enter-content-container">
                                        This platform is only for <strong>Admin</strong> team of Tour Pedia Website.
                                    </div>
                                    
                                </div>
                                <div 
                                    className="col col-md-6 col-12 enter-signup-container">
                                    <Signin />
                                </div>
                            </div>
                        </div>
                    </Carousel.Item>
                ))
            }
        </Carousel>
     );
}
 
export default Enter;