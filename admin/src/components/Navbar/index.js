import React, {useState, useEffect} from 'react';
import {Image, Navbar} from 'react-bootstrap';
import {Link, withRouter} from 'react-router-dom';

import userAuthService from '../../services/userAuthService';

import Logo from '../../assets/logo.png';
import "./styles.css";

const NavBar = (props) => {
    
    const [name, setName] = useState("");

    const fetchData = async () => {
        const data = await userAuthService.getSavedAuthInfo();
        if (data) {
            setName(data.fullname);
        }
    }

    useEffect(() => {
        fetchData();
    });

    return (
        <React.Fragment>
        {
           (name) ? (
                <Navbar expand="lg" className="navbar-container" sticky="top">
                    <Navbar.Brand as={Link} to="/home">
                        <Image className="nav-logo" src={Logo} />
                        <div className="nav-link-container">Tour Pedia</div>
                    </Navbar.Brand>
                    
                    <div className="nav-profile-container">
                        <div className="nav-item-link-container">
                            <div className="nav-name-container">{name}</div>
                        </div>
                    </div>
                </Navbar>
            ) : null
        }
        </React.Fragment>
    );
}
 
export default withRouter(NavBar);