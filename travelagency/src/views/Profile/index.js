import React, {useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Profile = () => {
    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1 style={{textAlign: 'center'}}>Profile Page</h1>
        </LayoutWrapper>
     );
}
 
export default Profile;