import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Category = () => {

    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1>Category Page</h1>
        </LayoutWrapper>
     );
}
 
export default Category;