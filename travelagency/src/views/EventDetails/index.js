import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const EventDetails = () => {
    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1 style={{textAlign: 'center'}}>EventDetails Page</h1>
        </LayoutWrapper>
     );
}
 
export default EventDetails;