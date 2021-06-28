import React, {useState, useEffect} from 'react';
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import Lightbox from 'react-image-lightbox';
import {Image, Carousel} from 'react-bootstrap';
import parse from 'html-react-parser';
import {Link} from 'react-router-dom';

import LayoutWrapper from "../../layouts/LayoutWrapper";

import "./styles.css";

import blogData from "../../assets/dummyData/blog.json";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const BlogDetails = (props) => {
    const blogName = props.match.params.blogName;

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [isImageOpen, setImageOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const [blog, setBlog] = useState({});
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");

    const fetchData = async () => {
        let isFound = false;

        const splitted = blogName.split('-');
        for (const data of blogData) {
            if (data.id === splitted[splitted.length - 1]) {
                isFound = true;
                setBlog(data);
                setImages([...data.imageURL]);
                setDescription(parse(data.description));
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
                                            blog.category.map((ctg, index) => (
                                                <React.Fragment key={index}>
                                                <Link
                                                    className="event-details-category"
                                                    to={"/category/" + ctg.name}
                                                >
                                                {ctg.name}
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
                    </>
                )
            }
        </LayoutWrapper>
     );
}
 
export default BlogDetails;