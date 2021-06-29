import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Forum = () => {

    const fetchData = async () => {
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1>Forum Page</h1>
        </LayoutWrapper>
     );
}
 
export default Forum;