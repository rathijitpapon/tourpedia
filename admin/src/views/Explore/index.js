import React, {useState, useEffect} from 'react';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

const Explore = () => {
    const [countryName, setCountryName] = useState("");
    const [countryDetails, setCountryDetails] = useState("");
    const [countryBanners, setCountryBanners] = useState([]);
    const [countryError, setCountryError] = useState("");

    const [categoryName, setCategoryName] = useState("");
    const [categoryDetails, setCategoryDetails] = useState("");
    const [categoryBanners, setCategoryBanners] = useState([]);
    const [categoryError, setCategoryError] = useState("");

    const handleCountrySubmit = () => {

    }

    const handleCategorySubmit = () => {

    }

    const fetchData = async () => {
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="explore-main-container">
                <div className="explore-item-title-container">Country Details</div>
                <div className="row explore-item-section-container">
                    <div className="col-md-6 col-12">
                        <div className="explore-input-title-container">Country</div>
                        <input
                            type="text"
                            id="email"
                            name="email" 
                            placeholder="Country Name"
                            value={countryName}
                            onChange={(e) => {setCountryName(e.target.value)}}
                            className="explore-text-input-container" 
                        />

                        <div className="explore-input-title-container">Description</div>
                        <input
                            type="text"
                            id="email"
                            name="email" 
                            placeholder="Country Description"
                            value={countryDetails}
                            onChange={(e) => {setCountryDetails(e.target.value)}}
                            className="explore-text-input-container" 
                        />
                    </div>
                    <div className="col-md-6 col-12">
                        List
                    </div>
                </div>

                <br />

                <div className="explore-item-title-container">Category Details</div>
                <div className="row explore-item-section-container">
                    <div className="col-md-6 col-12">
                        Input
                    </div>
                    <div className="col-md-6 col-12">
                        List
                    </div>
                </div>
            </div>
        </LayoutWrapper>
     );
}
 
export default Explore;