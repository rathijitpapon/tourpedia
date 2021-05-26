import React, {useState, useEffect} from 'react';
import Carousel from "react-multi-carousel";

import PlaceCard from '../../components/PlaceCard';
import TravelAgencyCard from '../../components/TravelAgencyCard';
import BlogCard from '../../components/BlogCard';
import EventCard from '../../components/EventCard';
import LayoutWrapper from "../../layouts/LayoutWrapper";

import "react-multi-carousel/lib/styles.css";
import "./styles.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        partialVisibilityGutter: 50
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        partialVisibilityGutter: 50
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        partialVisibilityGutter: 30
    }
}

const CategoryDetails = () => {
    const [placeData, setPlaceData] = useState([]);
    const [travelAgencyData, setTravelAgencyData] = useState([]);
    const [blogData, setBlogData] = useState([]);
    const [eventData, setEventData] = useState([]);

    const fetchData = async () => {
        let data = [];
        for (let i = 0; i < 51; i++) {
            data.push({
                url: 'kasol',
                image: 'https://www.hlimg.com/images/deals/360X230/deal_iimage28019-1.jpg?q=70&w=480&dpr=1.0',
                place: 'Kasol',
                details: 'Kasol is a village and a popular destination in Himachal mothered by the Parvati valley. It is known for its thrilling treks, flavoursome food, roaring river and heartfelt humanity.',
            });
        }
        setPlaceData(data);

        data = [];
        for (let i = 0; i < 51; i++) {
            data.push({
                url: 'iitm',
                image: 'https://www.indian-travel-places.com/wp-content/uploads/2019/02/iitm.png',
                name: 'Indian Internation Travel Mart',
            });
        }
        setTravelAgencyData(data);

        data = [];
        for (let i = 0; i < 51; i++) {
            data.push({
                url: 'rathijit/rafting-at-kull-0103w8101',
                image: 'https://i0.wp.com/glacierguides.com/wp-content/uploads/2019/09/IMG_1615.jpg?fit=3456%2C2304&ssl=1',
                title: 'Rafting at Kullu',
                author: 'Rathijit Paul',
            });
        }
        setBlogData(data);

        data = [];
        for (let i = 0; i < 51; i++) {
            data.push({
                url: 'iitm/trekking-at-kasol-march-2021-1063h7282',
                image: 'https://i0.wp.com/glacierguides.com/wp-content/uploads/2019/09/IMG_1615.jpg?fit=3456%2C2304&ssl=1',
                title: 'Trekking at Kasol',
                date: '20-28 March, 2021',
                agency: 'IITM Himachal',
            });
        }
        setEventData(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="category-details-title">Trekking</div>
            <br />
            <div className="category-details-text">
                <p>
                    Trekking is a form of walking, undertaken with the specific purpose of exploring and enjoying the scenery. It usually takes place on trails in areas of relatively unspoiled wilderness.
                </p>
                <p>
                    Trekking is a form of walking, undertaken with the specific purpose of exploring and enjoying the scenery. It usually takes place on trails in areas of relatively unspoiled wilderness.
                </p>
                <p>
                    The great mountain ranges are some of the most beautiful and interesting areas of the world to visit. As they are often not served by roads, they can also be the most remote and difficult places to get to and the only real way to see them is on foot. For some people the trekking may be an end in itself, for others it is a means to enjoy the magnificent panoramas and often the peoples of the mountains with their culture, traditions and religions provide an equal interest to the scenery.
                </p>
            </div>
            <br />

            <div className="category-details-section-title">
                Popular Places of Trekking
            </div>
            <Carousel
                partialVisible={true}
                responsive={responsive}
            >
            {
                placeData.map((data, index) => (
                    <div
                        key={index}
                        
                    >
                        <PlaceCard 
                            url={data.url}
                            image={data.image}
                            place={data.place}
                            details={data.details}
                        />
                    </div>
                ))
            }
            </Carousel>

            <br />

            <div className="category-details-section-title">
                Popular Tour Events of Trekking
            </div>
            <Carousel
                partialVisible={true}
                responsive={responsive}
            >
            {
                eventData.map((data, index) => (
                    <div
                        key={index}
                        
                    >
                        <EventCard 
                            url={data.url}
                            image={data.image}
                            title={data.title}
                            date={data.date}
                            agency={data.agency}
                        />
                    </div>
                ))
            }
            </Carousel>

            <br />

            <div className="category-details-section-title">
                Travel Agencies
            </div>
            <Carousel
                partialVisible={true}
                responsive={responsive}
            >
            {
                travelAgencyData.map((data, index) => (
                    <div
                        key={index}
                        
                    >
                        <TravelAgencyCard 
                            url={data.url}
                            image={data.image}
                            name={data.name}
                        />
                    </div>
                ))
            }
            </Carousel>

            <br />

            <div className="category-details-section-title">
                Popular Blogs of Trekking
            </div>
            <Carousel
                partialVisible={true}
                responsive={responsive}
            >
            {
                blogData.map((data, index) => (
                    <div
                        key={index}
                        
                    >
                        <BlogCard 
                            url={data.url}
                            image={data.image}
                            title={data.title}
                            author={data.author}
                        />
                    </div>
                ))
            }
            </Carousel>
        </LayoutWrapper>
     );
}
 
export default CategoryDetails;