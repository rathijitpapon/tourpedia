import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Carousel from "react-multi-carousel";

import PlaceCard from "../../components/PlaceCard";
import LayoutWrapper from "../../layouts/LayoutWrapper";
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

const Category = () => {

    const [categoryData, setCategoryData] = useState([]);

    const fetchData = async () => {
        const data = [];
        console.log("Pushed");

        for (let i = 0; i < 10; i++) {
            data.push({
                category: 'Trekking',
                url: 'trekking',
                places: [
                    {
                        url: 'kasol',
                        place: 'Kasol',
                        details: 'Kasol is a village and a popular destination in Himachal mothered by the Parvati valley. It is known for its thrilling treks, flavoursome food, roaring river and heartfelt humanity.',
                        image: 'https://www.hlimg.com/images/deals/360X230/deal_iimage28019-1.jpg?q=70&w=1366&dpr=1.0',
                    },
                    {
                        url: 'tosh',
                        place: 'Tosh',
                        details: 'Tosh is a village and a popular destination in Himachal mothered by the Parvati valley. It is known for its thrilling treks, flavoursome food, roaring river and heartfelt humanity.',
                        image: 'https://www.hlimg.com/images/deals/360X230/deal_iimage28019-3.jpg?q=70&w=1366&dpr=1.0',
                    },
                    {
                        url: 'meghalaya',
                        place: 'Meghalaya',
                        details: 'Meghalaya is best known as Scotland of the east with its picture-perfect location and paradise for nature lovers. It is home to numerous waterfalls, dark caves, lush green valleys, picturesque lakes, and more.',
                        image: 'https://www.remotelands.com/travelogues/app/uploads/2018/09/Meghalaya-header-1536x768.jpg',
                    },
                    {
                        url: 'banderban',
                        place: 'Banderban',
                        details: 'Bandarban is a popular destination for its adventurous, distinctive and scenic landscape. The beauty of its forests, numerous waterfalls, tallest peaks and lifestyles of 15 different ethnic groups attract tourists from both home and abroad.',
                        image: 'https://image.shutterstock.com/image-photo/amia-khum-waterfall-bandarban-bangladesh-600w-1765012712.jpg'
                    },
                    {
                        url: 'alikadam',
                        place: 'Alikadam',
                        details: 'Alikadam Cave is a wonderful tourist spot in Lama. It is about 1500 feet high from sea level. In good weather, you can have a view of  Maheskhali Island, Bay of Bengal, Matamuhuri River and Lama Upazilla at a glance.',
                        image: 'https://www.localguidesconnect.com/t5/image/serverpage/image-id/368210iA819FF88714C01CE/image-size/large?v=v2&px=999',
                    }
                ],
            });
        }
        setCategoryData(data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return ( 
        <LayoutWrapper>
            <div className="category-title">
                Tour Category List
            </div>

            {
                categoryData.map((data, index1) => (
                    <React.Fragment
                        key={index1}
                    >
                        <Link to={'/category/' + data.url} className="category-section-title">
                            {data.category}
                        </Link>
                        <div>
                            <br />
                        </div>
                        <Carousel
                            partialVisible={true}
                            responsive={responsive}
                        >
                        {
                            data.places.map((place, index2) => (
                                <PlaceCard 
                                    key={index2}
                                    url={place.url}
                                    image={place.image}
                                    place={place.place}
                                    details={place.details}
                                />
                            ))
                        }
                        </Carousel>

                        <br />
                    </React.Fragment>
                ))
            }
        </LayoutWrapper>
     );
}
 
export default Category;