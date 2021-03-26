import React from 'react';
import PropTypes from 'prop-types';

import "./styles.css";

const LayoutWrapper = (props) => {

    return ( 
        <div>
            {props.children}
        </div>
     );
}

LayoutWrapper.propTypes = {
    children: PropTypes.node
}
 
export default LayoutWrapper;