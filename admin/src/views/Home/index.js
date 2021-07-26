import React, {useState, useEffect} from 'react';
import {Image} from 'react-bootstrap';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import userAuthService from '../../services/userAuthService';
import Logo from '../../assets/logo.png';

const Home = () => {
    const [name, setName] = useState('');

    const fetchData = async () => {
        const data = await userAuthService.getSavedAuthInfo();
        if (data) {
            setName(data.fullname);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <Image src={Logo} alt="logo" className="home-logo"/>
            <div className="home-title">Tour Pedia</div>
            <div className="home-text">Administrator Platform</div>
            <div className="home-name"><b>Current User:</b> &nbsp; {name}</div>
        </LayoutWrapper>
     );
}
 
export default Home;