import React from 'react';
import PropTypes from 'prop-types';

import NavBar from "../../components/Navbar";

import "./styles.css";

const LayoutWrapper = (props) => {

    return ( 
        <div>
            <NavBar />
            <div className="layout-wrapper-container">
                {props.children}
            </div>
        </div>
     );
}

LayoutWrapper.propTypes = {
    children: PropTypes.node
}
 
export default LayoutWrapper;