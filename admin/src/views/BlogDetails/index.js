import React, {useState, useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import LoadingOverlay from 'react-loading-overlay';
import {Image, Carousel} from 'react-bootstrap';
import parse from 'html-react-parser';
import { toast } from 'react-toastify';

import LayoutWrapper from "../../layouts/LayoutWrapper";
import "./styles.css";

import blogService from "../../services/blogService";

const BlogDetails = (props) => {
    const blogId = props.match.params.blogId;

    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(true);
    const color = "#ffffff";

    const [blog, setBlog] = useState({});
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");

    const fetchData = async () => {
        setLoading(true);

        const data = await blogService.getBlogById(blogId);
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
            setLoading(false);
            setNotFound(true);
            return;
        }

        setBlog(data.data);
        setImages(data.data.imageURL);
        setDescription(parse(data.data.description));
        setNotFound(false);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId]);

    return ( 
        <LayoutWrapper>
            <LoadingOverlay
                active={loading}
                spinner={
                    <ClipLoader color={color} loading={loading} size={50} />
                }
                className="blog-details-main-container"
            >
                {
                    notFound ? (
                        <div className="blog-details-not-found">
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
                                        <span
                                            className="event-details-category"
                                        >
                                        {ctg._id.name}
                                        </span> &nbsp; </React.Fragment>
                                    ))
                                }
                            </div>

                            <div className="row">
                                <div className="col-1"></div>
                                <div
                                    className="col-10"
                                    style={{
                                        marginBottom: '20px'
                                    }}
                                >
                                    <Carousel
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