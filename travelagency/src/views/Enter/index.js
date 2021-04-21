import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Carousel} from 'react-bootstrap';

import userAuthService from "../../services/userAuthService";

import Signin from '../../components/Signin';
import Signup from '../../components/Signup';

import "./styles.css";

import enterpage4 from "../../assets/enterpage/enterpage4.jpg";

const Enter = () => {

    const history = useHistory();
    const enterpage = [
        enterpage4,
    ];

    const [signup, setSignup] = useState(false);
    const [signin, setSignin] = useState(true);

    const onSigninSelect = () => {
        setSignup(false);
        setSignin(true);
    }

    const onSignupSelect = () => {
        setSignup(true);
        setSignin(false);
    }

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
                                        If you have a <strong>Travel Agency</strong>, Join our team to promote your tour events.
                                    </div>
                                    
                                </div>
                                <div 
                                    className="col col-md-6 col-12 enter-signup-container">
                                {
                                    signin ? (
                                        <Signin
                                            onSignupSelect={onSignupSelect}
                                        />
                                    ): null
                                }
                                {
                                    signup ? (
                                        <Signup
                                            onSigninSelect={onSigninSelect}
                                        />
                                    ): null
                                }
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