import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const EditGuide = () => {
    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1 style={{textAlign: 'center'}}>EditGuide Page</h1>
        </LayoutWrapper>
     );
}
 
export default EditGuide;