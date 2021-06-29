import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Image, Carousel} from 'react-bootstrap';

import userAuthService from "../../services/userAuthService";

import LayoutWrapper from "../../layouts/LayoutWrapper";
import Signin from "../../components/Signin";
import Signup from "../../components/Signup";
import "./styles.css";

import enterpage1 from "../../assets/enterpage/enterpage1.jpg";
import enterpage2 from "../../assets/enterpage/enterpage2.jpg";
import enterpage3 from "../../assets/enterpage/enterpage3.jpg";
import enterpage4 from "../../assets/enterpage/enterpage4.jpg";

const Enter = () => {

    const history = useHistory();
    const [signup, setSignup] = useState(false);
    const [signin, setSignin] = useState(true);

    const images = [
        enterpage1,
        enterpage2,
        enterpage3,
        enterpage4,
    ];

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
            history.push("/");
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    })

    
    return ( 
        <LayoutWrapper>
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="enter-headline-container">
                            <span style={{color: 'blue'}}>Tour Pedia</span> - A Wikipedia of Different Tour Places
                        </div>
                        <div className="enter-para-container">
                            <i>
                                To share your tour experiences & join our events, signup now!
                            </i>
                        </div>
                        <br />
                        <Carousel fade prevIcon={null} nextIcon={null}>
                            {
                                images.map((image, index) => (
                                    <Carousel.Item interval={2000} key={index}>
                                        <Image
                                            className="enter-img-container"
                                            src={image}
                                        />
                                    </Carousel.Item>
                                ))
                            }
                        </Carousel>
                    </div>
                    <div className="col-md-6 enter-container">
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
        </LayoutWrapper>
     );
}
 
export default Enter;