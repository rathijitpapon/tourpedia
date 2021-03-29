import React, {useState, useEffect} from 'react';

import dummyService from "../../services/dummyService";

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Home = () => {
    const [apiData, setApiData] = useState("");

    const fetchData = async () => {
        const response = await dummyService.getData();

        if(response.status === 200) {
            setApiData(response.data.data);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <h1 className="home-title-container">Admin Dashboard</h1>
            {apiData.length ? (
                <h2 className="home-title-container">{apiData}</h2>
            ) : null}
        </LayoutWrapper>
     );
}
 
export default Home;