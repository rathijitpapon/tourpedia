import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Search = (props) => {

    const searchKey = props.match.params.key;

    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1>Search Page</h1>
            <h2>{searchKey}</h2>
        </LayoutWrapper>
     );
}
 
export default Search;