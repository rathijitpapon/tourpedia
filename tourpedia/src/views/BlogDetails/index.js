import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import Lightbox from 'react-image-lightbox';
import {Image, Carousel} from 'react-bootstrap';
import parse from 'html-react-parser';
import {Link} from 'react-router-dom';

import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import blogService from "../../services/blogService";


const BlogDetails = (props) => {
    const blogId = props.match.params.blogId;

    const [loading, setLoading] = useState(true);
    const color = "#ffffff";
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const [blog, setBlog] = useState({});
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState([]);

    const fetchData = async () => {
        setLoading(true);

        const data = await blogService.getBlogById(blogId);
        if (data.status >= 300) {
            setNotFound(true);
        }
        else {
            setNotFound(false);
            setBlog(data.data);
            setImages(data.data.imageURL);
            setDescription(parse(data.data.description));
            setCategory(data.data.category);
        }
        
        setLoading(false);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
                active={loading}
                spinner={
                    <ClipLoader color={color} loading={loading} size={50} />
                }
                className="loading-height"
            >
                {
                    notFound ? (
                        <div className="event-details-not-found">
                            Currently this blog is not exist
                        </div>
                    ) : (
                        <div>
                            <br />
                            <div className="blog-details-title">{blog.title}</div>
                            <div
                                className="blog-details-category"
                            >
                                {
                                    category.map((ctg, index) => (
                                        <React.Fragment key={index}>
                                        <Link
                                            className="event-details-category"
                                            to={"/category/" + ctg._id.name}
                                        >
                                        {ctg._id.name}
                                        </Link> &nbsp; </React.Fragment>
                                    ))
                                }
                            </div>
                            
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
                                <div className="col-1"></div>
                                <div
                                    className="col-10"
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
                                                        className="blog-details-image-carousel"
                                                        src={image}
                                                    />
                                                </Carousel.Item>
                                            ))
                                        }
                                    </Carousel>
                                </div>
                            </div>

                            <br />
                            <div 
                                className="blog-details-description-container"
                            >
                                {description}
                            </div>
                            <br /><br />
                        </div>
                    )
                }
            </LoadingOverlay>
        </LayoutWrapper>
     );
}
 
export default BlogDetails;