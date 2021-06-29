import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Post = () => {

    const fetchData = async () => {
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1>Post Page</h1>
        </LayoutWrapper>
     );
}
 
export default Post;