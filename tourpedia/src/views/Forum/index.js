import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Forum = () => {

    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1>Forum Page</h1>
        </LayoutWrapper>
     );
}
 
export default Forum;