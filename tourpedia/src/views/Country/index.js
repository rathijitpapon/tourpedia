import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Country = () => {

    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1>Country Page</h1>
        </LayoutWrapper>
     );
}
 
export default Country;