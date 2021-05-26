import React, {useEffect, useState} from 'react';
import TrendingCards from '../../components/TrendingCards';
import LayoutWrapper from "../../layouts/LayoutWrapper";
import {getTrendingBlogs} from '../../assets/trendingBlogs';
import {getPlaceInfo} from '../../assets/placeInfoService';
import {getTrendingEvents} from '../../assets/trendingEvents';
import "./styles.css";

function GenerateTextBox(title, text, type) {
    return (
        <div className={`pedia-text-container${type}`}>
            <h4>{title}</h4>
            <p>
                {text}
            </p>
        </div>
    );
}

const PlaceDetails = (props) => {
    const [loaded, setLoaded] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [events, setEvents] = useState([]);
    const [placeInfo, setPlaceInfo] = useState({});

    const fetchData = async () => {
        setBlogs(getTrendingBlogs().map(item => (
            {
                src: item.image_src,
                text_line1: item.title,
                text_line2: item.author,
                label: item.tag,
                path: item.path
            }
        )));

        setEvents(getTrendingEvents().map(item => (
            {
                src: item.image_src,
                text_line1: item.title,
                text_line2: item.dates,
                label: item.tag,
                path: item.path
            }
        )));

        setPlaceInfo(getPlaceInfo());
        setLoaded(true);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            {loaded && <>
                <div className="page-cover-wrap">
                    <h4>{placeInfo.placeName}</h4>
                    <img src={placeInfo.cover_img} alt="Cover Img" className="page-cover"/>
                </div>
                {GenerateTextBox("Pedia", placeInfo.pedia, "")}
                {GenerateTextBox("Things to Explore at Kasol", placeInfo.to_visit.description, "")}
                {placeInfo.to_visit.places.map(place => (
                    GenerateTextBox(place.title, place.description, "-a")
                ))}
                {GenerateTextBox("Food", placeInfo.food.description, "")}
                {placeInfo.food.items.map(item => (
                    GenerateTextBox(item.title, item.description, "-a")
                ))}
                {GenerateTextBox("Travel Guide", placeInfo.travel_guide, "")}
                <TrendingCards title="Trending Blogs" cardData={blogs} />
                <TrendingCards title="Trending Events" cardData={events} />
            </>}
        </LayoutWrapper>
     );
}
 
export default PlaceDetails;