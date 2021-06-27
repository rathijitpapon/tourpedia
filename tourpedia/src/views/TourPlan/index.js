import React, {useState, useEffect} from 'react';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import Lightbox from 'react-image-lightbox';
import {Image, Carousel} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import MultiCarousel from "react-multi-carousel";
import {MdLocationOn, MdHotel} from 'react-icons/md';
import ReactPlayer from 'react-player';
import DayPlanCard from '../../components/DayPlanCard';
import PlaceCard from '../../components/PlaceCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import 'react-image-lightbox/style.css';
import "./styles.css";

import tourplanData from "../../assets/dummyData/tourplan.json";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1000 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1000, min: 800 },
        items: 3
    },
    miniTablet: {
        breakpoint: { max: 800, min: 600 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 600, min: 0 },
        items: 1
    }
}

const TourPlan = (props) => {

    const tourplanName = props.match.params.tourplanName;
    // const agencyName = props.match.params.agencyName;

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const [tourplan, setTourplan] = useState({});
    const [images, setImages] = useState([]);

    const handleSavePlan = () => {

    }

    const handleDownloadPlan = () => {

    }

    const fetchData = async () => {
        let isFound = false;

        const splitted = tourplanName.split('-');
        for (const data of tourplanData) {
            if (data.id === splitted[splitted.length - 1]) {
                isFound = true;
                setTourplan(data);

                setImages([data.banner, ...data.imageURL]);

                break;
            }
        }

        // await new Promise(resolve => setTimeout(resolve, 2000));

        setNotFound(!isFound);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            {
                loading ? (
                    <div className="sweet-loading brief-details-spinner">
                        <ClipLoader color={"#ffffff"} loading={loading} css={override} size={150} />
                    </div>
                ) : (
                    <>
                        {
                            notFound ? (
                                <div className="tourplan-not-found">
                                    Currently this tourplan is not exist
                                </div>
                            ) : (
                                <div>
                                    <br />
                                    {isImageOpen && (
                                        <Lightbox
                                            mainSrc={images[imageIndex]}
                                            nextSrc={images[(imageIndex + 1) % images.length]}
                                            prevSrc={images[(imageIndex + images.length - 1) % images.length]}
                                            onCloseRequest={() => setImageOpen(false)}
                                            onMovePrevRequest={() =>
                                                setImageIndex(
                                                    (imageIndex + images.length - 1) % images.length
                                                )
                                            }
                                            onMoveNextRequest={() =>
                                                setImageIndex(
                                                    (imageIndex + 1) % images.length
                                                )
                                            }
                                        />
                                    )}

                                    <div className="row">
                                        <div 
                                            className="col-lg-7 col-12"
                                            style={{
                                                marginBottom: '20px'
                                            }}
                                        >
                                            <Carousel
                                                activeIndex={imageIndex}
                                                onSelect={(selectedIndex, e) => {
                                                    setImageIndex(selectedIndex);
                                                }}
                                                fade prevIcon={null} 
                                                nextIcon={null}
                                            >
                                                {
                                                    images.map((image, index) => (
                                                        <Carousel.Item 
                                                            interval={5000} 
                                                            key={index}
                                                        >
                                                            <Image
                                                                onClick={() => setImageOpen(true)}
                                                                className="tourplan-img-container"
                                                                src={image}
                                                            />
                                                        </Carousel.Item>
                                                    ))
                                                }
                                            </Carousel>
                                        </div>

                                        <div className="col-lg-5 col-12">
                                            <div className="tourplan-title">{tourplan.name}</div>
                                            <div 
                                                className="tourplan-travelagency"
                                            >
                                                <MdLocationOn
                                                    style={{
                                                        fontSize: '22px',
                                                    }}
                                                /> <Link 
                                                    to={"/country/" + tourplan.country.name}
                                                >
                                                 <strong>{tourplan.country.name}</strong>
                                                </Link>
                                            </div>
                                            <div
                                                style={{
                                                    lineHeight: '45px'
                                                }}
                                            >
                                               {
                                                   tourplan.category.map((ctg, index) => (
                                                       <React.Fragment key={index}>
                                                       <Link
                                                        className="tourplan-category"
                                                        to={"/category/" + ctg.name}
                                                        >
                                                        {ctg.name}
                                                       </Link> &nbsp; </React.Fragment>
                                                   ))
                                               }
                                            </div>

                                            <br />

                                            <div 
                                                className="row"
                                               style={{
                                                   marginBottom: "10px",
                                               }}
                                            >
                                            <div 
                                                className="tourplan-side-items col-6"
                                            >
                                                <strong>Tour Style: </strong>{tourplan.groupOption}
                                            </div>
                                            <div 
                                                className="tourplan-side-items col-6"
                                            >
                                                <strong>Duration: </strong>{tourplan.duration} Days
                                            </div>
                                            
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-6">
                                                    <span
                                                        style={{
                                                            fontSize: "18px",
                                                            fontWeight: "bold",
                                                        }}
                                                        >Total Cost</span>
                                                        <div style={{
                                                            fontSize: "20px",
                                                        }}>
                                                        US <strong 
                                                            className="tourplan-cost"
                                                            >${tourplan.totalCost}
                                                        </strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <br />

                                    <div 
                                        className="tourplan-section-title"
                                    >
                                        Destinations For This Tour
                                    </div>
                                    <MultiCarousel
                                        responsive={responsive}
                                    >
                                    {
                                        tourplan.place.map((plc, index) => (
                                            <PlaceCard 
                                                key={index}
                                                place={plc}
                                            />
                                        ))
                                    }
                                    </MultiCarousel>

                                    <br />

                                    <div 
                                        className="tourplan-section-title"
                                    >
                                        Description
                                    </div>
                                    <div className="tourplan-description">
                                        {tourplan.description}
                                    </div>

                                    <br />

                                    <ReactPlayer
                                        style={{
                                            display: 'block',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                        }}
                                        width={"90%"}
                                        controls
                                        url={tourplan.videoURL}
                                    />

                                    <br />
                                    <br />

                                    <div 
                                        className="tourplan-section-title"
                                        style={{
                                            marginBottom: "20px",
                                        }}
                                    >
                                        Day Plan
                                    </div>
                                    {
                                        tourplan.dayPlan.map((plan, index) => (
                                            <DayPlanCard
                                                key={index}
                                                dayPlan={plan}
                                            />
                                        ))
                                    }

                                    <br />

                                    <div 
                                        className="tourplan-section-title"
                                    >
                                        <MdHotel style={{fontSize: "30px"}}/> &nbsp; Accomodation Options
                                    </div>
                                    <div>
                                        {
                                            tourplan.accomodationOption.map((acm, index) => (
                                                <span 
                                                key={index}
                                                className="tourplan-inclusion">{acm} &nbsp;</span> 
                                            ))
                                        }
                                    </div>
                                    <br />
                                    <br />

                                    <div 
                                        className="tourplan-bottom"
                                    >     
                                        <button 
                                            className="tourplan-save-button"
                                            onClick={handleSavePlan}
                                        >Save</button>
                                        <button 
                                            className="tourplan-enroll-button"
                                            onClick={handleDownloadPlan}
                                        >Download</button>           
                                    </div>

                                    <br />
                                    <br />
                                </div>
                            )
                        }
                    </>
                )
            }
        </LayoutWrapper>
     );
}
 
export default TourPlan;