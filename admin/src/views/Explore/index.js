import React, {useState, useEffect} from 'react';
import {Modal, Fade, Backdrop} from '@material-ui/core';
import { toast } from 'react-toastify';

import CategoryCard from '../../components/CategoryCard';
import CountryCard from '../../components/CountryCard';
import PlaceCard from '../../components/PlaceCard';
import UploadExplore from '../../components/UploadExplore';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import exploreService from "../../services/exploreService";

const Explore = () => {
    const [curSelection, setCurSelection] = useState("category");
    const [openModal, setOpenModal] = useState(false);

    const [category, setCategory] = useState([]);
    const [country, setCountry] = useState([]);
    const [place, setPlace] = useState([]);

    const handleOnClose = async () => {
        setOpenModal(false);
        await fetchData();
    }

    const fetchData = async () => {
        let data = await exploreService.getAllExplore("category");
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        data = data.data;
        
        let formattedData = [];
        for (const cat of data) {
            formattedData.push({
                name: cat.name,
                description: cat.description,
                banner: cat.banner,
                id: cat._id,
            });
        }
        setCategory(formattedData);

        data = await exploreService.getAllExplore("country");
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        data = data.data;
        
        formattedData = [];
        for (const coun of data) {
            formattedData.push({
                name: coun.name,
                description: coun.description,
                banner: coun.banner,
                id: coun._id,
            });
        }
        setCountry(formattedData);

        data = await exploreService.getAllExplore("place");
        if (data.status >= 300) {
            toast.error(data.message, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        data = data.data;
        
        formattedData = [];
        for (const plc of data) {
            formattedData.push({
                name: plc.name,
                description: plc.description,
                banner: plc.banner,
                id: plc._id,
                country: plc.country._id,
                category: []
            });
            for (const cat of plc.category) {
                formattedData[formattedData.length - 1].category.push(cat._id);
            }
        }
        setPlace(formattedData);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="explore-main-container">

                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openModal}>
                        <div>
                            <UploadExplore
                                uploadType={curSelection}
                                handleOnClose={handleOnClose}
                                country={country}
                                category={category}
                                isUpdate={false}
                                explore={""}
                            />
                        </div>
                    </Fade>
                </Modal>

                <div className="row">
                    <div 
                        className={"col-6 col-lg-4 explore-section-title " + (curSelection === "category" ? "explore-section-selected" : "")}
                        onClick={() => {
                            setCurSelection("category");
                        }}
                    >Category</div>
                    <div 
                        className={"col-6 col-lg-4 explore-section-title " + (curSelection === "country" ? "explore-section-selected" : "")}
                        onClick={() => {
                            setCurSelection("country");
                        }}
                    >Country</div>
                    <div 
                        className={"col-6 col-lg-4 explore-section-title " + (curSelection === "place" ? "explore-section-selected" : "")}
                        onClick={() => {
                            setCurSelection("place");
                        }}
                    >Place</div>
                </div>

                <br />

                <button 
                    className="btn btn-secondary explore-button"
                    onClick={() => setOpenModal(true)}
                >
                    Upload {curSelection === "country" ? "Country" : ""} {curSelection === "place" ? "Place" : ""} {curSelection === "category" ? "Category" : ""}
                </button>

                <br />

                <div className="row">
                {
                    curSelection === "category" ? (
                        category.map((cat, index) => (
                            <div key={index} className="col-md-6 col-12">
                                <CategoryCard
                                    category={cat}
                                    handleOnClose={handleOnClose}
                                />
                            </div>
                        ))
                    ) : null
                }
                </div>

                <div className="row">
                {
                    curSelection === "country" ? (
                        country.map((coun, index) => (
                            <div key={index} className="col-md-6 col-12">
                                <CountryCard
                                    country={coun}
                                    handleOnClose={handleOnClose}
                                />
                            </div>
                        ))
                    ) : null
                }
                </div>

                <div className="row">
                {
                    curSelection === "place" ? (
                        place.map((plc, index) => (
                            <div key={index} className="col-md-6 col-12">
                                <PlaceCard
                                    place={plc}
                                    handleOnClose={handleOnClose}
                                    country={country}
                                    category={category}
                                />
                            </div>
                        ))
                    ) : null
                }
                </div>
            </div>
        </LayoutWrapper>
     );
}
 
export default Explore;