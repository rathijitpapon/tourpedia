import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Guide = () => {
    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1 style={{textAlign: 'center'}}>Guide Page</h1>
        </LayoutWrapper>
     );
}
 
export default Guide;