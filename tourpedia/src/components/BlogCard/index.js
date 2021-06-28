import React from 'react';
import {Link} from 'react-router-dom'
import {Image} from 'react-bootstrap';

import "./styles.css";

const BlogCard = (props) => {
    const blog = props.blog;

    return ( 
        <Link
            to={"/blog/" + blog.title + '-' + blog.id}
            className="blog-card-main"
        >
            <Image
                className="blog-card-image"
                src={blog.imageURL[0]}
                alt="blog img"
            />
            <div className="blog-card-middle">
               <div className="blog-card-title">
                    {blog.title}
                </div>
            </div>
        </Link>
     );
}
 
export default BlogCard;