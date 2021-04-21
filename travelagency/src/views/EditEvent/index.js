import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const EditEvent = () => {
    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1 style={{textAlign: 'center'}}>EditEvent Page</h1>
        </LayoutWrapper>
     );
}
 
export default EditEvent;