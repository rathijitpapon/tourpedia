import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import userAuthService from '../../services/userAuthService';

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import "./styles.css";

const LayoutWrapper = (props) => {

    const fetchData = () => {
        const data = userAuthService.getSavedAuthInfo();
        if (!data) {
            props.history.push("/");
        }
    }

    useEffect(() => {
        fetchData();
    });

    return ( 
        <div className="layout-wrapper-container">
            <Sidebar />
            <div className="layout-remaining-container">
                <Navbar />
                <div className="layout-body-container">
                    {props.children}
                </div>
            </div>
        </div>
     );
}

LayoutWrapper.propTypes = {
    children: PropTypes.node
}
 
export default withRouter(LayoutWrapper);