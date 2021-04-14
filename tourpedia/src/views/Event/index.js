import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Event = () => {

    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1>Event Page</h1>
        </LayoutWrapper>
     );
}
 
export default Event;